import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {PDStyles} from './ProductDetail.styles';
import {
  ParamListBase,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {rootScreens} from '../../utils';
import {
  cancelSubscription,
  getNonRenowingSubscriptionDetails,
  getSubscriptionDetails,
  handleRestore,
  handleRestoreProduct,
  verifyOneTimePurchaseInLocal,
  verifySubscriptionsInLocal,
} from '../../services/iap';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ValidatedLocalData} from '../../types';
import { appleHealthService } from '../../services/appleHealthKit';
import appleHealthKit from 'react-native-health';

const ProductDetail = () => {
  const [isPremiumUser, setIsPremiumUser] = useState(
    verifySubscriptionsInLocal(),
  );
  const [isPurchased, setIsPurchased] = useState(false);
  const [oneTimeProduct, setOneTimeProduct] =
    useState<ValidatedLocalData | null>(null);
  const [subs, setSubs] = useState<ValidatedLocalData | null>(null);
  const [isResotringSubscription, setIsRestoringSubscription] = useState(false);
  const [isRestoringProduct, setIsRestoringProduct] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useEffect(() => {

    const TestAppleHealthKit = async () => {

    // Check HealthKit availability
    const isAvailable = await appleHealthService.isHealthKitAvailable();
    console.log('HealthKit available:', isAvailable);

    // Initialize HealthKit
    await appleHealthService.initializeHealthKit();

    // Fetch daily step count samples
    const dailySteps = await appleHealthService.getDailyStepCountSamples(
      new Date('2025-01-01'),
      new Date('2025-05-04'),
    );
    console.log('Daily steps:', dailySteps);

    // Fetch active energy burned
    const caloriesBurned = await appleHealthService.getActiveEnergyBurned(
      new Date('2025-01-01'),
      new Date('2025-05-04'),
    );
    console.log('Calories burned:', caloriesBurned);

    // Fetch height
    const height = await appleHealthService.getHeight();
    console.log('Height:', height);

    // Save weight
    const weightSaved = await appleHealthService.saveWeight(70, new Date());
    console.log('Weight saved:', weightSaved);

    // Save a workout
    const workoutSaved = await appleHealthService.saveWorkout(
      appleHealthKit.Constants.Activities.Running,
      new Date('2025-05-04T10:00:00'),
      new Date('2025-05-04T11:00:00'),
      500, // 500 calories
      5000, // 5000 meters
    );
    console.log('Workout saved:', workoutSaved);
  }


    TestAppleHealthKit()
  }, []);

  useFocusEffect(
    useCallback(() => {
      const isPremium = verifySubscriptionsInLocal();
      const subscriptiionDetail = getSubscriptionDetails();
      setSubs(subscriptiionDetail);
      const oneTimeProductDetail = getNonRenowingSubscriptionDetails();
      setOneTimeProduct(oneTimeProductDetail);
      console.log(
        'isPremium : ',
        isPremium,
        subscriptiionDetail,
        oneTimeProductDetail,
      );
      setIsPremiumUser(isPremium);
      setIsPurchased(verifyOneTimePurchaseInLocal());
    }, [isResotringSubscription, isRestoringProduct]),
  );

  const handlePremium = () => {
    // if (!isPremiumUser) {
    navigation.navigate(rootScreens.product);
    // }
  };

  const handleRestoreSubscription = () => {
    setIsRestoringSubscription(true);
    handleRestore()
      .then(res => {
        setIsRestoringSubscription(false);
      })
      .catch(error => {
        setIsRestoringSubscription(false);
        console.log('error : ', error);
      });
  };

  const handleRestoreProducts = () => {
    setIsRestoringProduct(true);
    handleRestoreProduct()
      .then(res => {
        setIsRestoringProduct(false);
      })
      .catch(error => {
        setIsRestoringProduct(false);
        console.log('error : ', error);
      });
  };

  const handleCancelSubscription = () => cancelSubscription();

  return (
    <View style={PDStyles.container}>
      <Text style={PDStyles.title}>Premium Features</Text>

      {(isPremiumUser || isPurchased) && (
        <>
          <Text style={PDStyles.text}>
            This is the premium feature.{'\n'}I will show this text if user has
            subscription and {'\n'}if user does not have any subscription,{'\n'}
            I will hide it later once, get detail on android.{'\n'}
            For now by default I am showing it
            {isPremiumUser &&
              subs?.productId &&
              '\n\nCurrent purchased subscription : ' + subs.productId}
            {isPremiumUser &&
              subs?.from &&
              '\n\nPurchased time : ' + new Date(subs.from).toLocaleString()}
            {isPremiumUser &&
              subs?.to &&
              '\n\nExpiry time : ' + new Date(subs.to).toLocaleString()}
            {isPremiumUser &&
              subs?.subscriptionType &&
              '\n\nType : ' + subs.subscriptionType}
            {isPremiumUser &&
              subs?.cancelReason === 0 &&
              '\n\n You have cancelled subscription, it will not auto renew'}
            {isPurchased &&
              oneTimeProduct?.productId &&
              '\n\nCurrent purchased subscription : ' +
                oneTimeProduct.productId}
            {isPurchased &&
              oneTimeProduct?.from &&
              '\n\nPurchased time : ' +
                new Date(oneTimeProduct.from).toLocaleString()}
            {isPurchased &&
              oneTimeProduct?.to &&
              '\n\nExpiry time : ' + oneTimeProduct?.to}
            {isPurchased &&
              oneTimeProduct?.subscriptionType &&
              '\n\nType : ' + oneTimeProduct.subscriptionType}
          </Text>
        </>
      )}
      <TouchableOpacity style={PDStyles.button} onPress={handlePremium}>
        <Text style={PDStyles.buttonText}>show me premium features</Text>
      </TouchableOpacity>

      <View style={PDStyles.bottomContainer}>
        <TouchableOpacity onPress={handleCancelSubscription}>
          <Text style={PDStyles.boldText}>Cancel Subs</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRestoreSubscription}>
          {isResotringSubscription ? (
            <ActivityIndicator size={'small'} color={'black'} />
          ) : (
            <Text style={PDStyles.boldText}>Restore Subs</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRestoreProducts}>
          {isRestoringProduct ? (
            <ActivityIndicator size={'small'} color={'black'} />
          ) : (
            <Text style={PDStyles.boldText}>Restore prod</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetail;
