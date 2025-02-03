import {StyleSheet} from 'react-native';

export const ProductStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
      },
      planCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#ddd',
      },
      selectedPlanCard: {
        borderColor: '#007bff',
      },
      planTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      planPrice: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 5,
      },
      planDescription: {
        fontSize: 14,
        color: '#666',
      },
      selectedText: {
        fontSize: 14,
        color: '#007bff',
        marginTop: 10,
        textAlign: 'center',
      },
      subscribeButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
      },
      subscribeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
});
