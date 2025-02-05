import {StyleSheet} from 'react-native';
import {width} from '../../utils';

export const PDStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {textAlign: 'center', marginVertical: 30},
  button: {
    position: 'absolute',
    bottom: '5%',
    left: '28%',
    backgroundColor: '#4CAF00',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
  bottomContainer: {
    flexDirection: 'row',
    width: width * 0.85,
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
  },
  boldText: {fontSize: 14, fontWeight: 'bold'},
});
