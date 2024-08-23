import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import Background from '../Background';
import Buton from '../Buton';
import webserverConnection from '../../WebServer';
import MyComponent from '../BottomBar';

const Login = (props) => {
  const [data, setData] = useState({
    mail: '',
    password: '',
    secureTextEntry: true,
  });

const { colors } = useTheme();

const updateSecureTextEntry = () => {
  setData({
      ...data,
      secureTextEntry: !data.secureTextEntry
  });
}

const storeMail = async () => {
  try {
    await AsyncStorage.removeItem('userMail')
    await AsyncStorage.setItem('userMail', data.mail)
  } catch(error) {

    alert(error.message)
  }
}

const handleLogin = async() => {
  
  if(data.mail === ''||  data.password ===''){
    alert("Please fill all the fields")
    return;
  }

  const result = await webserverConnection.doLogon(data.mail, data.password)
  console.log("result: " +result);

  if(result == true){
    storeMail();
    alert("Giriş başarılı, hoşgeldiniz.")
    props.navigation.navigate('MyComponent');
  }
  if(result == false){
    alert("Wrong email or password");
  }

}
  return (
    <Background>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{alignItems: 'center', width: 440, marginHorizontal:-20}}>
        <Text
          style={{
            color: 'white',
            fontSize: 50,
            fontWeight: 'bold',
            marginVertical: 15,
            marginTop: 25
          }}>
          Giriş
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            height: 600,
            width: 400,
            borderTopLeftRadius: 120,
            paddingTop: 80,
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 37, color: "#195c3e", fontWeight: 'bold'}}>
            Tekrar Hoşgeldin
          </Text>
          <Text
            style={{
              color: 'grey',
              fontSize: 19,
              fontWeight: 'bold',
              marginBottom: 20,
            }}>
            Hesabına Giriş Yap
          </Text>
          <View style={styles.action}>
                <TextInput 
                    placeholder="Email"
                    placeholderTextColor="#666666"
                    keyboardType='email-address'
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={(input_mail) => setData({...data, mail:input_mail})}
                />
            </View>
            
            <View style={styles.action}>
                <TextInput 
                    placeholder="Şifre"
                    placeholderTextColor="#666666"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={(input_password) => setData({...data, password:input_password})}
                />
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        style = {{paddingVertical:10}}
                        name="eye-off"
                        color="grey"
                        size={25}
                    />
                    :
                    <Feather 
                        style = {{paddingVertical:10}}
                        name="eye"
                        color="grey"
                        size={25}
                    />
                    }
                </TouchableOpacity>
            </View>

          <Buton textColor='white' bgColor={"#195c3e"} marginV ={20} marginL= {-15} widthv= {360} btnLabel="Giriş" Press={() => handleLogin()} />
          <View style={{ display: 'flex', flexDirection :'row', justifyContent: "center" }}>
            <Text style={{ fontSize: 16, fontWeight:"bold" }}>Hesabın Yok Mu? </Text>
            <TouchableOpacity onPress={() => props.navigation.navigate("Register")}>
            <Text style={{ color: "#195c3e", fontWeight: 'bold', fontSize: 16 }}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </TouchableWithoutFeedback>
    </Background>
  );
};

const styles = StyleSheet.create({
  action: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 2
  },
  actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5
  },
  textInput: {
      flex:0.75,
      marginLeft:-40,
      backgroundColor: 'white',
  },
  errorMsg: {
      color: '#FF0000',
      fontSize: 14,
  },
});
export default Login;