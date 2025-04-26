import React, {useEffect, useState} from 'react';
import { StyleSheet,Modal, View, Text, TextInput, TouchableOpacity, Image, } from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faExclamationCircle, } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import LottieView from "lottie-react-native";
import API_BASE_URL from '../Api';

const UserLogin = ({navigation}) => {
  // email state
  const [email, setEmail] = useState('ksam2473@gmail.com');
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  // password states
  const [password, setPassword] = useState('usman');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // submit form state
  const [isFormValid, setIsFormValid] = useState(false);
  const [isValidUser, setIsValidUser] = useState(false);

  // validations
  const isEmailEmpty = email.trim() === '';
  const validateEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isPasswordEmpty = password.trim() === '';
  const validatePassword = password.length >= 3;

  const [errorMsg, setErrorMsg] = useState('');

  // validation => Only runs when name, email, or password change
  useEffect(() => {
    const isEmailEmpty = email.trim() === '';
    const validateEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isPasswordEmpty = password.trim() === '';
    const validatePassword = password.length >= 3;

    setIsFormValid(!isEmailEmpty && validateEmail && !isPasswordEmpty && validatePassword);
  }, [email, password]);

  // toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // make object for axios
  const formData = {
    email,
    password,
  };

  // reset form after submit
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setIsEmailFocused(false);
    setIsPasswordFocused(false);
  };

  const [visible, setVisible] = useState(false);

  const submitForm = () => {

    if (isEmailEmpty || !validateEmail) {
      setIsEmailFocused(true);
    }
    if (isPasswordEmpty || !validatePassword) {
      setIsPasswordFocused(true);
    }

    setVisible(true);

    setTimeout(() => {
      if (!isEmailEmpty && validateEmail && !isPasswordEmpty && validatePassword) {
        axios
          .post(`${API_BASE_URL}/api/login`, formData)
          .then(async (response) => {
            if (response.data.success === true) {
              console.log(response.data.message);
    
              const user_id = String(response.data.user.id);
              const username = response.data.user.username;
              const useremail = response.data.user.email;
    
              const totalAmount = response.data.total_amount;
    
              await AsyncStorage.setItem('user_id', user_id);
              await AsyncStorage.setItem('username', username);
              await AsyncStorage.setItem('useremail', useremail);
    
              navigation.navigate('Dashboard', { username, useremail, totalAmount });
              resetForm();
            } else {
              setVisible(false);
              resetForm();
              setIsValidUser(true);
              setErrorMsg('These Credentials not Registered');
              setTimeout(() => {
                setIsValidUser(false);
              }, 3000);
              console.log(response.data.errors);
            }
          })
          .catch((error) => {
            setVisible(false);
            resetForm();
            setIsValidUser(true);
            setErrorMsg('These Credentials not Registered');
            setTimeout(() => {
              setIsValidUser(false);
            }, 3000);
            console.log(error.response.data.errors);
          });
      }
    }, 3000);
  }    

  const forgetPassword = () => {
    navigation.navigate('ForgetPassword');
  };

  const goToSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Welcome back!</Text>
        <Text style={styles.subheading}>Glad to see you again</Text>
      </View>

      <View style={styles.formContainer}>
        <View
          style={[
            styles.inputContainer,
            {
              borderLeftColor: !isEmailFocused
                ? '#e4e4f6'
                : validateEmail
                ? 'green'
                : 'red',
              borderTopColor: validateEmail ? '#e4e4f6' : '#e4e4f6',
              borderBottomColor: validateEmail ? '#e4e4f6' : '#e4e4f6',
              borderRightColor: validateEmail ? '#e4e4f6' : '#e4e4f6',
            },
          ]}>
          <FontAwesomeIcon
            icon={faEnvelope}
            size={20}
            style={[
              styles.icon,
              {
                color: !isEmailFocused
                  ? '#888'
                  : validateEmail
                  ? 'green'
                  : 'red',
              },
            ]}
          />
          <TextInput
            name="email"
            placeholder="Email"
            placeholderTextColor="black"
            style={styles.input}
            value={email}
            onFocus={() => setIsEmailFocused(true)}
            onChangeText={email => setEmail(email)}
          />
        </View>
        <View style={{height: 45}}>
          {isEmailFocused && (
            <>
              {isEmailEmpty && (
                <Text style={styles.invalidText}>EmailField is required</Text>
              )}
              {!isEmailEmpty && !validateEmail && (
                <Text style={styles.invalidText}>
                  Please enter a valid email address
                </Text>
              )}
            </>
          )}
        </View>

        <View
          style={[
            styles.inputContainer,
            {
              borderLeftColor: !isPasswordFocused
                ? '#e4e4f6'
                : validatePassword
                ? 'green'
                : 'red',
              borderTopColor: validatePassword ? '#e4e4f6' : '#e4e4f6',
              borderBottomColor: validatePassword ? '#e4e4f6' : '#e4e4f6',
              borderRightColor: validatePassword ? '#e4e4f6' : '#e4e4f6',
            },
          ]}>
          <FontAwesomeIcon
            icon={faLock}
            size={20}
            style={[
              styles.icon,
              {
                color: !isPasswordFocused
                  ? '#888'
                  : validatePassword
                  ? 'green'
                  : 'red',
              },
            ]}
          />
          <TextInput
            name="password"
            placeholder="password"
            placeholderTextColor="black"
            style={styles.input}
            value={password}
            onFocus={() => setIsPasswordFocused(true)}
            onChangeText={password => setPassword(password)}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <FontAwesomeIcon
              icon={isPasswordVisible ? faEyeSlash : faEye}
              size={20}
              style={{position: 'relative', left: -5, color: '#91919f'}}
            />
          </TouchableOpacity>
        </View>

        <View style={{height: 45}}>
          {isPasswordFocused && (
            <>
              {isPasswordEmpty && (
                <Text style={styles.invalidText}>Password Field is required</Text>
              )}
              {!isPasswordEmpty && !validatePassword && (
                <Text style={styles.invalidText}>Minimum Password Lenght 3 required</Text>
              )}
            </>
          )}
        </View>

        <View>
          <TouchableOpacity disabled={!isFormValid} style={styles.submitBtn} onPress={submitForm}>
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={{marginTop: '30'}}>
          <TouchableOpacity onPress={forgetPassword}>
            <Text
              style={{textAlign: 'center', fontSize: 20, fontWeight: '500'}}>
              Forget Password ?
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text
            style={{
              fontSize: 20,
              marginVertical: 30,
              color: '#777784',
              fontWeight: '500',
            }}>
            Don't have an account ?{' '}
          </Text>
          <TouchableOpacity onPress={goToSignup}>
            <Text style={{color: '#4A00E0', fontSize: 20, marginVertical: 30}}>
              Signup
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
         {isValidUser && (
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

      {/* Loader Modal */}
      {/* <Modal transparent visible={visible} animationType="fade">
        <View style={styles.loaderContainer}>
          <LottieView
            source={require("../../public/loader.json")}
            autoPlay
            loop
            style={styles.loader}
          />
        </View>
      </Modal> */}
    
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#ffffff',
    height: '100%',
  },

  headingContainer: {
    marginTop: '70',
  },

  heading: {
    fontSize: 30,
    fontWeight: '500',
    textAlign: 'center',
  },

  subheading: {
    fontSize: 30,
    fontWeight: '500',
    textAlign: 'center',
    marginHorizontal: 25,
  },

  formContainer: {
    padding: 20,
    marginVertical: 30,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    borderWidth: 1,
    padding: 3,
    borderLeftWidth: 5,
    // borderColor:'#f1f1fa'
  },

  icon: {
    marginHorizontal: 10,
    color: '#888',
  },

  input: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },

  invalidText: {
    fontSize: 18,
    color: 'red',
    marginVertical: 10,
  },

  submitBtn: {
    backgroundColor: '#4A00E0',
    padding: 8,
    borderRadius: 12,
    elevation:2
  },

  btnText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    padding: 3,
    fontWeight:'500',
  },

  toast:{
    backgroundColor: "#dcfce7", 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 15, 
    borderRadius: 12, 
    width: "90%", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 2,
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

export default UserLogin;
