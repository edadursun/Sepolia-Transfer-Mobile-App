import { useSDK,useSDKConfig } from '@metamask/sdk-react';
import 'node-libs-expo/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet,View, Text, ScrollView, RefreshControl } from 'react-native';
import { TextInput} from 'react-native-paper';
import { useEffect, useState} from 'react';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import Buton from './Buton';
import  Web3  from 'web3'
import { ETH_DATA_FORMAT } from "web3";
import { TextEncoder } from 'text-encoding';
import { provider } from '@expo/config-plugins/build/plugins/createBaseMod';

export default function Expocomponent() {
	const {sdk,account,chainId, balance } = useSDK();
	const [balanceT, setBalance] = useState('');
	const [address, setAddress] = useState('');

	const [refreshing, setRefreshing] = useState(false);

	
	const connectWallet = async () => {
		try {
			if(account){
				sdk.terminate();
				const a = await sdk.connect();
			}else if (!account) {
				const result2 = await sdk.connect();
			}else {
				console.log("Metamaske bağlısınız")
				return;
			} 		
		} catch (e) {
			console.log('ERROR', e);
		}
	};

	const getBalance = async() => {
		if(!account && address){
			console.log("getBalance:", address)
			const web3 = new Web3(`https://sepolia.infura.io/v3/51c13c3962954218a6d4d90f13edea41`); 
			const balanceA = await web3.eth.getBalance(address);
		
			console.log("balance: ", web3.utils.fromWei(balanceA,"ether"));
			setBalance(web3.utils.fromWei(balanceA,"ether"))
		}
	}

	const handleRefresh = () => {
		setRefreshing(true);
		getBalance().then(() => setRefreshing(false));
	}
	
	useEffect(()=>{

		const storeData = async () => {
			await AsyncStorage.setItem('metamaskBalance', balanceT)
			await AsyncStorage.setItem('metamaskAccount', account)
		}
		const deleteData = async () => {
			let adres;
			await AsyncStorage.removeItem('metamaskBalance')
			await AsyncStorage.removeItem('metamaskAccount')
			adres = await AsyncStorage.getItem('metamaskAddress')
			setAddress(adres)
		}

		if(balance){
			const value = Number(balance);
			const converted = (value / 10**18).toString();
			setBalance(converted);
			storeData();
		}if(balanceT){
			getBalance()
			return;

		}else{
			console.log("No balance")
			deleteData();
			getBalance();
		}

	})

	return (
		<ScrollView
		contentContainerStyle={{ flexGrow: 1 }}
		refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
	  >	
		<View style={styles.container}>
			{balanceT &&
				<View style={{ marginBottom: -230, alignItems: 'center' }}>
					<Text style={styles.title}>Cüzdan Bilgileriniz</Text>
					<View style={styles.action}>
						<TextInput
							placeholder={address}
							style={[styles.textInput, {
							}]}
							autoCapitalize="none"
							editable={false}
							multiline={true}
							left={<TextInput.Icon icon="wallet-outline" />}
						/>
					</View>
					<View style={styles.action}>
						<TextInput
							placeholder={balanceT + " SepoliaETH"}
							style={[styles.textInput, {
							}]}
							autoCapitalize="none"
							editable={false}
							multiline={true}
							left={<TextInput.Icon icon="bank" />}
						/>
					</View>
				</View>
			}
			<Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 260, color: "green", marginRight: 20, left: 10 }}>{account ? 'Metamask cüzdanınız bağlı, transfer yapabilirsiniz' : 'Metamask cüzdanınız bağlı değil'} </Text>
			<Buton
				textColor='white'
				bgColor={account ? "black" : "darkgreen"}
				//disabledButon={account ? true : false}
				marginV={10}
				widthv={300}
				marginL={-15}
				btnLabel={account ? "Metamask Güncelle" : "Metamask Bağlan"}
				Press={() => connectWallet()}
			/>
			{/*<MyComponent TransferDisabled={account ? false : true} /> */}
		</View>
	</ScrollView>	
	);
}

const styles = StyleSheet.create({
	container: {
		//flex: 1,
		backgroundColor: '#f2f2f2',
		alignItems: 'center',
		justifyContent: 'center',
	},

	action: {
		flexDirection: 'row',
		marginTop: 15,
		width:310,
		marginRight:-30,
		borderBottomColor: '#f2f2f2',
		paddingBottom: -5,
	},
	textInput: {
		flex:1,
		marginLeft:-40,
		color:"black",
		fontStyle:'italic',
		backgroundColor: '#f2f2f2',
	},
	title: {
		fontSize: 23,
		fontWeight: 'bold',
		marginBottom: 15, // Add some space below the title
		marginTop: 15, // Add some space above the title
	},
});
