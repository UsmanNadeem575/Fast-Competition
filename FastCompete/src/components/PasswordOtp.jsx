import React, { useState } from 'react'
import { Image,Modal, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import LottieView from "lottie-react-native";
import API_BASE_URL from '../Api';

const PasswordOtp = ({navigation,route}) => {
    const {email} = route.params;
    const [otp,setOtp] = useState('');
    const [error,setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [visible, setVisible] = useState(false);

    const isOtpEmpty = otp.trim() === '';

    const OtpValidation = () => {
        if (isOtpEmpty) {
            setIsError(true);
            setErrorMsg('OTP field is required');
            setTimeout(() => {
                setIsError(false);
            }, 4000);
            return false; 
        }
        return true;
    };

    const verifyOtp = () => {

        if(!OtpValidation()){
            return
        }

        setVisible(true);

        setTimeout(() => {
            axios.post(`${API_BASE_URL}/api/changePasswordOtp`,{otp:otp, email:email})
            .then(response => {
                if (response.data.success && response.data.status === 200) {
                    setVisible(false);
                    console.log("OTP Verified:", response.data.message);
                    navigation.navigate('UpdatePassword',{email:email}); 
                } else {
                    setVisible(false);
                    setIsError(true);
                    setErrorMsg(response.data.message || 'OTP not matched.');
                    setTimeout(() => {
                        setIsError(false);
                    }, 4000);
                }
            }).catch(error => {
                setVisible(false);
                if (error.response && error.response.data.message) {
                    setIsError(true);
                    setErrorMsg(error.response.data.message);
                    setTimeout(() => {
                        setIsError(false);
                    }, 4000);
                } else {
                    setVisible(false);
                    setIsError(true);
                    setErrorMsg('Unexpected error | Try again');
                    setTimeout(() => {
                        setIsError(false);
                    }, 4000);
                }
            });
        }, 4000);
    }

    return(
        <View style={styles.container}>
             <View style={{alignSelf:'center'}}>
                <Image source={{uri:'https://img.freepik.com/free-photo/hand-point-form-with-password-red-padlock_107791-16190.jpg?ga=GA1.1.1031720790.1731643223&semt=ais_incoming'}} style={styles.img}></Image>
            </View>

            <View>
                <Text style={styles.heading}>Before Forget Password</Text>
                <Text style={styles.subHeading}>Verify Your Registered Account</Text>
                {/* <Text style={styles.instruction}>Check your email for the OTP</Text> */}
            </View>

            <View style={styles.inputContainer}>
                <TextInput placeholder='Enter OTP' style={styles.otpInput} value={otp} onChangeText={(otp) => setOtp(otp)}/>
            </View>            

            <View style={{marginVertical:30}}>
                <TouchableOpacity style={styles.verifyBtn} onPress={verifyOtp}>
                    <Text style={styles.verifyText}>VERIFY</Text>
                </TouchableOpacity>
            </View>

            {error && (
                <View style={{ alignItems: "center",}}>
                    <View style={[styles.toast, { backgroundColor: "#fee2e2" }]}>
                    <FontAwesomeIcon icon={faExclamationCircle} size={24} color="#dc2626" style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 17, color: "#b91c1c", fontWeight: "bold" }}>
                    {errorMsg}
                    </Text>
                    </View>
                </View>
            )}

            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        height:'100%',
        backgroundColor:'#ffffff',
    },

    img:{
        height:250,
        width:350
    },

    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign:'center'
    },

    subHeading: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
    },

    inputContainer: {
        backgroundColor:'#f1f5f8',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f8',
        paddingHorizontal: 20,
        paddingVertical:2,
        marginHorizontal:30,
        elevation:1,
        marginTop:30,
        borderRadius:10
    },

    otpInput:{
        fontSize:18
    },

    verifyBtn:{
        backgroundColor:'#2fb900',
        paddingHorizontal:20,
        paddingVertical:7,
        marginHorizontal:30,
        elevation:2,
        borderRadius:10
    },

    verifyText:{
        textAlign:'center',
        fontSize:20,
        letterSpacing:1,
        fontWeight:'500',
        color:'white'
    },

    toast:{
        backgroundColor: "#dcfce7", 
        flexDirection: "row", 
        alignItems: "center", 
        padding: 12, 
        borderRadius: 12, 
        width: "85%", 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.2, 
        shadowRadius: 4, 
        elevation: 3 
      },

      loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)"
      },
    
      loader: {
        width: 250,
        height: 250,
      },

})

export default PasswordOtp;