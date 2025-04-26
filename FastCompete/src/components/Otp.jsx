import React, { useEffect, useState } from 'react';
import {Image,Modal, Keyboard, StyleSheet, Text, TouchableOpacity, View, TextInput} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../Api';

const Otp = ({route,navigation}) => {
  const {formData} = route.params;
  const [otp, setOtp] = useState('');
  const [isValidOtp, setIsValidOtp] = useState(false);

  const [otpSeconds, setOtpSeconds] = useState(60);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (otpSeconds === 0) {
      setIsButtonVisible(true);
      return; 
    }

    const timer = setInterval(() => {
      setOtpSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [otpSeconds]);

  const handleSendAgain = () => {
    setVisible(true);

    setTimeout(() => {
      axios.post(`${API_BASE_URL}/api/resendOtp`,cacheData)
      .then((response) => {
        if(response.data.success){
          setVisible(false);
          setOtpSeconds(60);
          setIsButtonVisible(false);
          console.log(response.data.message);
        }else if(response.data.errors){
          setVisible(false);
          console.log(response.data.message);
        }
      }).catch((error) => {
        setVisible(false);
        console.error('Error:', error);
      })
    }, 4000);
  }

  const cacheData = {
    username : formData.username,
    email : formData.email,
    password : formData.password,
    otp : otp
  }


  const data = { otp: otp, email: formData.email };

  const verifyOTP = () => {
    setVisible(true);

    setTimeout(() => {
      axios.post(`${API_BASE_URL}/api/verifyOtp`,data)
      .then(response => {
        if(response.data.status === 200){
          setVisible(false);
          console.log(response.data.message);
          navigation.navigate('Login');
        }
        else{
          setVisible(false);
          setIsValidOtp(true);
          setErrorMsg(response.data.message);
          setTimeout(() => {
            setIsValidOtp(false);
          }, 4000);
        }
      }).catch(error => {
        if (error.response && error.response.data && error.response.data.message) {
          setVisible(false);
          setIsValidOtp(true);
          setErrorMsg(error.response.data.message);
          setTimeout(() => {
            setIsValidOtp(false);
          }, 4000);
        } else {
          setVisible(false);
          setIsValidOtp(true);
          setErrorMsg('An unexpected error occurred. Please try again.');
          setTimeout(() => {
            setIsValidOtp(false);
          }, 4000);
        }
      });
    }, 4000);
  };
  
  return (
    <View style={{backgroundColor: 'rgb(255 255 255)', height: '100%'}}>
      <View style={styles.imgContainer}>
        <Image source={{ uri: 'https://img.freepik.com/free-photo/3d-illustration-hand-cursor-green-password-bar_107791-16566.jpg?ga=GA1.1.1031720790.1731643223&semt=ais_hybrid'}} style={styles.appLogo}/> 
      </View>

      <View>
        <Text style={{fontSize: 30, fontWeight: '400', marginHorizontal: 30}}>Enter Your</Text>
        <Text style={{fontSize: 30, fontWeight: '500', marginHorizontal: 30, color: 'red'}}>Verification Code</Text>
      </View>

      <View style={{marginTop: 40, marginHorizontal: '30'}}>
        <TextInput value={otp} onChangeText={(value) => setOtp(value)} placeholder='Enter OTP' style={styles.otpInput} />
        {/* <OtpInput numberOfDigits={4} maxLenght={4}  focusColor="black" type="numeric" value={otp} onChangeText={(value) => setOtp(value)}/> */}
      </View>

      <View style={{marginVertical:20}}>
        <View style={{marginHorizontal:30}}>
          <Text style={{fontSize:18}}>We send verification code to your  email 
            <Text style={{color:'blue'}}> ksam2473@gmail.com</Text>. 
            You can check your inbox.</Text>
        </View>

        <View style={{marginHorizontal:30}}>
         <View style={{flexDirection:'row',alignItems:'center'}}>
          
         {isButtonVisible ? (
              <TouchableOpacity 
                onPress={handleSendAgain} 
                style={styles.sendAgainBtn}
              >
                <Text style={styles.sendAgainText}>Send Again</Text>
              </TouchableOpacity>
            ) : (
              <View>
                <Text style={{marginTop:15,fontSize: 18, fontWeight: '500'}}>
                  Wait for send again OTP: {otpSeconds}
                </Text>
              </View>
            )}

         </View>
        </View>
      </View>

      <View style={{marginVertical:10}}>
        <TouchableOpacity style={styles.verifyBtn} onPress={verifyOTP} >
          <Text style={styles.verifyText}>Verify</Text>
        </TouchableOpacity>
      </View>


      {isValidOtp && (
            <View style={{ alignItems: "center"}}>
              <View style={[styles.toast, { backgroundColor: "#fee2e2" }]}>
                <FontAwesomeIcon icon={faExclamationCircle} size={24} color="#dc2626" style={{ marginRight: 10 }} />
                  <Text style={{ fontSize: 17, color: "#b91c1c", fontWeight: "bold" }}>
                      {errorMsg}
                  </Text>
              </View>
            </View>
          )}

</View>


  );
};

const styles = StyleSheet.create({
  imgContainer: {
    alignItems: 'center',
  },

  appLogo: {
    height: 280,
    width: 300,
  },

  verifyBtn:{
    backgroundColor:'#7f3dff',
    marginHorizontal:30,
    padding:10,
    borderRadius:10
  },

  verifyText:{
    fontSize:20,
    color:'white',
    textAlign:'center',
    fontWeight:'500'
  },

  otpText:{
    fontSize:18,
    marginVertical:20,
    fontWeight:'500'
  },

  sendAgainBtn:{
    backgroundColor:'#363e4e',
    padding:10,
    width:120,
    marginTop:15,
    borderRadius:10,
  },

  sendAgainText:{
    fontSize:18,
    color:'white',
    textAlign:'center'
  },

  otpInput:{
    borderWidth:1,
    borderRadius:10,
    borderColor:'#d4d7f2',
    paddingLeft:10,
  },

  toast:{
    backgroundColor: "#dcfce7", 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 10, 
    borderRadius: 10, 
    width: "85%", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 2,
    marginTop:10,
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
});

export default Otp;
