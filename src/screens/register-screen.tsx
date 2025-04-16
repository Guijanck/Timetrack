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
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "@react-navigation/native"
import type { RootStackParamList } from "../../App"

// interface RegisterScreenProps {
//   onBack: () => void
//   onRegister: (userData: {
//     fullName: string
//     email: string
//     employerType: string
//     cpf: string
//     companyCode: string
//     password: string
//   }) => void
// }

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [employerType, setEmployerType] = useState("CLT")
  const [cpf, setCpf] = useState("")
  const [companyCode, setCompanyCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleRegister = () => {
    // Validação básica
    if (!fullName || !email || !cpf || !password || !confirmPassword) {
      //alert("Por favor, preencha todos os campos")
      return
    }

    if (password !== confirmPassword) {
      //alert("As senhas não coincidem")
      return
    }

    // onRegister({
    //   fullName,
    //   email,
    //   employerType,
    //   cpf,
    //   companyCode,
    //   password,
    // })
  }

  // Função para formatar o CPF enquanto o usuário digita
  const formatCPF = (text: string) => {
    const cleaned = text.replace(/\D/g, "")
    let formatted = cleaned

    if (cleaned.length > 3) {
      formatted = cleaned.substring(0, 3) + "." + cleaned.substring(3)
    }
    if (cleaned.length > 6) {
      formatted = formatted.substring(0, 7) + "." + cleaned.substring(7)
    }
    if (cleaned.length > 9) {
      formatted = formatted.substring(0, 11) + "-" + cleaned.substring(11, 13)
    }

    return formatted.substring(0, 14)
  }

  const handleCPFChange = (text: string) => {
    setCpf(formatCPF(text))
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.content}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              {/* <Ionicons name="arrow-back" size={24} color="#000" /> */}
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Criar Conta</Text>
              <Text style={styles.subtitle}>No TimeTrack</Text>
              <Text style={styles.description}>Insira suas informações para se registrar</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu nome completo"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="nome@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
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

              <View style={styles.inputContainer}>
                <Text style={styles.label}>CPF</Text>
                <TextInput
                  style={styles.input}
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChangeText={handleCPFChange}
                  keyboardType="numeric"
                  maxLength={14}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Código da empresa</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 0000"
                  value={companyCode}
                  onChangeText={setCompanyCode}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.registerButton} onPress={handleRegister} activeOpacity={0.8}>
                <Text style={styles.registerButtonText} onPress={() => navigation.navigate('Login')}>Registrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    marginBottom: 20,
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
  registerButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default RegisterScreen
