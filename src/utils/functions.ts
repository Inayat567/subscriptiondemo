import {Product, SubscriptionAndroid} from 'react-native-iap';
import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV();

export const formatIosProducts = (products: Product[] | null) => {
  if (!products) return null;
  return {
    title: 'One-Time Purchases',
    data: products.map(product => ({
      title: product.title,
      price: product.localizedPrice,
      description: product.productId,
      productId: product.productId,
      productType: product?.type,
    })),
  };
};

export const formatAndroidProducts = (products: Product[] | null) => {
  if (!products) return null;
  return {
    title: 'One-Time Purchases',
    data: products.map(product => ({
      title: product.name,
      price: product.localizedPrice,
      description: product.description,
      productId: product.productId,
      productType: product?.productType,
    })),
  };
};

export const formatIOSSubscriptions = subscriptions => {
  return {
    title: 'Subscriptions',
    data: subscriptions.map(sub => ({
      title: sub.title,
      price: sub.localizedPrice,
      description: sub.description,
      productId: sub.productId,
      productType: sub.type, // "subs" or "inapp"
      subscriptionPeriod: `${sub.subscriptionPeriodNumberIOS} ${sub.subscriptionPeriodUnitIOS}`, // E.g., "1 MONTH" or "1 YEAR"
      introductoryPrice: sub.introductoryPriceAsAmountIOS || 'N/A',
      currency: sub.currency || 'USD', // Default to USD if empty
    })),
  };
};

export const formatAndroidSubscriptions = (
  subscriptions: SubscriptionAndroid[],
) => {
  return {
    title: 'Subscriptions',
    data: subscriptions.flatMap((sub: SubscriptionAndroid) => {
      return (
        sub.subscriptionOfferDetails?.map(offer => {
          const price =
            offer?.pricingPhases?.pricingPhaseList?.[0]?.formattedPrice ||
            'N/A';
          return {
            title: sub.name,
            price,
            description: sub.description,
            productId: sub.productId,
            productType: sub.productType,
            basePlanId: offer.basePlanId,
            offerId: offer.offerId,
            offerToken: offer.offerToken,
          };
        }) || []
      );
    }),
  };
};
