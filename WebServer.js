import React from 'react';
import axios from 'axios';


class Network extends React.Component {

    state ={
        ws_api_key : '.....',
    }
    
    handleApiKey = (text) => {
        this.setState({ ws_api_key: text })
    }

    doLogon = async(email, password) => {
        console.log("logongeldi")
        const myBodydata = JSON.stringify({
            eposta : email,
            pwd : password,
            api_key : this.state.ws_api_key,
            do : 'do-logon'
        })
        let res = await this.postData(myBodydata); //baÅŸarÄ±lÄ± => nickNAme 6 token dÃ¶necek
        if(res){
            return true;
        } else {
            return false;
        }
    }

    doTransaction = async(emailFrom, emailTo, hash) => {
        const myBodydata = JSON.stringify({
            email_frm : emailFrom,
            email_to : emailTo,
            trn_hash : hash,
            api_key : this.state.ws_api_key,
            do : 'do-trans'
        })
        let res = await this.postData(myBodydata); //baÅŸarÄ±lÄ± => nickNAme 6 token dÃ¶necek
        if(res){
            return true;
        } else {
            return false;
        }
    }

    doCreateUser = async(email, name_surname, password, wallet_address) => { 
        // Register yapÄ±lacaÄŸÄ± zaman kullanÄ±cÄ± bilgileri buraya gelir. Burada web server iÃ§in body kÄ±smÄ± oluÅŸturulup postData 
        // fonsksiyonuna gÃ¶nderilir.
        const myBodydata2 = JSON.stringify({
            eposta : email,
            name_sn : name_surname,
            pwd : password,
            wallet_addr : wallet_address,
            api_key : this.state.ws_api_key,
            do : 'do-user-insert'
        })

        let doUserResult = await this.postData(myBodydata2);    
        if(doUserResult){
            return true;
        } else {
            return false;
        }
    }

    getUserInfo = async(email) => {

        const myBodydata = JSON.stringify({
            eposta: email,
            api_key : this.state.ws_api_key,
            do : 'get-user-info'
        })
        let getCommentJson = await this.postData(myBodydata); 

        if(getCommentJson){
            return getCommentJson.data[0];
        }if(getCommentJson.data === null){
            alert("No info from web server.")
        }  
        else {
            return false;
        }
    }

    getTransactions = async(email) => {

        const myBodydata = JSON.stringify({
            eposta: email,
            api_key : this.state.ws_api_key,
            do : 'get-transactions'
        })
        let getCommentJson = await this.postData(myBodydata); 

        if(getCommentJson){
            return getCommentJson;
        }if(getCommentJson.data === null){
            alert("No info from web server.")
        }  
        else {
            return false;
        }
    }

    postData = async(pBodyData) => {
        var URL = '.....';

        try {
            let response = await axios.post(URL, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
                body: pBodyData
            });
                    
            if (response.data.result == '1') {
                return response.data;
            
            } else {
                alert(JSON.stringify(response.data.error_txt));
                return false;
            }
            
        } catch (error) {
            console.log("CatchError", error)
            alert( error);
        }
    }
}

const webserverConnection = new Network();
export default webserverConnection;