// import {Alert, EmitterSubscription, Linking, Platform} from 'react-native';
// import {
//   purchaseUpdatedListener,
//   purchaseErrorListener,
//   clearTransactionIOS,
//   endConnection,
//   finishTransaction,
//   flushFailedPurchasesCachedAsPendingAndroid,
//   getAvailablePurchases,
//   getSubscriptions,
//   initConnection,
//   requestSubscription,
//   getPurchaseHistory,
//   validateReceiptIos,
//   Purchase,
//   acknowledgePurchaseAndroid,
//   presentCodeRedemptionSheetIOS,
// } from 'react-native-iap';
// import {OS, storage, urls} from '../utils';
// import {subscriptionServerValidation} from './axios';

// export const keyName = 'subscription';

// const androidSub = [
//   'mode1-sub-12m',
//   'mode1-sub-1m',
//   'mode2-sub-12m',
//   'mode2-sub-1m',
// ];
// const androidInApp = [
//   'mode1_2yr_onetime',
//   'mode1_3yr_onetime',
//   'mode2_2yr_onetime',
//   'mode2_3yr_onetime',
// ];
// const iosSub = ['mode_1_m1', 'mode_1_y1', 'mode_2_m1', 'mode_2_y1'];
// const iosInApp = ['mode_1_2y', 'mode_1_3y', 'mode_2_2y', 'mode_2_3y'];

// const subscriptionIDs = Platform.OS === OS.android ? androidSub : iosSub;
// const inAppIDs = Platform.OS === OS.android ? androidInApp : iosInApp;

// type subscriptionDetailProp = {
//   amount: string;
//   micros: number;
//   saved?: number;
//   currencyCode?: string;
// }[];

// // global variable
// let purchaseUpdate: EmitterSubscription | null = null;
// let purchaseError: EmitterSubscription | null = null;

// const updateListener = () => {
//   console.log('update listener called');
//   purchaseUpdate = purchaseUpdatedListener(async purchase => {
//     console.log('Listen to purchase update listener : ', purchase);
//     const receipt = purchase.transactionReceipt;
//     if (receipt) {
//       handleSubscriptionPurchase(purchase);
//     }
//   });
//   purchaseError = purchaseErrorListener(error => {
//     console.log('Listened Received purchase error : ', error);
//   });
//   return true;
// };

// const initIapConnection = async () => {
//   return await initConnection().then(() => {
//     return Platform.OS === OS.ios
//       ? clearTransactionIOS()
//           .then(res => {
//             console.log('Cleared pending payments from billing skd: ', res);
//             return updateListener();
//           })
//           .catch(e => {
//             console.log('Error while clearing pending payments: ', e);
//             return false;
//           })
//       : flushFailedPurchasesCachedAsPendingAndroid()
//           .then(() => {
//             console.log('Cleared pending payments from billing skd');
//             return updateListener();
//           })
//           .catch(e => {
//             console.log('Error while clearing pending payments: ', e);
//             return false;
//           });
//   });
// };

// const closeIapConnection = async () => {
//   return await endConnection()
//     .then(res => {
//       console.log('Connection terminted...', res);
//       return true;
//     })
//     .catch(e => {
//       console.log('Connection  could not be terminated: ', e);
//       return false;
//     });
// };

// const removeSubscriptionListener = () => {
//   purchaseUpdate?.remove();
//   purchaseUpdate = null;
//   purchaseError?.remove();
//   purchaseError = null;
//   console.log('removed all listener');
// };

// const handleSubscriptionPurchase = async (purchase: Purchase) => {
//   if (Platform.OS === OS.android && purchase?.purchaseToken) {
//     //call Backend API

//     const serverResponse = await subscriptionServerValidation(
//       purchase.packageNameAndroid || '',
//       purchase.productId,
//       purchase.purchaseToken || '',
//     );
//     if (serverResponse.success) {
//       // await updateUserToPremium(userId!, true);  // If you wannt update your backend
//       acknowledgePurchaseAndroid({token: purchase.purchaseToken!})
//         .then(res => {
//           console.log('acknowledged purchase android', res);
//         })
//         .catch(error => {
//           console.log('error acknowledging purchase android', error);
//         });

// const localData = storage.getString(keyName);
// const parsedData = localData ? JSON.parse(localData) : undefined;
//       const currentDate = new Date();
//       const validatedLocalData = {
//         planId: 'monthly', // weakly, monthly, yearly
//         // userId: userId,
//         startDate: new Date(
//           Number(serverResponse.data?.startTimeMillis),
//         ).toString(),
//         endDate: new Date(
//           Number(serverResponse.data?.expiryTimeMillis),
//         ).toString(),
//         token: purchase.purchaseToken,
//         status: true,
//         price: serverResponse.data?.priceAmountMicros / 1000000,
//         currency: serverResponse.data?.priceCurrencyCode,
//         productId: purchase.productId,
//         modified: currentDate.toString(),
//         packageName: purchase.packageNameAndroid || '',
//       };
//       storage.set(keyName, JSON.stringify(validatedLocalData));
//     } else {
//       // await updateUserToPremium(userId!, false);   // If you wannt update your backend
//     }

//     console.log('server Validation rsponse : ', serverResponse);

//     finishTransaction({purchase, isConsumable: false})
//       .then(() => console.log('clear unConsumable transaction'))
//       .catch(e =>
//         console.log('Error while clearing unConsumable transaction: ', e),
//       );
//     console.log('Clear transaction');
//   } else {
//     const receiptBody = {
//       'receipt-data': purchase.transactionReceipt,
//       password: '9182b02a2a674dfe821cfbf71da56d3f', // app shared secret, can be found in App Store Connect
//     };
//     let res = await validateReceiptIos({receiptBody, isTest: true}); // change isTest to false in production mode
//     console.log(
//       'Validate Receipt Response from listener : ',
//       res?.latest_receipt_info,
//     );
//   }
//   closeIapConnection().then(() => initConnection());
// };

// const getAvailablePurchase = () => {
//   return getAvailablePurchases()
//     .then(products => {
//       return products;
//     })
//     .catch(e => {
//       console.log('Error in getting available purchases: ', e);
//       return [];
//     });
// };

// const getSubscription = () => {
//   return getSubscriptions({skus: [...subscriptionIDs, ...inAppIDs]})
//     .then(subs => {
//       console.log('get subscriptions Response : ', subs);
//       return subs;
//     })
//     .catch(e => {
//       console.log('Error in getting subscriptions: ', e);
//       return null;
//     });
// };

// const iapRequestSubscription = (sku: string) => {
//   try {
//     return getSubscriptions({skus: [sku]})
//       .then((subscription: any) => {
//         console.log('subscriptions : ', subscription);
//         if (subscription?.length === 0) {
//           return false;
//         }
//         let offerToken =
//           Platform.OS === OS.android &&
//           subscription?.length > 0 &&
//           subscription[0]['subscriptionOfferDetails'][0]['offerToken'];
//         console.log('getSubscription response : ', subscription);
//         let payload =
//           Platform.OS === OS.android
//             ? {
//                 sku: sku,
//                 ...(offerToken && {
//                   subscriptionOffers: [{sku: sku, offerToken}],
//                 }),
//               }
//             : {
//                 sku: sku,
//               };
//         return requestSubscription(payload)
//           .then(async res => {
//             console.log('Request Subscription response : ', res);
//             return true;
//           })
//           .catch(e => {
//             console.log('Failed to request subscription : ', e);
//             return false;
//           });
//       })
//       .catch(e => {
//         console.log('Error in subscriptions: ', e);
//         return false;
//       });
//   } catch (e) {
//     console.log('Error: ', e);
//     return false;
//   }
// };

// const getHistory = () => {
//   return getPurchaseHistory()
//     .then(res => {
//       console.log('Purchase history response : ', res);
//       return res;
//     })
//     .catch(e => {
//       console.log('Error in getting purchase history', e);
//       return [];
//     });
// };

// const fetchSubscriptions = async () => {
//   const subscriptionsDetail: subscriptionDetailProp = [];
//   return getSubscription()
//     .then(res => {
//       res?.map((sub: any) => {
//         if (Platform.OS === OS.android) {
//           let subscribe =
//             sub.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0];
//           subscriptionsDetail.push({
//             amount: subscribe?.formattedPrice,
//             micros: subscribe?.priceAmountMicros,
//             currencyCode: subscribe?.priceCurrencyCode,
//           });
//         } else {
//           subscriptionsDetail.push({
//             amount: sub.price,
//             micros: sub.price * 10000,
//             currencyCode: sub.currency,
//           });
//         }
//       });
//       console.log(subscriptionsDetail);
//       if (subscriptionsDetail.length > 0) {
//         let save = 0;
//         save =
//           (subscriptionsDetail[0]!.micros * 12 -
//             subscriptionsDetail[0]!.micros) /
//           1000000;
//         subscriptionsDetail[0]!.saved = save;
//       }
//       return subscriptionsDetail;
//     })
//     .catch(e => {
//       console.log('Error in getting user subscription details', e);
//       return [];
//     });
// };

// const cancelSubscription = (id?: number) => {
//   let productID = id === 0 ? subscriptionIDs[0] : subscriptionIDs[1];
//   if (Platform.OS === OS.ios) {
//     Linking.openURL(urls.iosUnscriptionUrl);
//   } else {
//     Linking.openURL(urls.androidUnscriptionUrl + productID);
//   }
// };

// const redeemPromoCode = async (promoCode?: string) => {
//   Platform.OS === OS.android
//     ? Linking.openURL(urls.androidRedeemUrl + promoCode)
//     : await presentCodeRedemptionSheetIOS();
// };

// const handleRestore = async () => {
//   const hasAlreadySubscription = verifySubscriptionsInLocal();
//   console.log('hasAlreadySubscription : ', hasAlreadySubscription);
//   let availablePurchases = [];
//   if (hasAlreadySubscription) {
//     return;
//   } else {
//     const subscription = await getAvailablePurchase();
//     availablePurchases = subscription.filter(
//       subscription => subscription.productId === subscriptionIDs[0],
//     );
//   }
//   if (availablePurchases.length === 0) {
//     // NO SUBSCRIPTION
//     Alert.alert(
//       'No subscription',
//       "You don't have any subscription before or expired",
//     );
//     return null;
//   } else {
//     handleSubscriptionPurchase(availablePurchases[0]!);
//     console.log('available purchase : ', availablePurchases);
//     return;
//   }
// };

// const verifySubscriptionsInLocal = () => {
//   try {
//     const localData = storage.getString(keyName);
//     const parsedData = localData ? JSON.parse(localData) : null;
//     console.log('local data : ', parsedData);
//     if (parsedData) {
//       const subscriptionValidTimeStr: string = parsedData!.endDate as string;

//       const subscriptionValidTime = new Date(subscriptionValidTimeStr);
//       const currentTime = new Date();

//       if (subscriptionValidTime >= currentTime) {
//         return true;
//       } else {
//         return false;
//       }
//     } else {
//       return false;
//     }
//   } catch (error) {
//     console.log('Error in verifying subscription : ', error);
//     return false;
//   }
// };

// export {
//   initIapConnection,
//   closeIapConnection,
//   getHistory,
//   getSubscription,
//   iapRequestSubscription,
//   updateListener,
//   removeSubscriptionListener,
//   fetchSubscriptions,
//   cancelSubscription,
//   redeemPromoCode,
//   handleRestore,
//   verifySubscriptionsInLocal,
// };

export const keyName = 'subscription';

type SubsProp = {
  purchaseDate: number;
  expiresDate: number;
  originalPurchaseDate: number;
  productId: string;
  transactionId: number;
  originalTransactionId: number;
  type: string;
};

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
} from 'react-native-iap';
import {OS} from '../utils/keywords';
import {subscriptionServerValidation} from './axios';
import {storage, urls} from '../utils';
import {jwtDecode} from 'jwt-decode';

const android = [
  'mode1-sub-12m',
  'mode1-sub-1m',
  'mode2-sub-12m',
  'mode2-sub-1m',

  'mode1_2yr_onetime',
  'mode1_3yr_onetime',
  'mode2_2yr_onetime',
  'mode2_3yr_onetime',
];

const ios = [
  'mode_1_m1',
  'mode_1_y1',
  'mode_2_m1',
  'mode_2_y1',

  'mode_1_2y',
  'mode_1_3y',
  'mode_2_2y',
  'mode_2_3y',
];

const skus: string[] = Platform.select({
  android: android,
  ios: ios,
})!;

type subscriptionDetailProp = {
  amount: string;
  micros: number;
  saved?: number;
  currencyCode?: string;
}[];

// global variable
let purchaseUpdate: EmitterSubscription | null = null;
let purchaseError: EmitterSubscription | null = null;

export const verifySubscriptionsInLocal = (): boolean => {
  const currentDate = new Date();
  const localData = getSubscriptionDetails();
  console.log('localData : ', localData);
  return new Date(localData?.to) >= currentDate;
};

const getSubscriptionDetails = () => {
  const localData = storage.getString(keyName);
  const parsedData = localData ? JSON.parse(localData) : undefined;
  return parsedData;
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
    if (Platform.OS === OS.android) {
      if (purchase?.purchaseToken) {
        await acknowledgePurchaseAndroid({token: purchase.purchaseToken!});
      }
      finishTransaction({purchase, isConsumable: true})
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
    const isValidatedFromServer = await subscriptionServerValidation(
      urls.appName,
      purchase?.productId,
      purchase?.purchaseToken!,
    );

    console.log('isValidatedFromServer : ', isValidatedFromServer?.data);
    if (!isValidatedFromServer?.data?.success) {
      return false;
    } else {
      return updatePaymentLocally(purchase, isValidatedFromServer);
    }
  } else {
    if (isIosStorekit2()) {
      // IapIosSk2.latestTransaction("")
      const iosValidationResponse = jwtDecode(purchase.verificationResultIOS!);
      console.log('iosValidationResponse : ', iosValidationResponse);
      return updatePaymentLocally(purchase, iosValidationResponse);
    } else {
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
      console.log(
        'Validate Receipt Response from listener : ',
        iosValidationResponse,
      );
      return updatePaymentLocally(purchase, iosValidationResponse);
    }
  }
};

const updatePaymentLocally = (purchase: Purchase, subDetail: SubsProp) => {
  console.log('detail : ', purchase);
  const currentDate = new Date();
  const validatedLocalData = {
    type: 'GoogleInAppSubscriptionPurchase',
    from: new Date(Number(subDetail?.purchaseDate)),
    to: new Date(Number(subDetail?.expiresDate)),
    token: purchase?.purchaseToken,
    packageName: urls?.appName,
    originalPurchaseDate: subDetail?.originalPurchaseDate,
    productId: purchase?.productId || subDetail?.productId,
    modified: currentDate?.toISOString(),
    transactionId: subDetail?.transactionId,
    originalTransactionId: subDetail?.originalTransactionId,
    subscriptionType: subDetail?.type,
  };

  console.log('updating local : ', validatedLocalData);
  if (new Date(validatedLocalData?.to) >= currentDate) {
    // save data locally
    storage.set(keyName, JSON.stringify(validatedLocalData));

    return true;
  } else {
    return false;
  }
};

const getAvailablePurchase = async () => {
  try {
    let purchases: Purchase[] = [];

    if (isIosStorekit2()) {
      // Loop through each SKU and get the latest transaction
      for (const sku of skus) {
        const transaction = await IapIosSk2.currentEntitlement(sku);
        if (transaction && new Date(transaction.expirationDate) >= new Date()) {
          updatePaymentLocally(purchases[0], {
            purchaseDate: transaction.purchaseDate,
            expiresDate: transaction.expirationDate,
            productId: transaction.productID,
            transactionId: transaction.id,
            type: transaction.offerType,
            originalPurchaseDate: transaction.originalPurchaseDate,
            originalTransactionId: transaction.id,
          });
        }
        transaction && purchases.push(transaction)
      }
    } else {
      // StoreKit 1: Restore all purchases
      purchases = await getAvailablePurchases();
    }

    console.log('✅ Restored purchases:', purchases);
    return purchases;
  } catch (error) {
    console.log('❌ Error in getting available purchases:', error);
    return [];
  }
};

const getSubscription = async () => {
  try {
    const subs = await getSubscriptions({skus: skus});
    return subs;
  } catch (error) {
    console.log('Error in getting subscriptions: ', error);
    return null;
  }
};

const iapRequestSubscription = (sku: string) => {
  try {
    return getSubscriptions({skus: [sku]})
      .then((subscription: any) => {
        console.log('ID : ', sku, subscription);
        if (subscription?.length === 0) {
          return false;
        }
        let offerToken =
          Platform.OS === OS.android &&
          subscription[0]['subscriptionOfferDetails'][0]['offerToken'];
        console.log('getSubscription response : ', subscription);
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
        if (Platform.OS === OS.android) {
          let subscribe =
            sub.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0];
          subscriptionsDetail.push(subscribe);
        } else {
          subscriptionsDetail.push(sub);
        }
      });
      if (subscriptionsDetail.length > 0) {
        let save = 0;
        save =
          (subscriptionsDetail[0].micros * 12 - subscriptionsDetail[0].micros) /
          1000000;
        subscriptionsDetail[0].saved = save;
      }
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
    if (availablePurchases.length === 0) {
      return false;
    } else if (isIosStorekit2()) {
      return true;
    } else {
      let hasValidSubscription = await validateSubscription(
        availablePurchases[0] as Purchase,
      );
      return hasValidSubscription;
    }
  }
};

const handleRestore = async () => {
  if (verifySubscriptionsInLocal()) {
    Alert.alert('Subscription active', 'You have already active subscription');
    return null;
  } else {
    let availablePurchases = await getAvailablePurchase();
    if (availablePurchases.length === 0) {
      Alert.alert('No subscription', 'You have no subscription');
      return null;
    } else {
      const hasValidSubscription = await validateSubscription(
        availablePurchases[0],
      );
      if (hasValidSubscription) {
        Alert.alert(
          'Subscription restored',
          'Congrats!🎉 your subscription restored',
        );
      } else {
        Alert.alert(
          'Subscription expired',
          'You subscription has been expired!',
        );
      }
    }
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
};
