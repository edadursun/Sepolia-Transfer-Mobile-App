import React from 'react';
import { useEffect, useState } from 'react';
import {ViewStyleSheet, ScrollView,ImageText, StyleSheet, View, Image,Text, RefreshControl} from 'react-native';
import Buton from '../Buton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Expocomponent from '../MetamaskConnect';
import webserverConnection from '../../WebServer';

const Profile = ({props}) => {
  const [userInfo, setUserInfo] = useState({
    store_mail: '',
    store_name: '',
    store_wallet_value: null,
    store_walletCode: ''
  });

  const [email, setEmail] = useState(''); 

  const getEmail = async() => {
      const mail = await AsyncStorage.getItem('userMail')
      console.log("mail: ", mail)
      setEmail(mail);
      getDocFromFirebase()

  }
  
  const getDocFromFirebase = async() => {
    if(email){
      console.log("email var, webserverdan bilgi alınıyor.")
      const result = await webserverConnection.getUserInfo(email)

      if(result){
        setUserInfo({
          ...userInfo,
          store_mail: result.email,
          store_name: result.name_surname,
          store_walletCode: result.wallet_addr
        });
        await AsyncStorage.setItem('metamaskAddress', result.wallet_addr)
        console.log("profilewallet:",await AsyncStorage.getItem('metamaskAddress'))
      }
      if(!result){
        alert("Profile not found");
      }
    }else {
    }
  }

  useEffect(() => {
    getEmail();
  },[email])  

  return (
    <View>
      <View style = {{backgroundColor:"#f2f2f2",width: 400, height: 360}}>
        <View style={{padding:10,height:150, width:"100%",backgroundColor:"#000"}}>
          <Buton>
            <Image source={require("../../assets/pink.jpg")} style={{width:30,height:30}}></Image>
          </Buton>
        </View>
        <View style={{alignItems:'center'}}>
          <Image source={require("../../assets/leaves.jpg")} style={{width:140,height:140, borderRadius:100,marginTop:-70}} ></Image>
          <Text style={{fontSize:23, fontWeight:'bold',padding:10 }}>Kullanıcı Bilgileri </Text>
        </View>
          { userInfo.store_mail &&
          <View style={{alignSelf:'auto', flexDirection:'row', marginTop:0}}>
            <Text style={{fontSize:18, opacity:1, fontWeight:'bold'}}>Mail Adresiniz:  </Text>
            <Text style={{fontSize:18, opacity:1}}>{userInfo.store_mail} </Text>
          </View>
          }
          {/*<Text style={{fontSize:17, padding:1}}>Mail Adresiniz : eda2@gmail.com</Text>*/}
          { userInfo.store_name &&
            <View style={{alignSelf:'auto', flexDirection:'row'}}>
              <Text style={{fontSize:18, opacity:1, fontWeight:'bold'}}>Adınız ve Soyadınız:  </Text>
              <Text style={{fontSize:18, opacity:1}}>{userInfo.store_name} </Text>
            </View>
          }
          { userInfo.store_walletCode &&
            <View style={{alignSelf: 'flex-start', flexDirection:'row', flexWrap: 'wrap' }}>
              <Text>
                <Text style={{fontSize:18, opacity:1, fontWeight:'bold'}}>Cüzdan Adresiniz: {"\n"} </Text>
                <Text style={{fontSize:18, opacity:1,}}>{userInfo.store_walletCode} </Text>
              </Text>
            </View>
          }
      </View>
        <Expocomponent />
    </View>
    
  );

};
const styles = StyleSheet.create({
  action: {
      flexDirection: 'row',
      borderBottomColor: '#f2f2f2',
      flex:1,
  },
});

export default Profile;

