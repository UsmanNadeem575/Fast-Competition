import React from 'react'
import { Image, StyleSheet, View,Text, TouchableOpacity } from 'react-native'

const VerifiedScreen = ({navigation}) => {
    const login = () => {
        navigation.navigate('Login');
    }

    return(
        <View style={styles.container}>
            <View style={{alignSelf:'center'}}>
                <Image source={{uri:'https://img.freepik.com/free-photo/bank-card-mobile-phone-online-payment_107791-16646.jpg?ga=GA1.1.1031720790.1731643223&semt=ais_incoming'}} style={styles.img}></Image>
            </View>

            <View>
                <Text style={styles.successMsg}>Your Password has been updated!</Text>
            </View>

            <View style={{alignSelf:'center',marginVertical:20}}>
                <TouchableOpacity style={styles.loginBtn} onPress={login}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        height:'100%',
        backgroundColor:'#ffffff',
    },

    img:{
        marginVertical:50,
        height:300,
        width:350
    },

    successMsg:{
        fontSize:24,
        fontWeight:'bold',
        marginHorizontal:20,
        textAlign:'center',
        marginVertical:10
    },

    loginBtn:{
        backgroundColor:'#4A00E0',
        paddingVertical:10,
        padding: 8,
        borderRadius: 10,
        width:300,
        elevation:2
    },

    loginText:{
        textAlign:'center',
        fontSize:20,
        letterSpacing:1,
        fontWeight:'500',
        color:'white'
    }
})


export default VerifiedScreen;