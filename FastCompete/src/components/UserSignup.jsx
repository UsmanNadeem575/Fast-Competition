import React, {useEffect, useState} from 'react';
import { StyleSheet,Modal, View, Text, TextInput, TouchableOpacity, Image, } from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash, faExclamationCircle} from '@fortawesome/free-solid-svg-icons';
import LottieView from "lottie-react-native";
import axios from 'axios';
import API_BASE_URL from '../Api';

const UserSignup = ({navigation}) => {
  const [name, setName] = useState('usman');
  const [isNameFocused, setIsNameFocused] = useState(false);

  const [email, setEmail] = useState('ksam2473@gmail.com');
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const [password, setPassword] = useState('usman');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [isFormValid, setIsFormValid] = useState(false);

  const isNameEmpty = name.trim() === '';
  const validateName = name.length >= 3;

  const isEmailEmpty = email.trim() === '';
  const validateEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isPasswordEmpty = password.trim() === '';
  const validatePassword = password.length >= 3;

  const [isAccountExist,setIsAccountExist] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const isNameEmpty = name.trim() === '';
    const validateName = name.length >= 3;

    const isEmailEmpty = email.trim() === '';
    const validateEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isPasswordEmpty = password.trim() === '';
    const validatePassword = password.length >= 3;

    setIsFormValid(!isEmailEmpty && validateEmail && !isPasswordEmpty && validatePassword && !isNameEmpty && validateName);
  }, [name, email, password]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const formData = {
    username: name,
    email,
    password,
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setIsNameFocused(false);
    setIsEmailFocused(false);
    setIsPasswordFocused(false);
  };
  
  const submitForm = () => {
    if (isNameEmpty || !validateName) {
      setIsNameFocused(true);
    }
    if (isEmailEmpty || !validateEmail) {
      setIsEmailFocused(true);
    }
    if (isPasswordEmpty || !validatePassword) {
      setIsPasswordFocused(true);
    }

    setVisible(true);

    setTimeout(() => {
      if (!isNameEmpty && validateName && !isEmailEmpty && validateEmail && !isPasswordEmpty && validatePassword ) {
        axios.post(`${API_BASE_URL}/api/signup`,formData)
          .then(response => {
              setVisible(false);
              if (response.data.success) {
                navigation.navigate('Otp', { formData });
                resetForm();
              } else {
                resetForm();
                setVisible(false);
                setIsAccountExist(true);
                setErrorMsg(response.data.message)
                console.log(response.data.message);
              }
          })
          .catch(error => {
            resetForm();
            setVisible(false);
            if (error.response && error.response.status === 403) {
              setIsAccountExist(true);
              setErrorMsg(error.response.data.message);
              setTimeout(() => {
                setIsAccountExist(false);
              }, 5000);
              console.log(error.response.data.message); 
            } else {
              resetForm();
              setVisible(false);
              console.error(error.response ? error.response.data.errors : error.message);
            }
          });
      } 
    }, 4000);
    
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Hello! Register to get </Text>
        <Text style={styles.subheading}>started</Text>
      </View>

      <View style={styles.formContainer}>
        <View
          style={[
            styles.inputContainer,
            {
              borderLeftColor: !isNameFocused
                ? '#e4e4f6'
                : validateName
                ? 'green'
                : 'red',
              borderTopColor: validateName ? '#e4e4f6' : '#e4e4f6',
              borderBottomColor: validateName ? '#e4e4f6' : '#e4e4f6',
              borderRightColor: validateName ? '#e4e4f6' : '#e4e4f6',
            },
          ]}>
          <FontAwesomeIcon
            icon={faUser}
            size={20}
            style={[
              styles.icon,
              {color: !isNameFocused ? '#888' : validateName ? 'green' : 'red'},
            ]}
          />
          <TextInput
            name="username"
            placeholder="Name"
            placeholderTextColor="black"
            style={styles.input}
            value={name}
            onFocus={() => setIsNameFocused(true)}
            onChangeText={username => setName(username)}
          />
        </View>
        <View style={{height: 45}}>
          {isNameFocused && (
            <>
              {isNameEmpty && (
                <Text style={styles.invalidText}>Field is required</Text>
              )}
              {!isNameEmpty && !validateName && (
                <Text style={styles.invalidText}>
                  Name must be 5 alphabetic characters
                </Text>
              )}
            </>
          )}
        </View>

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
                <Text style={styles.invalidText}>Field is required</Text>
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
            placeholder="Password"
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
                <Text style={styles.invalidText}>Field is required</Text>
              )}
              {!isPasswordEmpty && !validatePassword && (
                <Text style={styles.invalidText}>
                  Password must be at least 3 characters
                </Text>
              )}
            </>
          )}
        </View>

        <View>
            {/* <LinearGradient
            colors={['#4e54c8', '#8f94fb']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <TouchableOpacity style={styles.submitBtn} onPress={submitForm}>
              <Text style={styles.btnText}>Sign Up</Text>
            </TouchableOpacity>
          </LinearGradient> */}

          <TouchableOpacity disabled={!isFormValid} style={styles.submitBtn} onPress={submitForm}>
            <Text style={styles.btnText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.social_mediaContainer}>
          <View style={{padding: 10}}>
            <Image
              style={{height: 37, width: 37}}
              source={{
                uri: 'https://cdn-icons-png.freepik.com/256/15465/15465679.png?ga=GA1.1.1031720790.1731643223&semt=ais_hybrid',
              }}></Image>
          </View>
          <View style={{padding: 10}}>
            <Image
              style={{height: 40, width: 40}}
              source={{
                uri: 'https://cdn-icons-png.freepik.com/256/5968/5968764.png?ga=GA1.1.1031720790.1731643223&semt=ais_hybrid',
              }}></Image>
          </View>
          <View style={{padding: 10}}>
            <Image
              style={{height: 40, width: 40}}
              source={{
                uri: 'https://cdn-icons-png.freepik.com/256/5969/5969020.png?ga=GA1.1.1031720790.1731643223&semt=ais_hybrid',
              }}></Image>
          </View>
        </View> */}

         <View style={{marginTop:50}}>
            <TouchableOpacity style={styles.googleBtn}>
                <Image source={{uri:'https://cdn-icons-png.freepik.com/256/2504/2504739.png?ga=GA1.1.1031720790.1731643223&semt=ais_hybrid'}} style={{ width: 30, height: 30, marginRight: 10}}></Image>
                <Text style={[styles.btnText,{color:'black'}]}>Sign Up with Google</Text>
            </TouchableOpacity>
          </View>

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text
            style={{
              fontSize: 20,
              marginTop: 20,
              color: '#777784',
              fontWeight: '500',
            }}>
            Already have an account ?{' '}
          </Text>
          <TouchableOpacity onPress={goToLogin}>
            <Text
              style={{
                color: '#4A00E0',
                fontSize: 20,
                marginTop: 20,
                fontWeight: '500',
              }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    <View>
       

    {isAccountExist && (
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
   
    
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.loaderContainer}>
        <LottieView
          source={require('../assets/loader.json')}
          autoPlay
          loop
          style={styles.loader}
        />
      </View>
    </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    height: '100%',
  },

  headingContainer: {
    marginTop: '30',
  },

  // gradientButton: {
  //   borderRadius: 5, 
  //   overflow: 'hidden',
  // },
  
  heading: {
    fontSize: 30,
    fontWeight: '500',
    textAlign: 'center',
  },

  subheading: {
    fontSize: 30,
    fontWeight: '500',
    marginHorizontal: 55,
    textAlign: 'center',
  },

  formContainer: {
    padding: 20,
    marginVertical: 20,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    borderWidth: 1,
    padding: 3,
    borderLeftWidth: 5,
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
  },

  dividerLine: {
    backgroundColor: '#b7bcc2',
    height: 1,
    flex: 1,
  },

  googleBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e4e4f6',
    padding: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },

  social_mediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
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

export default UserSignup;
