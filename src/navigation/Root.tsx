import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Product, ProductDetail} from '../screens';
import {rootScreens} from '../utils';
import VideoCaptureScreen from '../screens/CameraVideo';
import KeyboardIssue from '../screens/Keyboard';
import ModalEditTest from '../screens/Test/ModalEditTest';

const Stack = createNativeStackNavigator();

const Root = () => {
  return (
    <Stack.Navigator initialRouteName={rootScreens.productDetail}>
      <Stack.Screen
        name={rootScreens.cameraVideo}
        component={VideoCaptureScreen}
      />

      <Stack.Screen
        name={rootScreens.productDetail}
        component={ProductDetail}
      />
      <Stack.Screen name={rootScreens.product} component={Product} />

      <Stack.Screen name={rootScreens.keyboard} component={KeyboardIssue} />
      <Stack.Screen name={rootScreens.test} component={ModalEditTest}/>
    </Stack.Navigator>
  );
};

export default Root;
