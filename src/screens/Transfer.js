import 'text-encoding-polyfill'
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView , StyleSheet, Modal, Linking, Button} from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSDK } from '@metamask/sdk-react';
import webserverConnection from '../../WebServer';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import  Web3  from 'web3'
import { ETH_DATA_FORMAT } from "web3";
import { TextEncoder } from 'text-encoding';
import { provider } from '@expo/config-plugins/build/plugins/createBaseMod';

const defaultScrollViewProps = {
  keyboardShouldPersistTaps: 'handled',
  contentContainerStyle: {
    flex: 1,
    justifyContent: 'center',
  },
};


export default function Transfer(props){

  const navigation = useNavigation();

  const {sdk, account} = useSDK();
  const [step, setStep] = useState(1);

  const [response, setResponse] = useState('');
  const [visible, setVisible] = useState(false);
  const [isResponseValid, setIsResponseValid] = useState(false);
  const [isMetamaskValid, setIsMetamaskValid] = useState(false); 
  const [isWeb3Valid, setIsWeb3Valid] = useState(false); 
  const [isReceiverValid, setIsReceiverValid] = useState(false); 
  const [isAmountValid, setIsAmountValid] = useState(false);
  const [sendingAmount, setSendingAmount] = useState(null); 
  const [sendingAmountWithPrefix, setSendingAmountWithPrefix] = useState(''); 


  const [senderInfo, setSenderInfo] = useState({
    sender_money_amount: '',
    sender_wallet_address: '',
    sender_wallet_account: '',
    sender_private_key:'',
    sender_mail:''
  });

  const [receiverInfo, setReceiverInfo] = useState({
    receiver_mail: '',
    receiver_walletCode: ''
  });

  const selectedMetamaskTransfer = async () => {

    console.log("geldi")

    if(isMetamaskValid === true) {
      setSenderInfo({
        ...senderInfo,
        sender_money_amount: await AsyncStorage.getItem('metamaskBalance'),
        sender_wallet_account: await AsyncStorage.getItem('metamaskAccount'),
      });
      console.log("acount: ",senderInfo.sender_wallet_account)
      if(!senderInfo.sender_wallet_account){
        alert("Metamask ile transfer yapabilmek için bağlanmalısınız.")
        setIsMetamaskValid(false);
      }else {
        return;
      }
    }
  }

  const validateForm = async() => { 
    setIsReceiverValid(false);
    //setWalletCode("");
    setReceiverInfo({
      ...receiverInfo,
      receiver_walletCode: ''
    });

    if (receiverInfo.receiver_mail) { 
      console.log("validate geçti ");

      try {
        if(receiverInfo.receiver_mail !== null) {
          const result = await webserverConnection.getUserInfo(receiverInfo.receiver_mail)

          if(result){
            setReceiverInfo({
              ...receiverInfo,
              receiver_walletCode: result.wallet_addr
            });
            setIsReceiverValid(true);
            //setWalletCode(result.wallet_addr);
            console.log("cüzdan kodu: ", receiverInfo.receiver_walletCode);
            getBalance();
          }
          }else{
            alert("Profile not found");
          }
      
      } catch(e) {
        alert(e.message)
      }
    /*
      try {
        if(receiverInfo.receiver_mail !== null) {
          const docRef = doc(db, "users", receiverInfo.receiver_mail);
          const docSnap = await getDoc(docRef);
      
          if (docSnap.exists()) {
            const data =  await docSnap.data();
            setReceiverInfo({
              ...receiverInfo,
              receiver_walletCode: data.wallet_qrcode
          });
          setIsReceiverValid(true);
          setWalletCode(data.wallet_qrcode);
          console.log("cüzdan kodu: ", receiverInfo.receiver_walletCode);
          } else {
            console.log("Geçersiz kulanıcı");
          }
        }
      } catch(e) {
        alert(e.message)
      }
    */
     // Form is valid, perform the submission logic 
     console.log('Kullanıcı cüzdan adresi bulundu, devam edebilirsiniz'); 

    } else { 
      // Form is invalid, display error messages 
      console.log('Form has errors. Please correct them.'); 
    } 
  };

  const getBalance = async() => {
    console.log("balancea geldi:", senderInfo.sender_wallet_address)
    const web3 = new Web3(`https://sepolia.infura.io/v3/51c13c3962954218a6d4d90f13edea41`); 
    const balance = await web3.eth.getBalance(senderInfo.sender_wallet_address);

    console.log("balance: ", web3.utils.fromWei(balance,"ether"));
    setSenderInfo({
      ...senderInfo,
      sender_money_amount: web3.utils.fromWei(balance,"ether")
    });
  }

  const storeTransactions = async(hash) => {
    console.log("transactionda")
    const result = await webserverConnection.doTransaction(senderInfo.sender_mail, receiverInfo.receiver_mail, hash)
    console.log("result: " + result);

    if(result == true){
      console.log("kayıt edildi")
    }
    if(result == false){
      console.log("kayıt basarısız");
    }
  }

  const convertAmount = async() => {

    setIsAmountValid(false);
    setIsResponseValid(false);
    console.log("amount: ", sendingAmount)
    console.log("total: ", senderInfo.sender_money_amount)

    if(sendingAmount <= senderInfo.sender_money_amount ) {
      console.log("Bakiye Yeterli")
      const prefix = '0x';
      const wei = sendingAmount *10 **18;
      let hexnumber = wei.toString(16);
      let amountInWei = prefix + hexnumber;
      setSendingAmountWithPrefix(amountInWei)
      setIsAmountValid(true);
    } else {
      alert("Bakiye Yetersiz")
      return;
    }
  }

  const sendTransactionWithoutMetamask = async() => {

    let limit;
    let fee;

    setIsResponseValid(false);

    const web3 = new Web3(`https://sepolia.infura.io/v3/51c13c3962954218a6d4d90f13edea41`); 
    const balance = await web3.eth.getBalance(senderInfo.sender_wallet_address);
    console.log("balance: ", web3.utils.fromWei(balance,"ether"));

    const gasPrice = await web3.eth.getGasPrice();
    const gasPriceInGwei = web3.utils.fromWei(gasPrice, 'gwei');
    const maxFeePerGas = web3.utils.toWei(gasPriceInGwei, 'gwei');
    
    await web3.eth
      .estimateGas(
        {
          from: senderInfo.sender_wallet_address,
          to: receiverInfo.receiver_walletCode, 
          value: web3.utils.toWei(sendingAmount, "ether"),
        },
        "latest",
        ETH_DATA_FORMAT,
      )
      .then((value) => {
        limit = value;
      });

    const tx = 
    { 
      from: senderInfo.sender_wallet_address,
      to: receiverInfo.receiver_walletCode, 
      value: web3.utils.toWei(sendingAmount, "ether"),
      gas: limit,
      nonce: await web3.eth.getTransactionCount(senderInfo.sender_wallet_address),
      data: '',
      maxPriorityFeePerGas: web3.utils.toWei("4", "gwei"),
      maxFeePerGas: maxFeePerGas,
      chainId: await web3.eth.getChainId(),
      type: 0x2,

    };

    try {
      const signedTx = await web3.eth.accounts.signTransaction(tx, senderInfo.sender_private_key);
      console.log("Raw transaction data: " + signedTx.rawTransaction);

      const receipt = await web3.eth
        .sendSignedTransaction(signedTx.rawTransaction)
        .once("transactionHash", (txhash) => {
          console.log(`Mining transaction ...`);
          console.log(`https://sepolia.etherscan.io/tx/${txhash}`);
          setResponse(txhash);
          setIsResponseValid(true);
          storeTransactions(txhash);
      });
      console.log(`Mined in block ${receipt.blockNumber}`);
    } catch (error) {
        console.log("error: ",error);
    }

  }
  
  const sendTransaction = async() => {
    setIsResponseValid(false);
    console.log("to: ", receiverInfo.receiver_walletCode)
    console.log("from: ", senderInfo.sender_wallet_address)
		const to = receiverInfo.receiver_walletCode;
		const from = senderInfo.sender_wallet_address;
		const transactionParameters = {
		  to, // Required except during contract publications.
		  from, // must match user's active address.
		  //value: '0x5AF3107A4000', // Only required to send ether to the recipient from the initiating external account.
      value: sendingAmountWithPrefix, // Only required to send ether to the recipient from the initiating external account.

		};
	  
		try {
      //const result = await sdk.connect();
			const txHash = await sdk.getProvider().request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
			});
			console.log("RESPONSE: ", txHash)
			setResponse(txHash);
      setIsResponseValid(true);
      storeTransactions(txHash);

		} catch (e) {
			console.log(e);
		}
	};

  const openLinkInWebView = async() => {
    setVisible(true)
  }

  const onNextStep = async() => {
    const address = await AsyncStorage.getItem('metamaskAddress')
    const mail = await AsyncStorage.getItem('userMail')
    console.log("mail: ", mail)
    setSenderInfo({
      ...senderInfo,
      sender_wallet_address: address,
      sender_mail: mail
    });
    console.log("walletaddres:", senderInfo.sender_wallet_address)
    console.log("mail2:", senderInfo.sender_mail)
    console.log("step: ", step)
    setStep(step + 1);
    console.log("step2: ", step)
  };

  const onPrevStep = () => {
    setStep(step - 1);
    setIsResponseValid(false)
  };

  const onSubmitSteps = () => {
    console.log('called on submit step.');
    if(isWeb3Valid === true){
      sendTransactionWithoutMetamask()
    }
    if(isMetamaskValid === true){
      sendTransaction();
    }
  };

  const closeWebView = async() => {
    setVisible(false);
    props.navigation.navigate('MyComponent')

  }

  useEffect(() => {
    console.log("mtmsk: ", isMetamaskValid)
    console.log("web3: ", isWeb3Valid)
    if(isMetamaskValid === true) {
      selectedMetamaskTransfer();
    }
    onNextStep();
  }, [isMetamaskValid]);

  const progressStepsStyle = {
    activeStepIconBorderColor: 'lightgreen',
    activeLabelColor: 'black',
    activeStepNumColor: 'black',
    activeStepIconColor: 'lightblue',
    completedStepIconColor: 'lightgreen',
    completedProgressBarColor: 'lightgreen',
    completedCheckColor: 'green',
  };

  const buttonTextStyle = {
    color: '#686868',
    fontWeight: 'bold',
  };

  return (
    <View style={{ flex: 1, marginTop: 50 }}>
      <ProgressSteps {...progressStepsStyle}>
      <ProgressStep
          label="Gonderi Turu"
          nextBtnText="İleri"
          previousBtnText="Geri"
          nextBtnDisabled = {!isWeb3Valid && !isMetamaskValid}
          onNext={onNextStep}
          onPrevious={onPrevStep}
          scrollViewProps={defaultScrollViewProps}
          nextBtnTextStyle={buttonTextStyle}
          previousBtnTextStyle={buttonTextStyle}
        >
          <View style= {{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
            <Checkbox style={{margin: 8, borderRadius:5}} value={isMetamaskValid} onValueChange={setIsMetamaskValid} onChange={() => selectedMetamaskTransfer()} disabled={isWeb3Valid}  color={isMetamaskValid ? 'darkgreen' : undefined}/>
            <Text style={{fontSize: 18, marginBottom:15}}>Transferi Metamask ile gerçekleştir {"\n"}</Text>
            <Text style={{fontSize: 15, left:8, color:isMetamaskValid ? 'darkgreen' : 'black'}}>Eğer Metamask ile transfer yapacaksanız, Metamask uygulamasına bağlanmalısınız. Profilinizden bağlantı kurabilirsiniz</Text>
          </View>
          <View style= {{flexDirection: 'row', alignItems: 'center', marginTop:30, flexWrap: 'wrap'}}>
            <Checkbox style={{margin: 8, borderRadius:5 }} value={isWeb3Valid} onValueChange={setIsWeb3Valid} disabled={isMetamaskValid} color={isWeb3Valid ? 'darkgreen' : undefined}/>
            <Text style={{fontSize: 18, marginBottom:15}}>Transferi Metamask olmadan gerçekleştir {"\n"}</Text>
            <Text style={{fontSize: 15, left:8, color:isWeb3Valid ? 'darkgreen' : 'black' }}>Eğer Metamask olmadan transfer yapacaksanız, ileri aşamalarda cüzdanınıza ait private key değeriniz istenecektir.</Text>
          </View>
        </ProgressStep>
        <ProgressStep
          label="Alıcı Cüzdan Adresi"
          nextBtnText="İleri"
          previousBtnText="Geri"
          onNext={onNextStep}
          onPrevious={onPrevStep}
          scrollViewProps={defaultScrollViewProps}
          nextBtnTextStyle={buttonTextStyle}
          previousBtnTextStyle={buttonTextStyle}
        >
          <View>
            <TextInput 
                label="Alıcı Mail Adresi"
                style={{ backgroundColor: '#f0f3f7', margin: 10 }}
                left={<TextInput.Icon icon="email-outline" />}
                autoCapitalize="none"
                activeUnderlineColor="green"
                underlineColor="darkblue"
                keyboardType='email-address'
                onChangeText={(input_mail) => setReceiverInfo({...receiverInfo, receiver_mail: input_mail})}
                onEndEditing={() =>  validateForm()}
                
            />
          </View>
          <Text style={{fontSize:16, opacity:1, fontWeight:'bold',left:10, opacity: isReceiverValid ? 1 : 0}}>Alıcı Cüzdan Adresi:  </Text>
          <Text 
            style={{fontSize:16, fontWeight:'300',padding:10, opacity: isReceiverValid ? 1 : 0}}
             >{receiverInfo.receiver_walletCode} 
          </Text>
          {}
          {!isMetamaskValid &&
          <View>
            <TextInput 
                label="Özel Anahtar"
                style={{ backgroundColor: '#f0f3f7', margin: 10 }}
                autoCapitalize="none"
                activeUnderlineColor="green"
                underlineColor="darkblue"
                keyboardType='default'
                onChangeText={(input_private_key) => setSenderInfo({...senderInfo, sender_private_key: input_private_key})}
            />
          </View>
          }
        </ProgressStep>

        <ProgressStep
          label="Tutar Belirleme"
          nextBtnText="İleri"
          previousBtnText="Geri"
          nextBtnDisabled = {!isAmountValid}
          onNext={onNextStep}
          onPrevious={onPrevStep}
          scrollViewProps={defaultScrollViewProps}
          nextBtnTextStyle={buttonTextStyle}
          previousBtnTextStyle={buttonTextStyle}
        >
          <View>
            <TextInput 
                label="Gönderilecek Tutar - ETH Cinsinden Giriniz"
                style={{ backgroundColor: '#f0f3f7', margin: 10 }}
                left={<TextInput.Icon icon="ethereum" />}
                autoCapitalize="none"
                defaultValue = ''
                
                activeUnderlineColor="green"
                underlineColor="darkblue"
                keyboardType='numeric'
                onChangeText={(input_amount) => setSendingAmount(input_amount)}
                onEndEditing={() =>convertAmount()}
            />
          </View>
          <Text 
            style={{fontSize:14, fontWeight:'300',padding:10}}>Balance: {senderInfo.sender_money_amount + " SepoliaETH"}   
          </Text>
        </ProgressStep>

        <ProgressStep
          label="İşlem Özeti"
          previousBtnText="Geri"
          finishBtnText = "Onayla"
          nextBtnDisabled = {isResponseValid ? true : false}
          //previousBtnDisabled = {response ? true : false}
          onSubmit = {onSubmitSteps}
          nextBtnTextStyle={{ color: 'darkgreen', fontSize: 18, fontWeight:'bold' }}
          //onNext={onNextStep}
          onPrevious={onPrevStep}
          scrollViewProps={defaultScrollViewProps}
          //nextBtnTextStyle={buttonTextStyle}
          previousBtnTextStyle={buttonTextStyle}
        >
          {}
            { !isResponseValid &&
              <View style={{ alignItems: 'baseline' }}>
              <Text style={{fontSize:16, opacity:1, fontWeight:'bold',left:10, marginTop:-100}}>Gönderici Cüzdan Adresi:  </Text>
              <Text 
                style={{fontSize:16, fontWeight:'300',padding:10}}
                >{senderInfo.sender_wallet_address} 
              </Text>

              <Text style={{fontSize:16, opacity:1, fontWeight:'bold',left:10, marginTop:15}}>Alıcı Cüzdan Adresi:  </Text>
              <Text 
                style={{fontSize:16, fontWeight:'300',padding:10}}
                >{receiverInfo.receiver_walletCode} 
              </Text>

              <Text style={{fontSize:16, opacity:1, fontWeight:'bold',left:10, marginTop:15}}>Gönderilecek Tutar:  </Text>
              <Text 
                style={{fontSize:16, fontWeight:'300',padding:10}}
                >{sendingAmount} SepoliaETH
              </Text>
            </View>
            }
            {isResponseValid &&
              <View style = {{flex: 1,alignItems: 'center',justifyContent: 'center'}}>
                <Button title = {"Transfer Detaylarını Görüntüle"} onPress={openLinkInWebView}/>
                <Modal
                  visible={visible}
                  presentationStyle={'overFullScreen'}
                  animationType={'slide'}
                  onRequestClose={() => closeWebView()}
                >
                  <WebView source = {{uri: 'https://sepolia.etherscan.io/tx/' +response}}/>
                </Modal>
              </View>
            }
        </ProgressStep>
      </ProgressSteps>
    </View>
  );
};

const styles = StyleSheet.create({
    action: {
        flexDirection: 'row',
        borderBottomColor: '#f2f2f2',
        flex:0.2,
        marginLeft:10,
  
    },
    textInput: {
        flex:1,
        marginLeft:-5,
        backgroundColor: 'white',
        paddingVertical:10,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderTopWidth:1,
        borderBottomWidth:1
  
  
    },
  
  });

