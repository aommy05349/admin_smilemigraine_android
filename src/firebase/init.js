
import firebase from 'firebase/app'

let config = {
    /** IOS */
    apiKey: "AIzaSyCEsjLdKPKkpisEjnblz-3W-z0whxKZQ0A",
    authDomain: "sm-com.firebaseapp.com",
    databaseURL: "https://sm-com.firebaseio.com",
    projectId: "sm-com",
    storageBucket: "sm-com.appspot.com",
    messagingSenderId: "758089782853",
    appId: "1:758089782853:web:b08f6d7a38f83b8a9cb52c",
    measurementId: "G-ZFBCMSYVDE"

    /** ANDROID */
    // apiKey: "AIzaSyAsaoOCtt-Wcrew748gFcJKoqSOTOECkZ8",
    // authDomain: "smilemigraine-948cf.firebaseapp.com",
    // databaseURL: "https://smilemigraine-948cf.firebaseio.com",
    // projectId: "smilemigraine-948cf",
    // storageBucket: "smilemigraine-948cf.appspot.com",
    // messagingSenderId: "940137332350",
    // appId: "1:940137332350:web:2cd17d5a9b5ac04815222f"
    
    /** old */
    // apiKey: "AIzaSyA_Y6_Nbq0C13Eov0wEPCFIZYLNm54tsgw",
    // authDomain: "smile-migraine-chat.firebaseapp.com",
    // databaseURL: "https://smile-migraine-chat.firebaseio.com",
    // projectId: "smile-migraine-chat",
    // storageBucket: "smile-migraine-chat.appspot.com",
    // messagingSenderId: "159060972592",
    // appId: "1:159060972592:web:bbccc13c171c4edb"
}
firebase.initializeApp(config)