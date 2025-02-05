import {View, Text, TouchableOpacity} from 'react-native';
import React, {useCallback, useState} from 'react';
import {PDStyles} from './ProductDetail.styles';
import {
  ParamListBase,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {rootScreens} from '../../utils';
import {
  cancelSubscription,
  handleRestore,
  verifySubscriptionsInLocal,
} from '../../services/iap';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const ProductDetail = () => {
  const [isPremiumUser, setIsPremiumUser] = useState(
    verifySubscriptionsInLocal(),
  );
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useFocusEffect(
    useCallback(() => {
      const isPremium = verifySubscriptionsInLocal();
      console.log('isPremium : ', isPremium);
      setIsPremiumUser(isPremium);
    }, []),
  );

  const handlePremium = () => {
    if (!isPremiumUser) {
      navigation.navigate(rootScreens.product);
    }
  };

  return (
    <View style={PDStyles.container}>
      <Text style={PDStyles.title}>Premium Features</Text>

      {isPremiumUser ? (
        <Text style={PDStyles.text}>
          This is the premium feature.{'\n'}I will show this text if user has
          subscription and {'\n'}if user does not have any subscription,{'\n'}I
          will hide it later once, get detail on android.{'\n'}
          For now by default I am showing it
        </Text>
      ) : (
        <TouchableOpacity style={PDStyles.button} onPress={handlePremium}>
          <Text style={PDStyles.buttonText}>show me premium features</Text>
        </TouchableOpacity>
      )}

      <View style={PDStyles.bottomContainer}>
        <TouchableOpacity onPress={() => cancelSubscription()}>
          <Text style={PDStyles.boldText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRestore()}>
          <Text style={PDStyles.boldText}>Restore</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetail;
