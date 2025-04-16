import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from "react-native"

import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Boas Vindas ao TimeTrack</Text>
          <Text style={styles.subtitle}>Acompanhe suas horas de trabalho com eficiência</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Auth')}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>ENTRAR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => {/* Lógica para registro aqui */}}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText} onPress={() => navigation.navigate('Register')}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

interface LoginScreenProps {
  onLogin: () => void
  onRegister: () => void
}

// const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister }) => {
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
//       <View style={styles.content}>
//         <View style={styles.titleContainer}>
//           <Text style={styles.title}>Boas Vindas ao TimeTrack</Text>
//           <Text style={styles.subtitle}>Acompanhe suas horas de trabalho com eficiência</Text>
//         </View>

//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.loginButton} onPress={onLogin} activeOpacity={0.8}>
//             <Text style={styles.loginButtonText}>ENTRAR</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.registerButton} onPress={onRegister} activeOpacity={0.8}>
//             <Text style={styles.registerButtonText}>Registrar</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   )
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4CAF50",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.7)",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 12,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#000",
    fontSize: 16,
  },
})

export default LoginScreen
