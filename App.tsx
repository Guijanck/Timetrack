"use client"

// import { useState } from "react"
import React from "react"
import { View, Alert } from "react-native"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from "./src/screens/login-screen"
import AuthScreen from './src/screens/auth-screen';
import RegisterScreen from './src/screens/register-screen';
import HomeScreen from './src/screens/home-screen';
import HistoryScreen from "./src/screens/history-screen";
import CalculationScreen from "./src/screens/calculation-screen";
import ForgotPasswordScreen from "./src/screens/forgot-password-screen";
import ResetPasswordScreen from "./src/screens/reset-password-screen";

// import {LoginScreen} from "./screens/login-screen"
// import {AuthScreen} from "./screens/auth-screen"
// import {RegisterScreen} from "./screens/register-screen"

// const App = () => {
//   const handleLogin = () => {
//     Alert.alert("Login", "Login efetuado!")
//     // Aqui você pode navegar ou mudar de tela depois
//   }

//   const handleRegister = () => {
//     Alert.alert("Cadastro", "Vamos registrar!")
//     // Aqui você pode navegar para a tela de registro
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />
//     </View>
//   )
// }

// export default App



export type RootStackParamList = {
  Login: undefined;
  Auth: undefined;
  Register: undefined;
  Home: undefined;
  History: undefined;
  Calculation: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();



export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Calculation" component={CalculationScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}