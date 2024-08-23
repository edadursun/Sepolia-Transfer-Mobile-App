import React from 'react';
import { Text, View,Image } from 'react-native';
import Background from '../Background';
import Buton from '../Buton';

const MainPage = (props) => {
  return (
    <Background>
      <View style={{ marginHorizontal: 25, marginVertical: 80 }}>
        <Text style={{ color: '#faddcd', fontSize: 60, fontStyle:'italic' }}>Let's Start</Text>
        <Text style={{ color: '#faddcd', fontSize: 60, marginBottom: 320,fontStyle:'italic' }}>Transfer</Text>
        <Buton bgColor={"#195c3e"} marginV ={10}  widthv= {360} marginL= {-15}  textColor='white' btnLabel="Giriş Yap" Press={() => props.navigation.navigate("Login")} />
        <Buton bgColor='#faddcd' marginV ={10} widthv= {360} marginL= {-15}  textColor={"#4d031f"} btnLabel="Kayıt Ol" Press={() => props.navigation.navigate("Register")} />
        <Text style={{ color: '#faddcd', fontSize: 18,marginTop:-10,fontStyle:'italic'  }}>Kayıt olmadın mı?</Text>
      </View>
    </Background>
  );
}

export default MainPage;