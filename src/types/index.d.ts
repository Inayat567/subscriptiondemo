export type Subscriptions = Subscription & {
  type: string;
  productId: string;
  localizedPrice: string;
};

export type FormattedSubscription = {
  title: string;
  price: string;
  description: string;
  productId: string;
  subscriptionPeriod: string;
  introductoryPrice: string;
  currency: string;
  productType: 'subs' | 'inapp';
};

export type FormattedSubscriptions = {
  title: string;
  data: FormattedSubscription[];
};

export type SubsProp = {
  purchaseDate: number;
  expiresDate: number;
  originalPurchaseDate: number;
  productId: string;
  transactionId: number;
  originalTransactionId: number;
  type: string;
  cancelReason: 0 | null;
};

export interface ValidatedLocalData {
  from: Date | null;
  to: Date | null;
  token?: string;
  packageName?: string;
  originalPurchaseDate?: number;
  productId?: string;
  modified?: string;
  transactionId?: string;
  originalTransactionId?: string;
  subscriptionType?: string;
  cancelReason?: 0 | null;
}

export type subscriptionDetailProp = {
  amount: string;
  micros: number;
  saved?: number;
  currencyCode?: string;
}[];
