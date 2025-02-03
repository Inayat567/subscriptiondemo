import {View} from 'react-native';
import React from 'react';
import {WraperStyles} from './Wrapper.styles';

const Wrapper = (children: React.ReactNode) => (
  <View style={WraperStyles.container}>{children}</View>
);

export default Wrapper;
