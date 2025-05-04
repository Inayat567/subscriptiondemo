import {forwardRef, useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const CKeyboardAwareScrollView = (
  {scrollEnabled = true, children, ...props},
  ref,
) => {
  const [showKeybard, SetShowKeyboard] = useState(false);
  useEffect(() => {
    const KeyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
      SetShowKeyboard(true);
    });
    const KeyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      SetShowKeyboard(false);
    });

    return () => {
      KeyboardShowListener.remove();
      KeyboardHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? undefined : 'height'}>
      <ScrollView
        {...props}
        contentContainerStyle={{paddingBottom: 300}}
        scrollEnabled={scrollEnabled && !showKeybard}
        ref={ref}
        keyboardDismissMode={'on-drag'}
        automaticallyAdjustKeyboardInsets={true}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default forwardRef((props, ref) => CKeyboardAwareScrollView(props, ref));
