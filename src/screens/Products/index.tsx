import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  getSubscription,
  handleRestore,
  iapRequestSubscription,
  redeemPromoCode,
} from '../../services/iap';
import {Subscription} from 'react-native-iap';
import {colors, width} from '../../utils';

type FormattedSubscription = {
  title: string;
  price: any;
  description: string;
  productId: string;
};

type FormattedSubscriptions = {
  title: string;
  data: FormattedSubscription[];
};

type Subscriptions = Subscription & {
  type: string;
  productId: string;
  localizedPrice: string;
};

const Product = () => {
  const [selectedPlan, setSelectedPlan] =
    useState<FormattedSubscription | null>(null);
  const [isLoading, setIsloading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const [subscriptions, setSubscriptions] = useState<FormattedSubscriptions[]>(
    [],
  );

  useEffect(() => {
    const getAllSubscription = async () => {
      console.log('first');
      const subscriptions = await getSubscription();
      const formattedSubscriptions =
        subscriptions && formatSubscriptionData(subscriptions);
      console.log('first: ', formattedSubscriptions);
      formattedSubscriptions && setSubscriptions(formattedSubscriptions);
      setIsloading(false);
    };

    getAllSubscription();
  }, []);

  const formatSubscriptionData = (subscriptions: Subscriptions[]) => {
    subscriptions?.map(sub => {
      console.log('SUB : ', sub);
    });
    const mode1Renewable = subscriptions.filter(
      sub => sub.productId.includes('mode_1') && sub.type === 'subs',
    );
    const mode2Renewable = subscriptions.filter(
      sub => sub.productId.includes('mode_2') && sub.type === 'subs',
    );
    const mode1NonRenewable = subscriptions.filter(
      sub => sub.productId.includes('mode_1') && sub.type !== 'subs',
    );
    const mode2NonRenewable = subscriptions.filter(
      sub => sub.productId.includes('mode_2') && sub.type !== 'subs',
    );

    return [
      {
        title: 'Mode 1 Renewable Subscriptions',
        data: mode1Renewable.map(sub => ({
          title: sub.title,
          price: sub.localizedPrice,
          description: sub.description,
          productId: sub.productId,
        })),
      },
      {
        title: 'Mode 2 Renewable Subscriptions',
        data: mode2Renewable.map(sub => ({
          title: sub.title,
          price: sub.localizedPrice,
          description: sub.description,
          productId: sub.productId,
        })),
      },
      {
        title: 'Mode 1 Non-Renewable Subscriptions',
        data: mode1NonRenewable.map(sub => ({
          title: sub.title,
          price: sub.localizedPrice,
          description: sub.description,
          productId: sub.productId,
        })),
      },
      {
        title: 'Mode 2 Non-Renewable Subscriptions',
        data: mode2NonRenewable.map(sub => ({
          title: sub.title,
          price: sub.localizedPrice,
          description: sub.description,
          productId: sub.productId,
        })),
      },
    ];
  };

  const handleSubscribe = async () => {
    if (selectedPlan) {
      setIsFetching(true);
      const hasSubscription = await iapRequestSubscription(
        selectedPlan.productId,
      );
      setIsFetching(false);
      console.log('response : ', hasSubscription);
    } else {
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
        <ActivityIndicator size={'large'} color={colors.primary} />
      ) : (
        <FlatList
          data={subscriptions}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={width * 0.85 + 20} // Adjusted for margin
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
