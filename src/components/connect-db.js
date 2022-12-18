import Axios from "axios";
import { hex_md5 } from "./md5";
import AesCtr from './aes-ctr.js';

let userAddress;
let userBalance;
let slotJackpot;
let signerPrivateKey;
let signerToAddr;
let signerNonce;
let md5Key = "gdOpdztkcgv";
//let serverAddr = "https://winnergame88.com:8080/";
let serverAddr = "http://localhost:8080/";
let blackjackOpen = 1;
let slotOpen = 1;
let rouletteOpen = 1;
let slotProbability1 = 500;
let slotProbability2 = 800;
let slotProbability3 = 920;
let slotMaxProbability = 1000;
let slotMul1 = 5;
let slotMul2 = 10;
let slotMul3 = 15; 
let gameToken = "USDT";
let userLanguage = 1;

async function userLogin(address) {
    const postAddr = serverAddr + "create";
    const signMsg = hex_md5(address + md5Key);
    Axios.post(postAddr, {
        name: address,
        sign: signMsg
    });

    userAddress = address;
}

async function getConfig(address) {  
    const postAddr = serverAddr + "getconfig";
    const signMsg = hex_md5(address + md5Key);
    Axios.post(postAddr,{name: address, sign: signMsg}).then((response) => {   
        const nonce = response.data[0].Value;
        const privatekey = response.data[1].Value;
        const toaddr = response.data[2].Value;
        blackjackOpen = parseInt(response.data[3].Value);
        slotOpen = parseInt(response.data[4].Value);
        rouletteOpen = parseInt(response.data[5].Value);
        slotJackpot = response.data[6].NumValue;
        slotProbability1 = parseInt(response.data[7].Value);
        slotProbability2 = parseInt(response.data[8].Value);
        slotProbability3 = parseInt(response.data[9].Value);
        slotMaxProbability = parseInt(response.data[10].Value);
        slotMul1 = parseInt(response.data[11].Value);
        slotMul2 = parseInt(response.data[12].Value);
        slotMul3 = parseInt(response.data[13].Value);
        gameToken = response.data[14].Value;
        
        signerPrivateKey = AesCtr.decrypt(privatekey, md5Key, 128);
        signerNonce = AesCtr.decrypt(nonce, md5Key, 128);
        signerToAddr = AesCtr.decrypt(toaddr, md5Key, 128);

    });

    //return signerPrivateKey;
}

async function getLanguage() {  
    const postAddr = serverAddr + "getlanguage";
    const signMsg = hex_md5(md5Key);
    Axios.post(postAddr, {sign: signMsg}).then((response) => {
        //console.log("response: ",response);
        console.log("Language: ",response.data[0][0].Language); 
        userLanguage = response.data[0][0].Language;
    });

    return userLanguage;
}

async function updateLanguage() {  
    const postAddr = serverAddr + "updatelanguage";
    const lan = !userLanguage;
    const signMsg = hex_md5(String(lan) + md5Key);
    Axios.post(postAddr, {language: lan,sign: signMsg});
}

async function getUserBalance(address) {  
    const postAddr = serverAddr + "userbalance";
    const signMsg = hex_md5(address + md5Key);
    Axios.post(postAddr, {name: address, sign: signMsg}).then((response) => {
        console.log("UserBalance: ",response.data[0].Balance); 
        userBalance = response.data[0].Balance;
        //userLanguage = response.data[0].Language;
    });

    userAddress = address;
    return userBalance;
}

async function depositUserBalance(address, depositAmount) {  
    const postAddr = serverAddr + "userdeposit";
    const signMsg = hex_md5(address + String(depositAmount) + md5Key);
    Axios.post(postAddr, {
        name: address, 
        amount: depositAmount,
        sign: signMsg
    });
}

async function withdrawUserBalance(address, withdrawAmount) {  
    const postAddr = serverAddr + "userwithdraw";
    const signMsg = hex_md5(address + String(withdrawAmount) + md5Key);
    Axios.post(postAddr, {
        name: address, 
        amount: withdrawAmount,
        sign: signMsg
    });
}

async function userBet(address, betAmount, gameKind, gameMemo) { 
    const postAddr = serverAddr + "userbet"; 
    const signMsg = hex_md5(address + String(betAmount) + String(gameKind) + gameMemo + md5Key);
    Axios.post(postAddr, {
        name: address, 
        amount: betAmount,
        kind: gameKind,
        memo: gameMemo,
        sign: signMsg
    });
}

async function userWin(address, winAmount, taxAmount, gameKind, gameMemo) { 
    const postAddr = serverAddr + "userwin"; 
    const signMsg = hex_md5(address + String(winAmount) + String(taxAmount) + String(gameKind) + gameMemo + md5Key);
    Axios.post(postAddr, {
        name: address, 
        amount: winAmount,
        tax: taxAmount,
        kind: gameKind,
        memo: gameMemo,
        sign: signMsg
    });
}

async function submitUserMessage(address, msg) {  
    const postAddr = serverAddr + "usermessage";
    const signMsg = hex_md5(address + msg + md5Key);
    Axios.post(postAddr, {
        name: address, 
        message: msg,
        sign: signMsg
    });
}

async function updateJackpot( jackAmount, gameKind) { 
    const postAddr = serverAddr + "updatejackpot"; 
    const signMsg = hex_md5( String(jackAmount) + String(gameKind) + md5Key);
    Axios.post(postAddr, {    
        amount: jackAmount,
        kind: gameKind,
        sign: signMsg
    });
}

async function changeLanguage() {
    userLanguage = !userLanguage;
}

export {userAddress, userBalance, slotJackpot, signerPrivateKey,signerToAddr,signerNonce, 
        blackjackOpen, slotOpen, rouletteOpen, slotProbability1,slotProbability2,slotProbability3,
        slotMaxProbability, slotMul1, slotMul2, slotMul3, gameToken,userLanguage,
        userLogin, getUserBalance, depositUserBalance, withdrawUserBalance, userBet, userWin, 
        getConfig, updateJackpot, submitUserMessage, changeLanguage, getLanguage, updateLanguage};