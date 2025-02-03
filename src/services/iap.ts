import {EmitterSubscription, Linking, Platform} from 'react-native';
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
  validateReceiptIos,
  Purchase,
  acknowledgePurchaseAndroid,
  presentCodeRedemptionSheetIOS,
} from 'react-native-iap';
import {OS, urls} from '../utils';
// import {
//   subscriptionServerValidation,
//   updateUserToPremium,
// } from '../services/apis';

const androidSub = [
  'mode1-sub-12m',
  'mode1-sub-1m',
  'mode2-sub-12m',
  'mode2-sub-1m',
];
const androidInApp = [
  'mode1_2yr_onetime',
  'mode1_3yr_onetime',
  'mode2_2yr_onetime',
  'mode2_3yr_onetime',
];
const iosSub = ['mode_1_m1', 'mode_1_y1','mode_2_m1', 'mode_2_y1'];
const iosInApp = ['mode_1_2y', 'mode_1_3y', 'mode_2_2y', 'mode_2_3y'];

const subscriptionIDs = Platform.OS === OS.android ? androidSub : iosSub;
const inAppIDs = Platform.OS === OS.android ? androidInApp : iosInApp;

type subscriptionDetailProp = {
  amount: string;
  micros: number;
  saved?: number;
  currencyCode?: string;
}[];

// global variable
let purchaseUpdate: EmitterSubscription | null = null;
let purchaseError: EmitterSubscription | null = null;

const updateListener = () => {
  console.log('update listener called');
  purchaseUpdate = purchaseUpdatedListener(async purchase => {
    console.log('Listen to purchase update listener : ', purchase);
    const receipt = purchase.transactionReceipt;
    if (receipt) {
      handleSubscriptionPurchase(purchase);
    }
  });
  purchaseError = purchaseErrorListener(error => {
    console.log('Listened Received purchase error : ', error);
  });
  return true;
};

const initIapConnection = async () => {
  return await initConnection().then(() => {
    return Platform.OS === OS.ios
      ? clearTransactionIOS()
          .then(res => {
            console.log('Cleared pending payments from billing skd: ', res);
            return updateListener();
          })
          .catch(e => {
            console.log('Error while clearing pending payments: ', e);
            return false;
          })
      : flushFailedPurchasesCachedAsPendingAndroid()
          .then(() => {
            console.log('Cleared pending payments from billing skd');
            return updateListener();
            // return true;
          })
          .catch(e => {
            console.log('Error while clearing pending payments: ', e);
            return false;
          });
  });
};

const closeIapConnection = async () => {
  return await endConnection()
    .then(res => {
      console.log('Connection terminted...', res);
      return true;
    })
    .catch(e => {
      console.log('Connection  could not be terminated: ', e);
      return false;
    });
};

const removeSubscriptionListener = () => {
  purchaseUpdate?.remove();
  purchaseUpdate = null;
  purchaseError?.remove();
  purchaseError = null;
  console.log('removed all listener');
};

const handleSubscriptionPurchase = async (purchase: Purchase) => {
  // if (Platform.OS === OS.android && purchase?.purchaseToken) {
  //   //call Backend API

  //   const userId = "5";
  //   const serverResponse = await subscriptionServerValidation(
  //     purchase.packageNameAndroid || '',
  //     purchase.productId,
  //     purchase.purchaseToken || '',
  //   );
  //   if (serverResponse.success) {
  //     await updateUserToPremium(userId!, true);
  //     acknowledgePurchaseAndroid({token: purchase.purchaseToken!})
  //       .then(res => {
  //         console.log('acknowledged purchase android', res);
  //       })
  //       .catch(error => {
  //         console.log('error acknowledging purchase android', error);
  //       });

  //     const realmData = realm.objects(keyName);
  //     const currentDate = new Date();
  //     const validatedRealmData = {
  //       planId: 'monthly', // weakly, monthly, yearly
  //       // userId: userId,
  //       startDate: new Date(
  //         Number(serverResponse.data?.startTimeMillis),
  //       ).toString(),
  //       endDate: new Date(
  //         Number(serverResponse.data?.expiryTimeMillis),
  //       ).toString(),
  //       token: purchase.purchaseToken,
  //       status: true,
  //       price: serverResponse.data?.priceAmountMicros / 1000000,
  //       currency: serverResponse.data?.priceCurrencyCode,
  //       productId: purchase.productId,
  //       modified: currentDate.toString(),
  //       packageName: purchase.packageNameAndroid || '',
  //     };

  //     if (realmData.length !== 0) {
  //       updateSubscription(validatedRealmData);
  //     } else {
  //       saveSubscription(validatedRealmData);
  //     }
  //   } else {
  //     await updateUserToPremium(userId!, false);
  //   }

  //   console.log('server Validation rsponse : ', serverResponse);

  //   // await setExpiryDate(ExpiryDate);  //update async storage÷
  //   //for unConsumable
  //   finishTransaction({purchase, isConsumable: false})
  //     .then(() => console.log('clear unConsumable transaction'))
  //     .catch(e =>
  //       console.log('Error while clearing unConsumable transaction: ', e),
  //     );
  //   console.log('Clear transaction');
  // } else {
  //   const receiptBody = {
  //     'receipt-data': purchase.transactionReceipt,
  //     password: 'c94989ae880549f092c0070b702be928', // app shared secret, can be found in App Store Connect
  //   };
  //   let res = await validateReceiptIos({receiptBody, isTest: true});
  //   console.log(
  //     'Validate Receipt Response from listener : ',
  //     res?.latest_receipt_info,
  //   );
  // }
  closeIapConnection().then(() => initConnection());
};

const getAvailablePurchase = () => {
  return getAvailablePurchases()
    .then(products => {
      return products;
    })
    .catch(e => {
      console.log('Error in getting available purchases: ', e);
      return [];
    });
};

const getSubscription = () => {
  return getSubscriptions({skus: subscriptionIDs})
    .then(subs => {
      console.log('get subscriptions Response : ', subs);
      return subs;
    })
    .catch(e => {
      console.log('Error in getting subscriptions: ', e);
      return null;
    });
};

// const getProduct = (sku: number) => {
//   return getProducts({skus: [subscriptionIDs[sku]]})
//     .then(prod => {
//       console.log('Response : ', prod);
//       return prod;
//     })
//     .catch(e => {
//       console.log('Error in getting products: ', e);
//       return null;
//     });
// };

// const iapRequestPurchase = (sku: number) => {
//   return requestPurchase({
//     sku: subscriptionIDs[sku],
//     andDangerouslyFinishTransactionAutomaticallyIOS: false,
//   })
//     .then(res => {
//       console.log('Request Purchase response: ', res);
//       return true;
//     })
//     .catch(e => {
//       console.log('Failed to request purchase : ', e);
//       return false;
//     });
// };

const iapRequestSubscription = (sku: number) => {
  try {
    return getSubscriptions({skus: [subscriptionIDs[sku]!]})
      .then((subscription: any) => {
        console.log('subscriptions : ', subscription);
        let offerToken =
          Platform.OS === OS.android &&
          subscription?.length > 0 &&
          subscription[0]['subscriptionOfferDetails'][0]['offerToken'];
        console.log('getSubscription response : ', subscription);
        let payload =
          Platform.OS === OS.android
            ? {
                sku: subscriptionIDs[sku],
                ...(offerToken && {
                  subscriptionOffers: [{sku: subscriptionIDs[sku], offerToken}],
                }),
              }
            : {
                sku: subscriptionIDs[sku],
              };
        return requestSubscription(payload)
          .then(async res => {
            console.log('Request Subscription response : ', res);
            return true;
          })
          .catch(e => {
            console.log('Failed to request subscription : ', e);
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

const getHistory = () => {
  return getPurchaseHistory()
    .then(res => {
      console.log('Purchase history response : ', res);
      return res;
    })
    .catch(e => {
      console.log('Error in getting purchase history', e);
      return [];
    });
};

const fetchSubscriptions = async () => {
  const subscriptionsDetail: subscriptionDetailProp = [];
  return getSubscription()
    .then(res => {
      res?.map((sub: any) => {
        if (Platform.OS === OS.android) {
          let subscribe =
            sub.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0];
          subscriptionsDetail.push({
            amount: subscribe?.formattedPrice,
            micros: subscribe?.priceAmountMicros,
            currencyCode: subscribe?.priceCurrencyCode,
          });
        } else {
          subscriptionsDetail.push({
            amount: sub.price,
            micros: sub.price * 10000,
            currencyCode: sub.currency,
          });
        }
      });
      console.log(subscriptionsDetail);
      if (subscriptionsDetail.length > 0) {
        let save = 0;
        save =
          (subscriptionsDetail[0]!.micros * 12 -
            subscriptionsDetail[0]!.micros) /
          1000000;
        subscriptionsDetail[0]!.saved = save;
      }
      return subscriptionsDetail;
    })
    .catch(e => {
      console.log('Error in getting user subscription details', e);
      return [];
    });
};

const cancelSubscription = (id?: number) => {
  let productID = id === 0 ? subscriptionIDs[0] : subscriptionIDs[1];
  if (Platform.OS === OS.ios) {
    Linking.openURL(urls.iosUnscriptionUrl);
  } else {
    Linking.openURL(urls.androidUnscriptionUrl + productID);
  }
};

const redeemPromoCode = async (promoCode?: string) => {
  Platform.OS === OS.android
    ? Linking.openURL(urls.androidRedeemUrl + promoCode)
    : await presentCodeRedemptionSheetIOS();
};

const handleRestore = async () => {
  const hasAlreadySubscription = verifySubscriptionsInRealm();
  let availablePurchases = [];
  if (hasAlreadySubscription) {
    return;
  } else {
    const subscription = await getAvailablePurchase();
    availablePurchases = subscription.filter(
      subscription => subscription.productId === subscriptionIDs[0],
    );
  }
  if (availablePurchases.length === 0) {
    // NO SUBSCRIPTION
    console.log('no subscription');
    return null;
  } else {
    handleSubscriptionPurchase(availablePurchases[0]!);
    console.log('available purchase : ', availablePurchases);
    return;
  }
};

const verifySubscriptionsInRealm = () => {
  // try {
  //   const isSubscribed = realm.objects(keyName);
  //   console.log('realms data : ', isSubscribed);
  //   if (isSubscribed.length !== 0) {
  //     const subscriptionValidTimeStr: string = isSubscribed[0]!
  //       .endDate as string;

  //     const subscriptionValidTime = new Date(subscriptionValidTimeStr);
  //     const currentTime = new Date();

  //     if (subscriptionValidTime >= currentTime) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return false;
  //   }
  // } catch (error) {
  //   console.log('Error in verifying subscription : ', error);
  //   return false;
  // }
  return false;
};

export {
  initIapConnection,
  closeIapConnection,
  getHistory,
  getSubscription,
  iapRequestSubscription,
  updateListener,
  removeSubscriptionListener,
  fetchSubscriptions,
  cancelSubscription,
  redeemPromoCode,
  handleRestore,
  verifySubscriptionsInRealm,
};
