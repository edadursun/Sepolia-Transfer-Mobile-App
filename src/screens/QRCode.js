import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import QRCode from 'react-native-qrcode-svg';
import SvgQRCode from 'react-native-qrcode-svg';
import { useEffect, useState } from 'react';
import { firebase,collection, getDoc, doc,db, updateDoc} from "../../firebase"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Buton from '../Buton';
import webserverConnection from '../../WebServer';
import MyComponent from '../BottomBar';


export default function QRCodePage(props) {

  const [user_qr, setUserQr] = useState('')
  const [email, setEmail] = useState(''); 

  const getEmail = async() => {
      const mail = await AsyncStorage.getItem('userMail')
      console.log("mail: ", mail)
      setEmail(mail);
      getDocFromFirebase()

  }

  async function getDocFromFirebase() {
      if(email){
        console.log("email var, webserverdan bilgi alınıyor.")
        const result = await webserverConnection.getUserInfo(email)
  
        if(result){
          setUserQr(result.wallet_addr)
        
        }
        if(!result){
          alert("Profile not found");
        }
      }else {
      }
    }
    useEffect(() => {
      getEmail();
    }, [email]);

  return (
    <View style={styles.container}>
      <Text style={{fontSize:20,fontWeight:'600', paddingTop:80}}>Metamask Cüzdan Adresiniz: </Text>
      <View
          style={{
          width: '100%',
          paddingTop:20,
          justifyContent: 'space-around',
          alignItems: 'center',
          }}
      >
        { user_qr &&
            <SvgQRCode size={180} value={user_qr}/>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#e8f0df',
    },
  });