import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  fetchSubscriptions,
  getAllProducts,
  handleRestore,
  iapRequestPurchase,
  iapRequestSubscription,
  redeemPromoCode,
} from '../../services/iap';
import {
  colors,
  formatAndroidProducts,
  formatAndroidSubscriptions,
  height,
  width,
} from '../../utils';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FormattedSubscription, FormattedSubscriptions} from '../../types';

const Product = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [selectedPlan, setSelectedPlan] =
    useState<FormattedSubscription | null>(null);
  const [isLoading, setIsloading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const [subscriptions, setSubscriptions] = useState<FormattedSubscriptions[]>(
    [],
  );

  useEffect(() => {
    const getAllSubscription = async () => {
      try {
        const products = await getAllProducts();
        console.log('all products: ', products);
        const formattedProducts = formatAndroidProducts(products);
        const subscriptions = await fetchSubscriptions();
        const formattedSubscriptions =
          formatAndroidSubscriptions(subscriptions);
        console.log('formattted : ', formattedProducts, formattedSubscriptions);
        setSubscriptions(
          formattedProducts
            ? [formattedSubscriptions, formattedProducts]
            : [formattedSubscriptions],
        );
        setIsloading(false);
      } catch (error) {
        setIsloading(false);
        console.log('Error getting subscriptiions : ', error);
      }
    };

    getAllSubscription();
  }, []);

  const handleSubscribe = async () => {
    if (selectedPlan) {
      setIsFetching(true);
      console.log('selectedPlan.productId :', selectedPlan);
      if (selectedPlan?.productType === 'subs') {
        const hasSubscription = await iapRequestSubscription(
          selectedPlan.productId,
        );
        if (hasSubscription) {
          Alert.alert(
            'Congratulation 🥳',
            'Your subscription is purchased successfully',
          );
        }
        console.log('response : ', hasSubscription);
      } else {
        const hasSubscription = await iapRequestPurchase(
          selectedPlan.productId,
        );
        console.log('response : ', hasSubscription);
        if (hasSubscription) {
          Alert.alert(
            'Congratulation 🥳',
            'Your purchase is completed successfully',
          );
        }
      }
      setIsFetching(false);
    } else {
      const hasSubscription = await iapRequestSubscription('mode2_sub');
      console.log('has subscription : ', hasSubscription);
      Alert.alert('No Plan Selected', 'Please select a plan to subscribe.');
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: FormattedSubscriptions;
    index: number;
  }) => (
    <View style={styles.page} key={index}>
      <Text style={styles.pageTitle}>{item.title}</Text>
      {item.data.map((sub: FormattedSubscription, index: number) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.subscriptionItem,
            selectedPlan?.title === sub.title &&
              styles.selectedSubscriptionItem,
          ]}
          onPress={() => setSelectedPlan(sub)}>
          <Text style={styles.subscriptionText}>{sub.title}</Text>
          <Text style={styles.subscriptionText}>{sub.price}</Text>
          <Text style={styles.subscriptionText}>{sub.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginBottom: 10,
        }}>
        <TouchableOpacity onPress={() => redeemPromoCode()}>
          <Text>Redeem</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRestore()}>
          <Text>Restore</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <View style={{flex: 1, height: height * 0.7, justifyContent: 'center'}}>
          <ActivityIndicator size={'large'} color={'black'} />
        </View>
      ) : (
        <FlatList
          data={subscriptions}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={width * 0.85 + 20}
          snapToAlignment="start"
          decelerationRate="fast"
          contentContainerStyle={styles.flatListContent}
        />
      )}
      <TouchableOpacity
        style={styles.subscribeButton}
        onPress={handleSubscribe}>
        {isFetching ? (
          <ActivityIndicator size={'small'} color={colors.primary} />
        ) : (
          <Text style={styles.subscribeButtonText}>Subscribe</Text>
        )}
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 10,
        }}>
        <TouchableOpacity>
          <Text>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Terms and Conditions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  flatListContent: {
    paddingHorizontal: 10, // Add padding to the sides
  },
  page: {
    width: width * 0.85, // Adjusted width
    marginHorizontal: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subscriptionItem: {
    width: '100%',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  selectedSubscriptionItem: {
    borderColor: '#007bff',
    backgroundColor: '#e3f2fd',
  },
  subscriptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedText: {
    fontSize: 14,
    color: '#007bff',
    marginTop: 5,
    fontWeight: '600',
  },
  subscribeButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#007bff',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  subscribeButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Product;
