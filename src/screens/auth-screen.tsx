"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "@react-navigation/native"
import type { RootStackParamList } from "../../App"

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

// Mock user credentials
const MOCK_USER = {
  email: "admin@timetrack.com",
  password: "admin123"
};

const AuthScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [employerType, setEmployerType] = useState("CLT")
  const [error, setError] = useState("")

  const handleLogin = () => {
    // Reset any previous error
    setError("");
    
    // Check if the credentials match the mock user
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      // Successful login
      navigation.navigate('Home');
    } else {
      // Failed login
      setError("Email ou senha inválidos. Tente novamente.");
      
      // You can also use Alert instead of the error state
      Alert.alert(
        "Erro de Autenticação",
        "Email ou senha inválidos. Tente novamente.",
        [{ text: "OK" }]
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <View style={styles.content}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            {/* <Ionicons name="arrow-back" size={24} color="#000" /> */}
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>TimeTrack</Text>
            <Text style={styles.description}>Entre com suas credenciais para acessar sua conta</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="timetrack@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.employerTypeContainer}>
              <Text style={styles.label}>Tipo de Empregador</Text>
              <View style={styles.radioContainer}>
                <TouchableWithoutFeedback onPress={() => setEmployerType("CLT")}>
                  <View style={styles.radioOption}>
                    <View style={styles.radioButton}>
                      {employerType === "CLT" && <View style={styles.radioButtonSelected} />}
                    </View>
                    <Text style={styles.radioLabel}>CLT</Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => setEmployerType("PJ")}>
                  <View style={styles.radioOption}>
                    <View style={styles.radioButton}>
                      {employerType === "PJ" && <View style={styles.radioButtonSelected} />}
                    </View>
                    <Text style={styles.radioLabel}>PJ</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>

            {/* Error message */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity 
              style={styles.loginButton} 
              activeOpacity={0.8}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>ENTRAR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText} onPress={() => navigation.navigate('ForgotPassword')}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4CAF50",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center", // Centraliza verticalmente
    alignItems: "center", // Centraliza horizontalmente
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.7)",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#000",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  employerTypeContainer: {
    marginBottom: 24,
  },
  radioContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
  },
  radioLabel: {
    fontSize: 16,
    color: "#000",
  },
  loginButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPasswordContainer: {
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#000",
    fontSize: 14,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  }
})

export default AuthScreen

// To test this component:
// 1. Valid credentials: admin@timetrack.com / admin123
// 2. Any other combination will show an error
console.log("Mock user credentials for testing:", MOCK_USER);