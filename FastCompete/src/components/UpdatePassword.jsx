import React, { useState } from 'react'
import { Image,Modal, StyleSheet, TouchableOpacity, View, Text, TextInput } from 'react-native'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { faLock,faExclamationCircle} from '@fortawesome/free-solid-svg-icons';
import LottieView from "lottie-react-native";
import axios from 'axios';
import API_BASE_URL from '../Api';

const UpdatePassword = ({navigation,route}) => {
    const {email} = route.params;
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [visible, setVisible] = useState(false);

    const areFieldsEmpty = () => newPassword.trim() === '' || confirmPassword.trim() === '';
    const isPasswordLengthValid = () => newPassword.length >= 3 && confirmPassword.length >= 3;
    const doPasswordsMatch = () => newPassword === confirmPassword;

    const validateForm = () => {
        if (areFieldsEmpty()) {
            setErrorMessage('Fields cannot be empty.');
            return false;
        }
        if (!isPasswordLengthValid()) {
            setErrorMessage('Passwords must be at least 3 characters long.');
            return false;
        }
        if (!doPasswordsMatch()) {
            setErrorMessage('Passwords do not match.');
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const updatePassword = () => {
        if(!validateForm()){
            return;
        }

        setVisible(true);

        
        setTimeout(() => {
            const newCredentials = {
                password : newPassword ,
                confirmPassword,
                email
            };

            axios.post(`${API_BASE_URL}/api/changePassword`, newCredentials)
            .then((response) => {
                setVisible(false);
                if (response.data.success && response.data.status === 200) {
                    console.log("Password Updated Successfully:", response.data.success);
                    navigation.navigate('VerifiedScreen');
                } else {
                    setVisible(false);
                    console.log('Error:', response.data.message || 'Something went wrong.');
                    setErrorMessage(response.data.message || 'Something went wrong.');
                }
            })
            .catch((error) => {
                setVisible(false);
                if (error.response && error.response.data.errors) {
                    setErrorMessage(error.response.data.errors)
                    console.log("Error:",error.response.data.errors );
                } else {
                    setVisible(false);
                    setErrorMessage(error.message)
                    console.error("Unexpected Error:", error.message);
                }
            });
        }, 4000);
    };


    return(
        <View style={styles.container}>
             <View style={{alignSelf:'center'}}>
                <Image source={{uri:'https://img.freepik.com/free-photo/3d-red-green-padlock-with-tick-cross-sign_107791-16636.jpg?ga=GA1.1.1031720790.1731643223&semt=ais_incoming'}} style={styles.img}></Image>
            </View>

            <View style={{marginTop:30}}>
                <Text style={{fontSize:20,textAlign:'center'}}>Set your new password</Text>
            </View>

            <View style={[styles.inputContainer,{marginTop:40}]}>
                <FontAwesomeIcon icon={faLock} size={20} style={styles.icon} />
                <TextInput name="newPassword" placeholder="New Password" placeholderTextColor="black" secureTextEntry style={styles.input} value={newPassword} onChangeText={(newPassword) => setNewPassword(newPassword) } />
            </View>

            <View style={[styles.inputContainer,{marginTop:15}]}>
                <FontAwesomeIcon icon={faLock} size={20} style={styles.icon} />
                <TextInput name="password" placeholder="Confirm Password" placeholderTextColor="black" secureTextEntry style={styles.input} value={confirmPassword} onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)} />
            </View>

            <View style={{marginVertical:30}}>
                <TouchableOpacity style={styles.updateBtn} onPress={updatePassword}>
                    <Text style={styles.updateText}>UPDATE</Text>
                </TouchableOpacity>
            </View>

            {errorMessage && (
                <View style={{ alignItems: "center",}}>
                    <View style={[styles.toast, { backgroundColor: "#fee2e2" }]}>
                        <FontAwesomeIcon icon={faExclamationCircle} size={24} color="#dc2626" style={{ marginRight: 10 }} />
                        <Text style={{ fontSize: 17, color: "#b91c1c", fontWeight: "bold" }}>
                            {errorMessage}
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

    inputContainer: {
        backgroundColor:'#f1f5f8',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f8',
        paddingHorizontal: 20,
        paddingVertical:5,
        marginHorizontal:30,
        elevation:1,
      },
    
    icon: {
        marginRight: 10,
        color:'#88939c'
    },

    input: {
        flex: 1, 
        paddingVertical: 5,
        fontSize:18
    },

    updateBtn:{
        backgroundColor:'#2fb900',
        paddingHorizontal:20,
        paddingVertical:7,
        marginHorizontal:30,
        elevation:1
    },

    updateText:{
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

export default UpdatePassword;