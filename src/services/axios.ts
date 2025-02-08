import {BASE_URL} from './config';

export const subscriptionServerValidation = async (
  packageName: string,
  productID: string,
  token: string,
) => {
  try {
    const response = await BASE_URL.get(
      `validate_subscription/${packageName}/${productID}/${token}`,
    );
    return response;
  } catch (error) {
    console.log('Error in subscriptionServerValidation', error);
    return null;
  }
};

export const purchaseServerValidation = async (
  packageName: string,
  productID: string,
  token: string,
) => {
  try {
    const response = await BASE_URL.get(
      `validate_purchase/${packageName}/${productID}/${token}`,
    );
    return response;
  } catch (error) {
    console.log('Error in subscriptionServerValidation', error);
    return null;
  }
};
