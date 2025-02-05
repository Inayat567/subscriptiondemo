import { getSubscriptions } from "react-native-iap";

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

  // call this function (getSubscription) to check whether you are getting detials or not

export const getSubscription = () => {
  return getSubscriptions({skus: [...androidSub, ...androidInApp]})
    .then(subs => {
      console.log('get subscriptions Response : ', subs);
      return subs;
    })
    .catch(e => {
      console.log('Error in getting subscriptions: ', e);
      return null;
    });
};