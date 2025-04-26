import React, { useState } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, Text, TextInput } from 'react-native'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faExclamationCircle} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import API_BASE_URL from '../Api';

const ForgetPassword = ({navigation}) => {
    const [email,setEmail] = useState('');
    const [error,setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const isEmailEmpty = email.trim() === '';
    const validateEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validation = () => {
        if(isEmailEmpty || !validateEmail){
            setErrorMsg('Please enter a valid email address.');
            return false;
        }
        setErrorMsg(false);
        return true;
    }


    const submitEmail = () => {
        if(validation()){
        axios.post(`${API_BASE_URL}/api/validateUser`,{email: email}).then((response) => {
            console.log("Success:", response.data.success);
            navigation.navigate('PasswordOtp', { email: email });
        }).catch((error) => {
            if (error.response && error.response.data.errors) {
                setIsError(true);
                setErrorMsg(error.response.data.errors);
                setTimeout(() => {
                    setIsError(false);
                }, 3000);
            } else {
                setIsError(true);
                setErrorMsg('Unexpected Error | Try Again');
                setTimeout(() => {
                    setIsError(false);
                }, 3000);
            }
        });
    }
    }

    return(
        <View style={styles.container}>
            <View style={{alignSelf:'center'}}>
                <Image source={{uri:'https://img.freepik.com/premium-vector/isometric-flat-3d-illustration-concept-forgot-password-lock_18660-4285.jpg?ga=GA1.1.1031720790.1731643223&semt=ais_incoming'}} style={styles.img}></Image>
            </View>

            <View>
                <Text style={{fontSize:20,textAlign:'center',marginHorizontal:20}}>
                    Provide your account email for which you want to reset your password.
                </Text>
            </View>

            <View style={styles.inputContainer}>
                <FontAwesomeIcon icon={faEnvelope} size={20} style={styles.icon} />
                <TextInput name="email" placeholder="Email" placeholderTextColor="black" style={styles.emailField} value={email} onChangeText={(value) => setEmail(value)}/>
            </View>

            <View style={{marginVertical:30}}>
                <TouchableOpacity style={styles.nextBtn} onPress={submitEmail}>
                    <Text style={styles.nextText}>NEXT</Text>
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
        height:300,
        width:350
    },

    emailField:{
        borderWidth:1
    },
    
    inputContainer: {
        backgroundColor:'#f1f5f8',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f8',
        paddingHorizontal: 20,
        paddingVertical:5,
        marginHorizontal:30,
        marginTop:40,
        elevation:1,
        borderRadius: 12,
        
    },
      
    icon: {
        marginRight: 10,
        color:'#88939c'
    },

    emailField: {
        flex: 1,  
        paddingVertical: 5,
        fontSize:18
    },

    nextBtn:{
        backgroundColor:'#4A00E0',
        borderRadius: 12,
        paddingHorizontal:20,
        paddingVertical:7,
        marginHorizontal:30,
        elevation:1
    },

    nextText:{
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
});

export default ForgetPassword;