import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import UserSignup from './src/components/UserSignup';
import UserLogin from './src/components/UserLogin';
import Otp from './src/components/Otp';
import Dashboard from './src/components/Dashboard';
import ForgetPassword from './src/components/ForgetPassword';
import UpdatePassword from './src/components/UpdatePassword';
import PasswordOtp from './src/components/PasswordOtp';
import VerifiedScreen from './src/components/VerifiedScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
const Stack = createStackNavigator();

const App = () => {
  const [isloggedIn,setIsLoggedIn]=useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id');
        console.log(user_id);
        if (user_id) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);
   if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isloggedIn ? 'Dashboard':"Signup"}>
        <Stack.Screen
          component={UserSignup}
          name="Signup"
          options={{headerShown: false}}
        />

        <Stack.Screen
          component={UserLogin}
          name="Login"
          options={{headerShown: false}}
        />
       
        <Stack.Screen
          component={Otp}
          name="Otp"
          options={{headerShown: false}}
        />
        <Stack.Screen component={Dashboard} name="Dashboard" options={{headerShown: false}} />
      
        <Stack.Screen
          component={ForgetPassword}
          name="ForgetPassword"
          options={{headerShown: false}}
        />
      
        <Stack.Screen
          component={PasswordOtp}
          name="PasswordOtp"
          options={{headerShown: false}}
        />

        <Stack.Screen
          component={UpdatePassword}
          name="UpdatePassword"
          options={{headerShown: false}}
        />

        <Stack.Screen
          component={VerifiedScreen}
          name="VerifiedScreen"
          options={{headerShown: false}}
        />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
