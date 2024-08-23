import React from 'react';
import { useState } from 'react';
import { Dimensions,Image,StatusBar, View, Text, Touchable, TouchableOpacity,Pressable,StyleSheet,KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard, Platform, SafeAreaView,ScrollView} from 'react-native';
import { TextInput } from 'react-native-paper';
import Buton from '../Buton';
import { useTheme } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import { getAuth,createUserWithEmailAndPassword} from 'firebase/auth' 
import { firestoreT, authT } from '../../firebase'
import { doc,setDoc } from 'firebase/firestore';
import webserverConnection from '../../WebServer';


let width = Dimensions.get('window').width;

const Register = (props) => {
  const [data, setData] = useState({
      mail: '',
      name:'',
      username: '',
      password: '',
      password_check: '',
      user_walletaddress: '',
      secureTextEntry: true,
  });

  const { colors } = useTheme();


  const updateSecureTextEntry = () => {
    setData({
        ...data,
        secureTextEntry: !data.secureTextEntry
    });
  }
  const handleRegister = async() => {
    if(data.mail === ''|| data.name ===''|| data.password ==='' || data.password_check===''|| data.user_qrcode===''){
      alert("Please fill all the fields")
      return;
    }
    if(data.password === data.password_check){
      const result = await webserverConnection.doCreateUser(data.mail, data.name, data.password, data.user_walletaddress)
      console.log("result: " +result);

      if(result == true){
        alert("Kaydınız yapıldı, artık giriş yapabilirsiniz.")
        props.navigation.navigate('Login');
      }
      if(result == false){
        alert("Wrong verification code");
      }
    }
  }
  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{alignItems: 'center', width: 440, marginHorizontal:-20}}>
        <Image style={{ height: '100%', width: '100%', position: 'absolute', top:0, left:0 }} source={require("../../assets/green.jpg")} />
          <Text
            style={{
              color: 'white',
              fontSize: 50,
              fontWeight: 'bold',
              marginVertical: 5,
              marginTop: 15
            }}>
            Kayıt
          </Text>
        <ScrollView scrollsToTop = "false" overScrollMode='always' keyboardDismissMode='on-drag'> 
          <View
            style={{
              backgroundColor: 'white',
              height: 850,
              width: 400,
              borderTopLeftRadius: 12,
              paddingTop: 10,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 37, color: "#195c3e", fontWeight: 'bold'}}>
              Hoşgeldiniz
            </Text>
            <Text
              style={{
                color: 'grey',
                fontSize: 19,
                fontWeight: 'bold',
                marginBottom: 20,
              }}>
              Hesap Oluştur
            </Text>

              <View style={styles.action}>
                  <TextInput 
                      placeholder="Email Adresiniz"
                      placeholderTextColor="#666666"
                      keyboardType='email-address'
                      style={[styles.textInput, {
                          color: colors.text
                      }]}
                      onChangeText={(input_mail) => setData({...data, mail:input_mail})}
                  />
                  
              </View>

              <View style={styles.action}>
                  <TextInput 
                      placeholder="Adınız ve Soyadınız"
                      placeholderTextColor="#666666"
                      keyboardType='name-phone-pad'
                      style={[styles.textInput, {
                          color: colors.text
                      }]}
                      autoCapitalize="none"
                      onChangeText={(input_name) => setData({...data, name:input_name})}
                  />
                  
              </View>
              <View style={styles.action}>
                  <TextInput 
                      placeholder="Kripto Cüzdan Adresinizi Giriniz"
                      placeholderTextColor="#666666"
                      style={[styles.textInput, {
                          color: colors.text
                      }]}
                      autoCapitalize="none"
                      onChangeText={(input_code) => setData({...data, user_walletaddress:input_code})}
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

              <View style={styles.action}>
                  <TextInput 
                      placeholder="Şifre Tekrar"
                      placeholderTextColor="#666666"
                      secureTextEntry={data.secureTextEntry ? true : false}
                      style={[styles.textInput, {
                          color: colors.text
                      }]}
                      autoCapitalize="none"
                      onChangeText={(input_password2) => setData({...data, password_check:input_password2})}
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

            <Buton textColor='white' bgColor={"#195c3e"} marginV ={20} widthv= {360} marginL= {-15}  btnLabel="Kayıt" Press={() => handleRegister()}/>
            <View style={{ display: 'flex', flexDirection :'row', justifyContent: "center" }}>
              <Text style={{ fontSize: 16, fontWeight:"bold" }}>Hesabınız Var mı ? </Text>
              <TouchableOpacity onPress={() => props.navigation.navigate("Login")}>
              <Text style={{ color: "#195c3e", fontWeight: 'bold', fontSize: 16 }}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        </View>
      </TouchableWithoutFeedback>
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

export default Register;