import React from 'react';
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
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signup">
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
