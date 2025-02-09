export const subscriptionKey = 'subscription';
export const productKey = 'products';

import {Alert, EmitterSubscription, Linking, Platform} from 'react-native';
import {
  purchaseUpdatedListener,
  purchaseErrorListener,
  clearTransactionIOS,
  endConnection,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  getAvailablePurchases,
  getSubscriptions,
  initConnection,
  requestSubscription,
  getPurchaseHistory,
  presentCodeRedemptionSheetIOS,
  validateReceiptIos,
  Purchase,
  acknowledgePurchaseAndroid,
  getReceiptIOS,
  IapIosSk2,
  isIosStorekit2,
  getProducts,
  requestPurchase,
} from 'react-native-iap';
import {OS} from '../utils/keywords';
import {purchaseServerValidation, subscriptionServerValidation} from './axios';
import {storage, urls} from '../utils';
import {jwtDecode} from 'jwt-decode';
import {subscriptionDetailProp, SubsProp, ValidatedLocalData} from '../types';

const androidProductSku = [
  'mode1_2yr_onetime',
  'mode1_3yr_onetime',
  'mode2_2yr_onetime',
  'mode2_3yr_onetime',
];

const androidSubscriptionSku = ['mode1_sub', 'mode2_sub'];

const iosProductSku = [
  'mode_1_bi_yearly',
  'mode_1_3y_',
  'mode_2_2yearly',
  'mode_2_3yearly',

  // 'mode_1_2y',
  // 'mode_1_3y',
  // 'mode_2_2y',
  // 'mode_2_3y',
];

const iosSubscriptionSku = ['mode_1_m1', 'mode_1_y1', 'mode_2_m1', 'mode_2_y1'];

const subSkus: string[] = Platform.select({
  android: androidSubscriptionSku,
  ios: iosSubscriptionSku,
})!;

const prodSkus: string[] = Platform.select({
  android: androidProductSku,
  ios: iosProductSku,
})!;

// global variable
let purchaseUpdate: EmitterSubscription | null = null;
let purchaseError: EmitterSubscription | null = null;

export const verifySubscriptionsInLocal = (): boolean => {
  const currentDate = new Date();
  const localData = getSubscriptionDetails();
  return new Date(localData?.to) >= currentDate;
};

export const verifySubscriptionFromBackend = async () => {
  if (verifySubscriptionsInLocal()) {
    const subscription = getSubscriptionDetails();

    const isValidatedFromServer = await subscriptionServerValidation(
      urls.appName,
      subscription?.productId,
      subscription?.token!,
    );

    if (!isValidatedFromServer?.data?.success) {
      return false;
    } else {
      const data = isValidatedFromServer?.data?.data;
      const validatedData = {
        purchaseDate: data?.startTimeMillis || data?.purchaseTimeMillis,
        expiresDate: data?.expiryTimeMillis,
        originalPurchaseDate: data?.startTimeMillis || data?.purchaseTimeMillis,
        productId: subscription?.productId,
        transactionId: subscription?.transactionId,
        originalTransactionId: subscription?.transactionId,
        type: subscription?.subscriptionType,
        cancelReason: data?.cancelReason ?? null,
      };
      return updatePaymentLocally(
        {purchaseToken: subscription?.token},
        validatedData,
      );
    }
  } else {
    return false;
  }
};

export const verifyOneTimePurchaseInLocal = (): boolean => {
  const currentDate = new Date();
  const localData = getNonRenowingSubscriptionDetails();
  console.log('localData : ', localData);

  if (!localData?.productId || !localData?.from) {
    return false;
  }
  const fromDate = new Date(localData.from);
  const timeDifference = currentDate.getTime() - fromDate.getTime();
  const oneYearInMs = 365 * 24 * 60 * 60 * 1000;

  if (
    localData.productId === 'mode1_2yr_onetime' ||
    localData.productId === 'mode2_2yr_onetime'
  ) {
    return timeDifference < 2 * oneYearInMs;
  } else if (
    localData.productId === 'mode1_3yr_onetime' ||
    localData.productId === 'mode2_3yr_onetime'
  ) {
    return timeDifference < 3 * oneYearInMs;
  }

  return false;
};

export const getSubscriptionDetails = () => {
  const localData = storage.getString(subscriptionKey);
  const parsedData = localData ? JSON.parse(localData) : undefined;
  return parsedData;
};

export const getNonRenowingSubscriptionDetails = ():
  | ValidatedLocalData
  | undefined => {
  const localData = storage.getString(productKey);
  const parsedData = localData ? JSON.parse(localData) : undefined;

  if (!parsedData || !parsedData.from || !parsedData.productId) {
    return undefined;
  }
  const fromDate = new Date(parsedData?.from);

  let durationYears = 0;
  if (
    parsedData.productId === 'mode1_2yr_onetime' ||
    parsedData.productId === 'mode2_2yr_onetime'
  )
    durationYears = 2;
  else if (
    parsedData.productId === 'mode1_3yr_onetime' ||
    parsedData.productId === 'mode2_3yr_onetime'
  )
    durationYears = 3;

  const expiryTimestamp =
    fromDate.getTime() + durationYears * 365 * 24 * 60 * 60 * 1000;
  const expiryDate = new Date(expiryTimestamp);

  const formattedExpiryDate = expiryDate.toLocaleString();

  return {
    ...parsedData,
    to: formattedExpiryDate,
  };
};

const updateListener = () => {
  console.log('update listener called');
  purchaseUpdate = purchaseUpdatedListener(async purchase => {
    console.log('Listen to purchase update listener : ', purchase);
    await validateSubscription(purchase);
    await closeIapConnection().then(async res => {
      if (res) {
        await initIapConnection();
      }
    });
  });
  purchaseError = purchaseErrorListener(error => {
    console.log('Listened purchase error : ', error);
  });
  return true;
};

const initIapConnection = async () => {
  return await initConnection().then(() => {
    return Platform.OS === OS.ios
      ? clearTransactionIOS()
          .then(() => {
            return updateListener();
          })
          .catch(error => {
            console.log('Error clearing ios transaction : ', error);
            return false;
          })
      : flushFailedPurchasesCachedAsPendingAndroid()
          .then(() => {
            return updateListener();
          })
          .catch(error => {
            console.log('Error flushing android pending purchases : ', error);
            return false;
          });
  });
};

const closeIapConnection = async () => {
  return await endConnection()
    .then(res => {
      removeSubscriptionListener();
      console.log('Connection terminted...', res);
      return true;
    })
    .catch(error => {
      console.log('Connection  could not be terminated: ', error);

      return false;
    });
};

const removeSubscriptionListener = () => {
  purchaseUpdate?.remove();
  purchaseUpdate = null;
  purchaseError?.remove();
  purchaseError = null;
};

const hasAppstoreAccount = async () => {
  const isAvailable = await getSubscription();
  return isAvailable ? true : false;
};

const validateSubscription = async (purchase: Purchase) => {
  console.log('purchase to validate  : ', purchase);
  const receipt = purchase.transactionReceipt;

  if (receipt) {
    if (purchase?.purchaseToken) {
      acknowledgePurchaseAndroid({token: purchase.purchaseToken!})
        .then(res => {
          console.log('Aknowledged successfull : ', res);
        })
        .catch(error => {
          console.log('Erorr acknowledging purchase : ', error);
        });
    }
    if (Platform.OS === OS.android) {
      finishTransaction({purchase, isConsumable: false})
        .then(() => console.log('clear unConsumable transaction'))
        .catch(e =>
          console.log('Error while clearing unConsumable transaction: ', e),
        );
      console.log('Clear transaction');
    } else {
      finishTransaction({purchase, isConsumable: false})
        .then(() => console.log('clear unConsumable transaction'))
        .catch(e =>
          console.log('Error while clearing unConsumable transaction: ', e),
        );
      console.log('Clear transaction');
    }
  }

  if (Platform.OS === OS.android) {
    let isValidatedFromServer;
    if (purchase?.autoRenewingAndroid) {
      isValidatedFromServer = await subscriptionServerValidation(
        urls.appName,
        purchase?.productId,
        purchase?.purchaseToken!,
      );
    } else {
      isValidatedFromServer = await purchaseServerValidation(
        urls.appName,
        purchase?.productId,
        purchase?.purchaseToken!,
      );
    }

    if (!isValidatedFromServer?.data?.success) {
      return false;
    } else {
      const data = isValidatedFromServer?.data?.data;
      const validatedData = {
        purchaseDate: data?.startTimeMillis || data?.purchaseTimeMillis,
        expiresDate: data?.expiryTimeMillis,
        originalPurchaseDate: data?.startTimeMillis || data?.purchaseTimeMillis,
        productId: purchase?.productId,
        transactionId: purchase?.transactionId,
        originalTransactionId: purchase?.transactionId,
        type: purchase?.autoRenewingAndroid
          ? 'Subscription'
          : 'One Time Purchase',
        cancelReason: data?.cancelReason ?? null,
      };
      return updatePaymentLocally(purchase, validatedData);
    }
  } else {
    if (isIosStorekit2()) {
      console.log('Clear transaction');
      const iosValidationResponse = jwtDecode(
        purchase?.verificationResultIOS! || purchase?.verificationResult,
      );
      console.log('iosValidationResponse  sk2: ', iosValidationResponse);
      const validatedData = {
        purchaseDate: iosValidationResponse?.purchaseDate,
        expiresDate: iosValidationResponse?.expiresDate,
        originalPurchaseDate: iosValidationResponse?.originalPurchaseDate,
        productId: iosValidationResponse?.productId,
        transactionId: purchase?.transactionId,
        originalTransactionId: purchase?.transactionId,
        type:
          iosValidationResponse?.type === 'Auto-Renewable Subscription'
            ? 'Subscription'
            : 'One Time Purchase',
        cancelReason: iosValidationResponse?.cancelReason ?? null,
      };
      return updatePaymentLocally(purchase, validatedData);
    } else {
      // this is for ios storekit 1, you can ignore this part
      const receipt = purchase?.transactionReceipt
        ? purchase.transactionReceipt
        : await getReceiptIOS({forceRefresh: true});

      const receiptBody = {
        'receipt-data': receipt,
        password: '9182b02a2a674dfe821cfbf71da56d3f', // app shared secret, can be found in App Store Connect   process.env.APP_SHARED_SCRET,
        'exclude-old-transactions': true,
      };

      let iosValidationResponse = await validateReceiptIos({
        receiptBody,
        isTest: true,
      });
      console.log('iosValidationResponse : ', iosValidationResponse);

      return false;
    }
  }
};

const updatePaymentLocally = (purchase: Purchase, subDetail: SubsProp) => {
  console.log('detail : ', subDetail);
  const currentDate = new Date();
  const validatedLocalData = {
    from: subDetail?.purchaseDate
      ? new Date(Number(subDetail?.purchaseDate))
      : null,
    to: subDetail?.expiresDate
      ? new Date(Number(subDetail?.expiresDate))
      : null,
    token: purchase?.purchaseToken,
    packageName: urls?.appName,
    originalPurchaseDate: subDetail?.originalPurchaseDate,
    productId: purchase?.productId || subDetail?.productId,
    modified: currentDate?.toISOString(),
    transactionId: subDetail?.transactionId,
    originalTransactionId: subDetail?.originalTransactionId,
    subscriptionType: subDetail?.type,
    cancelReason: subDetail?.cancelReason,
  };

  console.log('updating local : ', validatedLocalData);
  if (
    validatedLocalData?.to &&
    new Date(validatedLocalData?.to) >= currentDate &&
    validatedLocalData.subscriptionType === 'Subscription'
  ) {
    storage.set(subscriptionKey, JSON.stringify(validatedLocalData));

    return true;
  } else if (validatedLocalData.subscriptionType !== 'Subscription') {
    storage.set(productKey, JSON.stringify(validatedLocalData));
    return true;
  } else {
    return false;
  }
};

// restoreSubs true means, we are restoring subscription and false mean restoring product
const getAvailablePurchase = async (restoreSubs: boolean) => {
  try {
    let purchases: Purchase[] = [];
    let activeSubscriptions = 0; // Track active subscriptions

    if (isIosStorekit2()) {
      // StoreKit 2: Loop through each SKU and get the latest transaction
      for (const sku of subSkus) {
        try {
          const transaction = await IapIosSk2.currentEntitlement(sku);
          console.log('sk2 transaction : ', transaction);

          if (
            transaction &&
            new Date(transaction.expirationDate) >= new Date()
          ) {
            updatePaymentLocally(
              {purchaseToken: ''},
              {
                purchaseDate: transaction.purchaseDate,
                expiresDate: transaction.expirationDate,
                productId: transaction.productID,
                transactionId: transaction.id,
                type:
                  transaction.productType === 'autoRenewable'
                    ? 'Subscription'
                    : 'One Time Purchase',
                originalPurchaseDate: transaction.originalPurchaseDate,
                originalTransactionId: transaction.id,
                cancelReason: null,
              },
            );
            if (restoreSubs && transaction.productType === 'autoRenewable') {
              activeSubscriptions++; // Count active subscriptions
            } else if (
              !restoreSubs &&
              transaction.productType !== 'autoRenewable'
            ) {
              activeSubscriptions++; // Count active product
            }
          }

          if (transaction) {
            purchases.push(transaction);
          }
        } catch (error) {
          console.log(
            'Error in getting available purchases (StoreKit 2):',
            error,
          );
        }
      }
    } else {
      // StoreKit 1: Restore all purchases
      purchases = await getAvailablePurchases();

      if (!purchases?.length) {
        return 0; // No subscriptions
      }

      for (const purchase of purchases) {
        if (purchase.purchaseToken || purchase.transactionReceipt) {
          const isValid = await validateSubscription(purchase);
          if (isValid && restoreSubs && purchase?.autoRenewingAndroid) {
            activeSubscriptions++;
          } else if (
            isValid &&
            !restoreSubs &&
            !purchase?.autoRenewingAndroid
          ) {
            activeSubscriptions++;
          }
        }
      }
    }

    console.log('✅ Restored purchases:', purchases);

    // Determine the correct return value
    if (activeSubscriptions > 0) {
      return activeSubscriptions; // 1 or more active subscriptions
    } else if (purchases.length > 0) {
      return -1; // Expired or canceled subscriptions
    } else {
      return 0; // No subscriptions found
    }
  } catch (error) {
    console.log('❌ Error in getting available purchases:', error);
    return 0;
  }
};

const getSubscription = async () => {
  try {
    const subs = await getSubscriptions({skus: subSkus});
    return subs;
  } catch (error) {
    console.log('Error in getting subscriptions: ', error);
    return null;
  }
};

const getAllProducts = async () => {
  try {
    const products = await getProducts({skus: prodSkus});
    return products;
  } catch (error) {
    console.log('Error in getting products : ', error);
    return null;
  }
};

const iapRequestPurchase = async (sku: string) => {
  try {
    const response = await requestPurchase({skus: [sku]});
    return response;
  } catch (error) {
    console.log('Error in iapRequestPurchase : ', error);
    return false;
  }
};

const iapRequestSubscription = (sku: string, offerToken?: string) => {
  try {
    return getSubscriptions({skus: [sku]})
      .then((subscription: any) => {
        console.log('ID : ', sku, subscription);
        if (subscription?.length === 0) {
          return false;
        }
        // let offerToken =
        //   Platform.OS === OS.android &&
        //   subscription[0]['subscriptionOfferDetails'][0]['offerToken'];
        // console.log('getSubscription response : ', subscription);
        let payload =
          Platform.OS === OS.android
            ? {
                sku,
                ...(offerToken && {
                  subscriptionOffers: [{sku, offerToken}],
                }),
              }
            : {
                sku,
              };
        return requestSubscription(payload)
          .then(async res => {
            console.log('Request Subscription response : ', res);
            return true;
          })
          .catch(error => {
            console.log('Failed to request subscription : ', error);

            return false;
          });
      })
      .catch(e => {
        console.log('Error in subscriptions: ', e);
        return false;
      });
  } catch (e) {
    console.log('Error: ', e);
    return false;
  }
};

const getHistory = async () => {
  try {
    const res = await getPurchaseHistory();
    return res;
  } catch (error) {
    console.log('Error in getting purchase history', error);
    return [];
  }
};

const fetchSubscriptions = async () => {
  const subscriptionsDetail: subscriptionDetailProp = [];
  return getSubscription()
    .then(res => {
      console.log('get subscriptions : ', res);
      if (res?.length === 0) {
        return false;
      }
      res?.map((sub: any) => {
        subscriptionsDetail.push(sub);
      });

      return subscriptionsDetail;
    })
    .catch(error => {
      console.log('Error  in getting user subscription details', error);

      return [];
    });
};

const cancelSubscription = () => {
  if (Platform.OS === OS.ios) {
    Linking.openURL(urls.iosUnscriptionUrl);
  } else {
    Linking.openURL(urls.androidUnscriptionUrl);
  }
};

const redeemPromoCode = async (promoCode?: string) => {
  Platform.OS === OS.android
    ? Linking.openURL(urls.androidRedeemUrl + promoCode)
    : await presentCodeRedemptionSheetIOS();
};

const verifyUserSubscriptionValidation = async () => {
  if (verifySubscriptionsInLocal()) {
    return true;
  } else {
    let availablePurchases = await getAvailablePurchase();
    return availablePurchases > 0;
  }
};

const handleRestore = async () => {
  if (verifySubscriptionsInLocal()) {
    Alert.alert(
      'Subscription Active',
      'You already have an active subscription.',
    );
    return;
  }

  let availablePurchases = await getAvailablePurchase(true);

  if (availablePurchases === 0) {
    Alert.alert('No Subscription', 'You have no active subscription.');
  } else if (availablePurchases > 0) {
    Alert.alert(
      'Subscription Restored',
      'Congrats! 🎉 Your subscription has been restored.',
    );
  } else {
    Alert.alert('Subscription Expired', 'Your subscription has expired!');
  }
};

const handleRestoreProduct = async () => {
  if (verifyOneTimePurchaseInLocal()) {
    Alert.alert('Product Active', 'You already have access to this product.');
    return;
  }

  let availablePurchases = await getAvailablePurchase(false);

  if (availablePurchases === 0) {
    Alert.alert('No Purchase Found', 'You have no purchased products.');
  } else if (availablePurchases > 0) {
    Alert.alert(
      'Product Restored',
      'Congrats! 🎉 Your product has been restored.',
    );
  } else {
    Alert.alert('Purchase Expired', 'Your previous purchase has expired!');
  }
};

export {
  initIapConnection,
  closeIapConnection,
  getAvailablePurchase,
  getHistory,
  getSubscription,
  iapRequestSubscription,
  updateListener,
  removeSubscriptionListener,
  fetchSubscriptions,
  cancelSubscription,
  redeemPromoCode,
  handleRestore,
  hasAppstoreAccount,
  validateSubscription,
  verifyUserSubscriptionValidation,
  getAllProducts,
  iapRequestPurchase,
  handleRestoreProduct,
};
