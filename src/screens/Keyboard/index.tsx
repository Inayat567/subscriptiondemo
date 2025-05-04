import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {KeyboardStyles} from './Keyboard.styles';
import {OS} from '../../utils';

const KeyboardIssue = () => {
  const [value, setValue] = useState('');
  const [para, setPara] = useState('');

  return (
    <KeyboardAvoidingView
      style={KeyboardStyles.inputContainer}
      behavior={Platform.OS === OS.ios ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === OS.ios ? 100 : 0}>
      <ScrollView
        contentContainerStyle={KeyboardStyles.container}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={KeyboardStyles.title}>Keyboard issue on iOS</Text>
        <Text style={KeyboardStyles.text}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minima
          officia at consequuntur, voluptate nisi nemo alias. Unde magnam
          tenetur eum nobis, rerum omnis debitis, tempore laudantium molestias
          perspiciatis voluptatem dicta. Lorem ipsum dolor sit, amet consectetur
          adipisicing elit. Minima officia at consequuntur, voluptate nisi nemo
          alias. Unde magnam tenetur eum nobis, rerum omnis debitis, tempore
          laudantium molestias perspiciatis voluptatem dicta. Lorem ipsum dolor
          sit, amet consectetur adipisicing elit. Minima officia at
          consequuntur, voluptate nisi nemo alias. Unde magnam tenetur eum
          nobis, rerum omnis debitis, tempore laudantium molestias perspiciatis
          voluptatem dicta. Lorem ipsum dolor sit, amet consectetur adipisicing
          elit. Minima officia at consequuntur, voluptate nisi nemo alias. Unde
          magnam tenetur eum nobis, rerum omnis debitis, tempore laudantium
          molestias perspiciatis voluptatem dicta. Lorem ipsum dolor sit, amet
          consectetur adipisicing elit. Minima officia at consequuntur,
          voluptate nisi nemo alias. Unde magnam tenetur eum nobis, rerum omnis
          debitis, tempore laudantium molestias perspiciatis voluptatem dicta.
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minima
          officia at consequuntur, voluptate nisi nemo alias. Unde magnam
          tenetur eum nobis, rerum omnis debitis, tempore laudantium molestias
          perspiciatis voluptatem dicta.
        </Text>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="Enter any value"
          style={KeyboardStyles.input}
        />
        <TextInput
          value={para}
          onChangeText={setPara}
          placeholder="Enter multiline paragraph"
          multiline
          style={[KeyboardStyles.input, {height: 100}]}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardIssue;
