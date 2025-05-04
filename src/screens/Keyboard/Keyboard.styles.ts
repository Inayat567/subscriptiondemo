import {StyleSheet} from 'react-native';

export const KeyboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 220,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    color: '#000',
    textAlign: 'justify',
    marginBottom: 20,
  },
  inputContainer:{
    flex: 1,
    marginTop: 20,
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
});
