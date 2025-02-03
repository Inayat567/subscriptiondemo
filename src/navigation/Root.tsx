import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Product, ProductDetail} from '../screens';
import {rootScreens} from '../utils';

const Stack = createNativeStackNavigator();

const Root = () => {
  return (
    <Stack.Navigator initialRouteName={rootScreens.product}>
      <Stack.Screen name={rootScreens.product} component={Product} />
      <Stack.Screen
        name={rootScreens.productDetail}
        component={ProductDetail}
      />
    </Stack.Navigator>
  );
};

export default Root;
