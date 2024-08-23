import { Appbar, FAB, useTheme } from 'react-native-paper';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, Dimensions,View } from 'react-native';
import { useNavigation } from '@react-navigation/native';


let width = Dimensions.get('window').width;
const BOTTOM_APPBAR_HEIGHT = 60;

export default function MyComponent({Press, profileDisabled, QrCodeDisabled,TransferDisabled,HistoryDisabled}) {
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <Appbar
      style={[
        styles.bottom,
        {
          height: BOTTOM_APPBAR_HEIGHT +20,
          backgroundColor: '#f2f2f2',
          marginTop:-10,
        },
      ]}
      safeAreaInsets={{ bottom }}
    >
      <Appbar.Action disabled={profileDisabled} style={{marginLeft:50}}size={40} icon="account" onPress={() => navigation.navigate("Profile")} />
      <Appbar.Action disabled={QrCodeDisabled} size={40} icon="qrcode" onPress={() => navigation.navigate("QRCodePage")} />
      <Appbar.Action disabled={TransferDisabled} size={40} icon="cash-fast" onPress={() => navigation.navigate("TransferApp")} />
      <Appbar.Action disabled={HistoryDisabled} size={40} icon="history" onPress={() => navigation.navigate("TransactionHistory")} />
    </Appbar>
  );
};

const styles = StyleSheet.create({
    bottom: {
      backgroundColor: 'aquamarine',
      position: 'relative',
      left: -30,
      right: 0,
      //bottom: -30,
      top: 10,
      borderRadius: 10,
      width:450,
		  justifyContent: 'center'
    }
  });


