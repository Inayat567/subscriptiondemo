import Modal from 'react-native-modal';
import React, {useEffect, useMemo, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {height, width} from 'react-native-dimension';
import {I18nManager, Modal as DefaultModal, Pressable, StatusBar, StyleSheet, TouchableWithoutFeedback, SafeAreaView, View, Platform} from 'react-native';

const BaseModal = ({
   showModal,
   onClose,
   style,
   isFullScreen = true,
   children,
   title,
}) => {

   const makeStyle = (arr, obj = {}) => {
      if (Array.isArray(arr))
         arr.map(a => {
            if (Array.isArray(a)) makeStyle(a, obj);
            else Object.assign(obj, a);
         });
      else return Object.assign(obj, arr);
      return obj;
   };

   const [visible, SetVisible] = useState(showModal);
   const [pressedCloseBtn, setPressedCloseBtn] = useState(false);

   useEffect(() => {
      SetVisible(showModal);
   }, [showModal]);

   const onRequestClose = () => {
      onClose();
   };

   return (
      <>
         <Modal
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            deviceHeight={height(100)}
            deviceWidth={width(100)}
   
            coverScreen={false}
            onRequestClose={onClose}
            visible={visible}
            style={[{marginLeft: 0, marginRight: 0, paddingHorizontal: 10}]}>

            <SafeAreaView style={{width: '100%', height: '100%'}}>
               <View style={[{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 10, width:'100%',}]}>
                  {isFullScreen === false ? (
                     <View style={[{height: isFullScreen ? '100%' : 'auto', backgroundColor: '#fff', paddingBottom: 10}]}>
                        <GestureHandlerRootView
                           style={[
                              {backgroundColor: '#fff', paddingBottom: 10, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width:'100%'},
                           ]}>
                           {children}
                        </GestureHandlerRootView>
                     </View>
                  ) : (
                     <GestureHandlerRootView
                           style={[
                              {backgroundColor: '#fff', paddingBottom: 10, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width:'100%'},
                           ]}>
                        {children}
                     </GestureHandlerRootView>
                  )}
               </View>
            </SafeAreaView>
         </Modal>
      </>
   );
};

const styles = StyleSheet.create({
   menuContainer: {overflow: 'hidden'},
   title: {fontSize: 14, fontWeight: '700', paddingHorizontal: 8},
   title_container: {paddingVertical: 5},
   shadowMenuContainer: {
      backgroundColor: 'white',
      borderRadius: 4,
      opacity: 0,
      position: 'absolute',

      // Shadow
      ...Platform.select({
         ios: {
            shadowColor: 'black',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.14,
            shadowRadius: 2,
         },
         android: {
            elevation: 8,
         },
      }),
   },
});

export default BaseModal;
