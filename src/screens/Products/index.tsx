import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {getSubscription} from '../../services/iap';
import {Subscription} from 'react-native-iap';

const {width} = Dimensions.get('window');

type FormattedSubscription = {
  title: string;
  data: {
    title: string;
    price: any;
    description: string;
  }[];
};

const Product = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscriptions, setSubscriptions] = useState<FormattedSubscription[]>([]);

  useEffect(() => {
    const getAllSubscription = async () => {
      console.log("first")
      const subscriptions = await getSubscription();
      const formattedSubscriptions =
        subscriptions && formatSubscriptionData(subscriptions);
      console.log('first: ', formattedSubscriptions);
      formattedSubscriptions && setSubscriptions(formattedSubscriptions);
    };

    getAllSubscription();
  }, []);

  const formatSubscriptionData = (subscriptions: Subscription[]) => {
    subscriptions?.map(sub=>{
      console.log("SUB : ", sub)
    })
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
        })),
      },
      {
        title: 'Mode 2 Renewable Subscriptions',
        data: mode2Renewable.map(sub => ({
          title: sub.title,
          price: sub.localizedPrice,
          description: sub.description,
        })),
      },
      {
        title: 'Mode 1 Non-Renewable Subscriptions',
        data: mode1NonRenewable.map(sub => ({
          title: sub.title,
          price: sub.localizedPrice,
          description: sub.description,
        })),
      },
      {
        title: 'Mode 2 Non-Renewable Subscriptions',
        data: mode2NonRenewable.map(sub => ({
          title: sub.title,
          price: sub.localizedPrice,
          description: sub.description,
        })),
      },
    ];
  };
  

  const handleSubscribe = async () => {
    const subscriptions = await getSubscription();
    console.log('subscriptions : ', subscriptions);
    if (selectedPlan) {
      Alert.alert(
        'Selected Plan',
        `You selected: ${selectedPlan}, will work once get subscription detail`,
      );
    } else {
      Alert.alert('No Plan Selected', 'Please select a plan to subscribe.');
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.page}>
      <Text style={styles.pageTitle}>{item.title}</Text>
      {item.data.map((sub, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.subscriptionItem,
            selectedPlan === sub.title && styles.selectedSubscriptionItem,
          ]}
          onPress={() => setSelectedPlan(sub.title)}>
          <Text style={styles.subscriptionText}>{sub.title}</Text>
          <Text style={styles.subscriptionText}>{sub.price}</Text>
          <Text style={styles.subscriptionText}>{sub.description}</Text>
          {selectedPlan === sub.title && (
            <Text style={styles.selectedText}>Selected</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
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
      <TouchableOpacity
        style={styles.subscribeButton}
        onPress={handleSubscribe}>
        <Text style={styles.subscribeButtonText}>Subscribe</Text>
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
