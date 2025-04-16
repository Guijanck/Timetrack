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
  Alert
} from "react-native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "@react-navigation/native"
import type { RootStackParamList } from "../../App"
import Icon from "react-native-vector-icons/MaterialIcons" // Import the icon library

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
  const [errors, setErrors] = useState<Record<string, string>>({})
  // Add state for password visibility
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Check all required fields
    if (!fullName.trim()) newErrors.fullName = "Nome completo é obrigatório"
    if (!email.trim()) newErrors.email = "Email é obrigatório"
    if (!cpf.trim()) newErrors.cpf = "CPF é obrigatório"
    if (!companyCode.trim()) newErrors.companyCode = "Código da empresa é obrigatório"
    if (!password) newErrors.password = "Senha é obrigatória"
    if (!confirmPassword) newErrors.confirmPassword = "Confirmação de senha é obrigatória"
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email.trim() && !emailRegex.test(email)) {
      newErrors.email = "Formato de email inválido"
    }
    
    // Check if passwords match
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem"
    }
    
    // CPF should be complete
    if (cpf.trim() && cpf.length < 14) {
      newErrors.cpf = "CPF incompleto"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = () => {
    if (validateForm()) {
      // Show success message
      Alert.alert(
        "Sucesso",
        "Usuário registrado com sucesso!",
        [
          { 
            text: "OK", 
            onPress: () => navigation.navigate('Auth')
          }
        ]
      )
    }
  }

  // Função completamente reescrita para formatar o CPF
  const formatCPF = (text: string) => {
    // Remove todos os caracteres não numéricos
    const digits = text.replace(/\D/g, "");
    
    // Limita a 11 dígitos
    const limitedDigits = digits.slice(0, 11);
    
    // Aplica a formatação
    let formattedCPF = "";
    
    for (let i = 0; i < limitedDigits.length; i++) {
      // Adiciona o dígito
      formattedCPF += limitedDigits[i];
      
      // Adiciona o ponto após o 3º e o 6º dígito
      if (i === 2 || i === 5) {
        formattedCPF += ".";
      }
      
      // Adiciona o hífen após o 9º dígito
      if (i === 8) {
        formattedCPF += "-";
      }
    }
    
    return formattedCPF;
  }

  const handleCPFChange = (text: string) => {
    setCpf(formatCPF(text));
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.content}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#000" />
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
                  style={[styles.input, errors.fullName ? styles.inputError : null]}
                  placeholder="Digite seu nome completo"
                  value={fullName}
                  onChangeText={setFullName}
                />
                {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, errors.email ? styles.inputError : null]}
                  placeholder="nome@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
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
                  style={[styles.input, errors.cpf ? styles.inputError : null]}
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChangeText={handleCPFChange}
                  keyboardType="numeric"
                  maxLength={14}
                />
                {errors.cpf ? <Text style={styles.errorText}>{errors.cpf}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Código da empresa</Text>
                <TextInput
                  style={[styles.input, errors.companyCode ? styles.inputError : null]}
                  placeholder="Ex: 0000"
                  value={companyCode}
                  onChangeText={setCompanyCode}
                  keyboardType="numeric"
                />
                {errors.companyCode ? <Text style={styles.errorText}>{errors.companyCode}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Senha</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={[styles.passwordInput, errors.password ? styles.inputError : null]}
                    placeholder=""
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                    <Icon name={showPassword ? "visibility-off" : "visibility"} size={24} color="#666" />
                  </TouchableOpacity>
                </View>
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar Senha</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={[styles.passwordInput, errors.confirmPassword ? styles.inputError : null]}
                    placeholder=""
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Icon name={showConfirmPassword ? "visibility-off" : "visibility"} size={24} color="#666" />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
              </View>

              <TouchableOpacity 
                style={styles.registerButton} 
                onPress={handleRegister} 
                activeOpacity={0.8}
              >
                <Text style={styles.registerButtonText}>Registrar</Text>
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
  // New styles for password input with icon
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  eyeIcon: {
    padding: 10,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
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

// Test the component
console.log("RegisterScreen loaded with password visibility toggle");