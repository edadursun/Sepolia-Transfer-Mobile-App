import { MetaMaskProvider } from '@metamask/sdk-react';
import 'node-libs-expo/globals';
import { Linking, StyleSheet } from 'react-native';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import Transfer from './Transfer';

export default function TransferApp () {
  let canOpenLink = true;
  
  return (
    <Transfer />
  );

};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

