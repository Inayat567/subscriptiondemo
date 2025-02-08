import {Product, SubscriptionAndroid} from 'react-native-iap';
import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV();

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

export const formatAndroidSubscriptions = (
  subscriptions: SubscriptionAndroid[],
) => {
  return {
    title: 'Subscriptions',
    data: subscriptions.map((sub: SubscriptionAndroid) => {
      const price =
        sub.subscriptionOfferDetails?.[0]?.pricingPhases?.pricingPhaseList?.[0]
          ?.formattedPrice || 'N/A';
      return {
        title: sub.name,
        price,
        description: sub.description,
        productId: sub.productId,
        productType: sub.productType,
      };
    }),
  };
};
