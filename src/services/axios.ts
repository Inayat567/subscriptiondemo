import axios from 'axios';

export const subscriptionServerValidation = async (
  packageName: string,
  productID: string,
  token: string,
) => {
  try {
    const url = `http://localhost:8000/validate_subscription/${packageName}/${productID}/${token}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('Error in subscriptionServerValidation', error);
    return null;
  }
};
