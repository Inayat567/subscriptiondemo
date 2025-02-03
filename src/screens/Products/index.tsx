import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {OS} from '../../utils';

const {width} = Dimensions.get('window');

const Product = () => {
  const androidSub = [
    'monthly (mode 1)',
    'yearly (mode 1)',
    'monthly (mode 2)',
    'yearly (mode 2)',
  ];
  const androidInApp = [
    '2 year (mode 1)',
    '3 year (mode 1)',
    '2 year (mode 2)',
    '3 year (mode 2)',
  ];
  const iosSub = [
    'monthly (mode 1)',
    'yearly (mode 1)',
    'monthly (mode 2)',
    'yearly (mode 2)',
  ];
  const iosInApp = [
    '2 year (mode 1)',
    '3 year (mode 1)',
    '2 year (mode 2)',
    '3 year (mode 2)',
  ];

  const subscriptionData = [
    {
      title: 'Mode 1 Renewable Subscriptions',
      data:
        Platform.OS === OS.ios
          ? [
              {
                title: iosSub[0],
                price: '$1.99',
                description: 'Billed every month',
              },
              {
                title: iosSub[1],
                price: '$9.99',
                description: 'Billed every year',
              },
            ]
          : [
              {
                title: androidSub[0],
                price: '$1.99',
                description: 'Billed every month',
              },
              {
                title: androidSub[1],
                price: '$9.99',
                description: 'Billed every year',
              },
            ],
    },
    {
      title: 'Mode 2 Renewable Subscriptions',
      data:
        Platform.OS === OS.ios
          ? [
              {
                title: iosSub[2],
                price: '$2.99',
                description: 'Billed every month',
              },
              {
                title: iosSub[3],
                price: '$29.99',
                description: 'Billed every year',
              },
            ]
          : [
              {
                title: androidSub[2],
                price: '$2.99',
                description: 'Billed every month',
              },
              {
                title: androidSub[3],
                price: '$29.99',
                description: 'Billed every year',
              },
            ],
    },
    {
      title: 'Mode 1 Non-Renewable Subscriptions',
      data:
        Platform.OS === OS.ios
          ? [
              {
                title: iosInApp[0],
                price: '$49.99',
                description: 'One-time purchase for 2 years',
              },
              {
                title: iosInApp[1],
                price: '$69.99',
                description: 'One-time purchase for 3 years',
              },
            ]
          : [
              {
                title: androidInApp[0],
                price: '$49.99',
                description: 'One-time purchase for 2 years',
              },
              {
                title: androidInApp[1],
                price: '$69.99',
                description: 'One-time purchase for 3 years',
              },
            ],
    },
    {
      title: 'Mode 2 Non-Renewable Subscriptions',
      data:
        Platform.OS === OS.ios
          ? [
              {
                title: iosInApp[2],
                price: '$49.99',
                description: 'One-time purchase for 2 years',
              },
              {
                title: iosInApp[3],
                price: '$59.99',
                description: 'One-time purchase for 3 years',
              },
            ]
          : [
              {
                title: androidInApp[2],
                price: '$49.99',
                description: 'One-time purchase for 2 years',
              },
              {
                title: androidInApp[3],
                price: '$59.99',
                description: 'One-time purchase for 3 years',
              },
            ],
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSubscribe = () => {
    if (selectedPlan) {
      Alert.alert('Selected Plan', `You selected: ${selectedPlan}, will work once get subscription detail`);
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
        data={subscriptionData}
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
      <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}}>
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
