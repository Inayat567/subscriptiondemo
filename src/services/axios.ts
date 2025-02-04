import axios from 'axios';

export const subscriptionServerValidation = async (
  packageName: string,
  productID: string,
  token: string,
) => {
  try {
    const params = {
      packageName,
      productID,
      token,
    };
    const response = await axios.get('', {params});
    return response.data;
  } catch (error) {
    console.log('Error in subscriptionServerValidation', error);
    return null;
  }
};
