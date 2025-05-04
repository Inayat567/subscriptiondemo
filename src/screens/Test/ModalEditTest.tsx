import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const ModalEditTest = () => {
  const [showModal, setShowModal] = useState(false);
  const spacerHeight = useRef(new Animated.Value(10)).current;
  const scrollRef = useRef<ScrollView>(null);
  const input9Ref = useRef<TextInput>(null);

  useEffect(() => {
    const KeyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
      Animated.timing(spacerHeight, {
        toValue: 100,
        duration: 100,
        useNativeDriver: false,
      }).start();
    });
    const KeyboardHideListener = Keyboard.addListener('keyboardDidHide', () =>
      Animated.timing(spacerHeight, {
        toValue: 10,
        duration: 100,
        useNativeDriver: false,
      }).start(),
    );

    return () => {
      KeyboardShowListener.remove();
      KeyboardHideListener.remove();
    };
  }, []);

  const toggleModal = () => {
    setShowModal(false);
  };

  const Input = ({
    placeholder,
    title,
    style,
    multiline,
    onFocus,
    inputRef,
  }: {
    placeholder: string;
    title: string;
    style?: any;
    multiline?: boolean;
    onFocus?: () => void;
    inputRef?: any;
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputTitle}>{title}</Text>
      <TextInput
        ref={inputRef}
        placeholder={placeholder}
        style={[styles.input, style]}
        multiline={multiline}
        onFocus={onFocus}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );

  return (
    <>
      <Pressable style={styles.sendButton} onPress={() => setShowModal(true)}>
        <Text style={styles.sendButtonText}>Show Modal</Text>
      </Pressable>

      {showModal && (
        <Modal
          visible={showModal}
          onRequestClose={toggleModal}
          animationType="slide">
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
            <ScrollView
              ref={scrollRef}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.body_container}
              keyboardDismissMode='on-drag'
              >
              <Input title={`Text Input 1`} placeholder="Enter text" />
              <Input title={`Text Input 2`} placeholder="Enter text" />
              <Input title={`Text Input 3`} placeholder="Enter text" />
              <Input title={`Text Input 4`} placeholder="Enter text" />
              <Input title={`Text Input 5`} placeholder="Enter text" />
              <Input title={`Text Input 6`} placeholder="Enter text" />
              <Input title={`Text Input 7`} placeholder="Enter text" />
              <Input title={`Text Input 8`} placeholder="Enter text" />

              <Input
                title="Text Input 9"
                placeholder="Type something..."
                multiline
                style={{minHeight: 100}}
                inputRef={input9Ref}
                onFocus={() => {
                  setTimeout(() => {
                    scrollRef.current?.scrollToEnd({animated: false});
                  }, 300);
                }}
              />
              <Animated.View style={{height: spacerHeight}} />
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  body_container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sendButton: {
    alignItems: 'center',
    borderRadius: 12,
    height: 45,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#000',
    marginTop: 100,
    marginHorizontal: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputTitle: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 5,
    color: '#333',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    backgroundColor: '#f9f9f9',
  },
});

export default ModalEditTest;
