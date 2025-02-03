import {Platform, StyleSheet} from 'react-native';
import { OS } from '../../utils';
import { colors } from '../../utils/colors';

export const WraperStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: Platform.OS === OS.ios ? 20 : 0,
  },
});
