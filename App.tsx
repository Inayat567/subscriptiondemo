/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {View, StyleSheet, Platform, StatusBar} from 'react-native';
import Root from './src/navigation/Root';
import {NavigationContainer} from '@react-navigation/native';
import {
  closeIapConnection,
  initIapConnection,
  verifySubscriptionFromBackend,
  verifyUserSubscriptionValidation,
} from './src/services/iap';
import {setup} from 'react-native-iap';
import {OS} from './src/utils';

const App = (): React.JSX.Element => {
  useEffect(() => {
    init();

    return () => {
      closeIapConnection()
        .then(res => {
          console.log('IAP closed');
        })
        .catch(error => {
          console.log('Error closing IAP', error);
        });
    };
  }, []);

  const init = () => {
    if (Platform.OS === OS.ios) {
      setup({storekitMode: 'STOREKIT2_MODE'});
    }

    initIapConnection()
      .then(async res => {
        console.log('IAP initialzed: ', res);

        await verifySubscriptionFromBackend();

        //  you can use this method to check whether user is premium or not
        const isPremium = await verifyUserSubscriptionValidation();
        console.log('user premium status : ', isPremium);
      })
      .catch(error => {
        console.log('Error initializing IAP', error);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
