import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import 'node-libs-expo/globals';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import {ViewStyleSheet, ScrollView,ImageText, StyleSheet, View, Image,Text, Linking} from 'react-native';
import { MetaMaskProvider } from '@metamask/sdk-react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from "react-native-paper";

import MainPage from "./src/screens/MainPage";
import Login from "./src/screens/Login";
import Profile from "./src/screens/Profile";
import QRCodePage from "./src/screens/QRCode";
import Bluetooth from "./src/screens/Bluetooth";
import TransactionHistory from "./src/screens/TransactionHistory"
import TransferApp from "./src/screens/TransferApp";
import Register from "./src/screens/Register";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const homeName = "Profil";
const qrCodeName = "Karekod";
const transactionName = "Transfer";
const transactionName2 = "Transfer2";
const historyName = "Geçmiş";


function MyComponent() {
  return (
    <Tab.Navigator
      initialRouteName="Ana Sayfa"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {padding:-10, height:60, display: "flex", backgroundColor: '#f2f2f2'},
        tabBarActiveTintColor: 'darkgreen',
        tabBarLabelStyle: {fontSize: 15},
      }} 

    >
      <Tab.Screen
        name={homeName}
        component={Profile}
        options={{title: homeName , 
        tabBarIcon: ({ color, size }) => {
          return <Icon source="home" size={35} color={color} />;
        },
        }}
      />
      <Tab.Screen
        name={qrCodeName}
        component={QRCodePage}
        options={{title: qrCodeName , 
        tabBarIcon: ({ color, size }) => {
          return <Icon source="qrcode" size={35} color={color} />;
        },
        }}
      />
      <Tab.Screen
        name={transactionName}
        component={TransferApp}
        options={{title: transactionName , 
        tabBarIcon: ({ color, size }) => {
          return <Icon source="alpha-m-box-outline" size={35} color={color} />;
        },
        }}
      />
      <Tab.Screen
        name={historyName}
        component={TransactionHistory}
        options={{title: historyName , 
        tabBarIcon: ({ color, size }) => {
          return <Icon source="history" size={35} color={color} />;
        },
        }}
      />
    </Tab.Navigator>
  );
}

const Navigator = () => {
  return(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} >
        <Stack.Screen name= "MainPage" component={MainPage}/>
        <Stack.Screen name= "Login" component={Login}/>
        <Stack.Screen name= "Register" component={Register}/>
        <Stack.Screen name= "MyComponent" component={MyComponent}/>
        {/*<Stack.Screen name= "Profile" component={Profile}/>
        <Stack.Screen name= "QRCodePage" component={QRCodePage}/>
        <Stack.Screen name= "Bluetooth" component={Bluetooth}/>
        <Stack.Screen name= "TransferApp" component={TransferApp}/>
        <Stack.Screen name= "TransactionHistory" component={TransactionHistory}/>*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const App = () => {
  let canOpenLink = true;

  return(
    <MetaMaskProvider
          debug={false}
          sdkOptions={{
            logging: {
              developerMode: false,
            },
            communicationServerUrl: process.env.REACT_APP_COMM_SERVER_URL,
            checkInstallationImmediately: true, // This will automatically connect to MetaMask on page load
            dappMetadata: {
              name: 'Demo React App',
            },
            openDeeplink: (link, _target) => {
              //console.debug(`App::openDeepLink() ${link}`);
              if (canOpenLink) {
                Linking.openURL(link);
              } else {
                /*console.debug(
                  'useBlockchainProiver::openDeepLink app is not active - skip link',
                  link,
                );
                */
              }
            },
            //wakeLockType: Temporary
          }}>
        <Navigator/>
    </MetaMaskProvider >
  )
};

export default App;


