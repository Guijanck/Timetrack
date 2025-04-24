"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  Switch,
  Dimensions,
  TextInput,
  ScrollView,
  Platform,
} from "react-native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCoffee, faUser } from "@fortawesome/free-solid-svg-icons";
import { faBars, faCaretDown, faClock, faCalendarAlt, faCalculator, faHome } from "@fortawesome/free-solid-svg-icons";
// Tipos de registro
enum RegisterType {
  NONE = "NONE",
  ENTRY = "ENTRY",
  LUNCH_OUT = "LUNCH_OUT",
  LUNCH_RETURN = "LUNCH_RETURN",
  EXIT = "EXIT",
}

// Dados do usuário (simulados)
const userData = {
  name: "Admin",
  email: "admin@timetrack.com",
  isPJ: true,
}

const HomeScreen = ({ navigation }: any) => {
  // Estado para a hora atual
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  // Estado para o próximo tipo de registro
  const [nextRegisterType, setNextRegisterType] = useState<RegisterType>(RegisterType.ENTRY)

  // Estado para os horários registrados
  const [entryTime, setEntryTime] = useState<string | null>(null)
  const [lunchOutTime, setLunchOutTime] = useState<string | null>(null)
  const [lunchReturnTime, setLunchReturnTime] = useState<string | null>(null)
  const [exitTime, setExitTime] = useState<string | null>(null)

  // Estado para controlar a visibilidade do menu lateral
  const [menuVisible, setMenuVisible] = useState(false)

  // Estado para controlar a visibilidade do modal de registro manual
  const [manualRegisterVisible, setManualRegisterVisible] = useState(false)

  // Estado para o tipo de contrato (PJ ou CLT)
  const [isPJ, setIsPJ] = useState(userData.isPJ)

  // Estados para o registro manual
  const [manualDate, setManualDate] = useState("")
  const [manualEntry, setManualEntry] = useState("")
  const [manualLunchOut, setManualLunchOut] = useState("")
  const [manualLunchReturn, setManualLunchReturn] = useState("")
  const [manualExit, setManualExit] = useState("")
  const [manualObservation, setManualObservation] = useState("")

  // Atualiza a hora a cada segundo
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()

      // Formata a hora como HH:MM:SS
      const hours = String(now.getHours()).padStart(2, "0")
      const minutes = String(now.getMinutes()).padStart(2, "0")
      const seconds = String(now.getSeconds()).padStart(2, "0")
      setCurrentTime(`${hours}:${minutes}:${seconds}`)

      // Formata a data como "dia da semana, DD de mês de YYYY"
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
      setCurrentDate(now.toLocaleDateString("pt-BR", options))

      // Inicializa a data para o registro manual
      if (!manualDate) {
        const day = String(now.getDate()).padStart(2, "0")
        const month = String(now.getMonth() + 1).padStart(2, "0")
        const year = now.getFullYear()
        setManualDate(`${day}/${month}/${year}`)
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [manualDate])

  // Função para registrar um horário
  const registerTime = () => {
    const now = new Date()
    // Certifique-se de usar a hora atual do dispositivo
    const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

    switch (nextRegisterType) {
      case RegisterType.ENTRY:
        setEntryTime(timeString)
        setNextRegisterType(RegisterType.LUNCH_OUT)
        break
      case RegisterType.LUNCH_OUT:
        setLunchOutTime(timeString)
        setNextRegisterType(RegisterType.LUNCH_RETURN)
        break
      case RegisterType.LUNCH_RETURN:
        setLunchReturnTime(timeString)
        setNextRegisterType(RegisterType.EXIT)
        break
      case RegisterType.EXIT:
        setExitTime(timeString)
        setNextRegisterType(RegisterType.NONE)
        break
      default:
        break
    }
  }

  // Função para obter o texto do status
  const getStatusText = () => {
    if (!entryTime) {
      return "Status: Expediente não iniciado"
    } else if (entryTime && !lunchOutTime) {
      return "Status: Expediente iniciado"
    } else if (lunchOutTime && !lunchReturnTime) {
      return "Status: Em intervalo de almoço"
    } else if (lunchReturnTime && !exitTime) {
      return "Status: Expediente em andamento"
    } else {
      return "Status: Expediente finalizado"
    }
  }

  // Função para obter o texto do botão
  const getButtonText = () => {
    switch (nextRegisterType) {
      case RegisterType.ENTRY:
        return "Registrar Entrada"
      case RegisterType.LUNCH_OUT:
        return "Registrar Saída para Almoço"
      case RegisterType.LUNCH_RETURN:
        return "Registrar Retorno do Almoço"
      case RegisterType.EXIT:
        return "Registrar Saída"
      case RegisterType.NONE:
        return "Expediente Finalizado"
      default:
        return "Registrar"
    }
  }

  // Função para obter a cor do botão
  const getButtonColor = () => {
    switch (nextRegisterType) {
      case RegisterType.ENTRY:
        return "#4CAF50" // Verde
      case RegisterType.LUNCH_OUT:
        return "#FF9800" // Laranja
      case RegisterType.LUNCH_RETURN:
        return "#2196F3" // Azul
      case RegisterType.EXIT:
        return "#F44336" // Vermelho
      case RegisterType.NONE:
        return "#9E9E9E" // Cinza
      default:
        return "#4CAF50"
    }
  }

  // Função para lidar com o logout
  //   const handleLogout = () => {
  //     // Aqui você implementaria a lógica de logout
  //     alert("Logout realizado com sucesso!")
  //     setMenuVisible(false)
  //   }

  //   // Função para editar perfil
  //   const handleEditProfile = () => {
  //     // Aqui você implementaria a navegação para a tela de edição de perfil
  //     alert("Navegar para a tela de edição de perfil")
  //     setMenuVisible(false)
  //   }

  // Função para abrir o modal de registro manual
  const openManualRegister = () => {
    setManualRegisterVisible(true)
  }

  // Função para salvar o registro manual
  const saveManualRegister = () => {
    // Aqui você implementaria a lógica para salvar o registro manual
    // alert(
    //   `Registro manual salvo!\nData: ${manualDate}\nEntrada: ${manualEntry}\nSaída Almoço: ${manualLunchOut}\nRetorno Almoço: ${manualLunchReturn}\nSaída: ${manualExit}\nObservação: ${manualObservation}`,
    // )

    // Atualiza os registros na tela principal
    if (manualEntry) setEntryTime(manualEntry)
    if (manualLunchOut) setLunchOutTime(manualLunchOut)
    if (manualLunchReturn) setLunchReturnTime(manualLunchReturn)
    if (manualExit) {
      setExitTime(manualExit)
      setNextRegisterType(RegisterType.NONE)
    } else if (manualLunchReturn) {
      setNextRegisterType(RegisterType.EXIT)
    } else if (manualLunchOut) {
      setNextRegisterType(RegisterType.LUNCH_RETURN)
    } else if (manualEntry) {
      setNextRegisterType(RegisterType.LUNCH_OUT)
    }

    // Fecha o modal
    setManualRegisterVisible(false)
  }

  // Função para navegar para a tela de histórico
  const navigateToHistory = () => {
    navigation.navigate("History")
  }

  // Função para navegar para a tela de cálculo
  const navigateToCalculation = () => {
    navigation.navigate("Calculation", { isPJ })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>TimeTrack</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      {/* Menu Lateral */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Menu Lateral (à esquerda) */}
          <View style={styles.sideMenu}>
            {/* Cabeçalho do Menu */}
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Meu Perfil</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Conteúdo do Menu */}
            <View style={styles.menuContent}>
              <View style={styles.profileSection}>
                <Text style={styles.profileLabel}>Nome</Text>
                <Text style={styles.profileValue}>{userData.name}</Text>

                <Text style={[styles.profileLabel, styles.marginTop]}>Email</Text>
                <Text style={styles.profileValue}>{userData.email}</Text>

                <Text style={[styles.profileLabel, styles.marginTop]}>Tipo de Contrato</Text>
                <View style={styles.contractTypeContainer}>
                  <Text style={[styles.contractTypeText, !isPJ && styles.activeContractType]}>CLT</Text>
                  <Switch
                    value={isPJ}
                    onValueChange={setIsPJ}
                    trackColor={{ false: "#767577", true: "#2196F3" }}
                    thumbColor="#f4f3f4"
                  />
                  <Text style={[styles.contractTypeText, isPJ && styles.activeContractType]}>PJ</Text>
                </View>
              </View>

              {/* Botões de Ação */}
              <View style={styles.menuActions}>
                <TouchableOpacity style={styles.actionButton} >
                  <FontAwesomeIcon icon={faUser} size={24} color="#333" />
                  <Text style={styles.actionButtonText}>Editar Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.logoutButton]}>
                  <Text style={styles.logoutButtonText} onPress={() => navigation.navigate('Auth')}>Sair</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Área escura para fechar o menu (à direita) */}
          <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
        </View>
      </Modal>

      {/* Modal de Registro Manual */}
      <Modal
        visible={manualRegisterVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setManualRegisterVisible(false)}
      >
        <View style={styles.manualRegisterModalContainer}>
          <View style={styles.manualRegisterModal}>
            <View style={styles.manualRegisterHeader}>
              <Text style={styles.manualRegisterTitle}>Registro Manual de Ponto</Text>
              <TouchableOpacity
                style={styles.manualRegisterCloseButton}
                onPress={() => setManualRegisterVisible(false)}
              >
                <Text style={styles.manualRegisterCloseButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.manualRegisterContent}>
              {/* Data */}
              <View style={styles.manualRegisterField}>
                <Text style={styles.manualRegisterLabel}>Data</Text>
                <View style={styles.manualRegisterInputContainer}>
                  <TextInput
                    style={styles.manualRegisterInput}
                    value={manualDate}
                    onChangeText={setManualDate}
                    placeholder="DD/MM/YYYY"
                  />
                  <FontAwesomeIcon icon={faCaretDown} size={24} color="#666" />
                </View>
              </View>

              {/* Horários em duas colunas */}
              <View style={styles.manualRegisterRow}>
                <View style={styles.manualRegisterColumn}>
                  <Text style={styles.manualRegisterLabel}>Entrada</Text>
                  <View style={styles.manualRegisterInputContainer}>
                    <TextInput
                      style={styles.manualRegisterInput}
                      value={manualEntry}
                      onChangeText={setManualEntry}
                      placeholder="HH:MM"
                      keyboardType="numeric"
                    />
                    <FontAwesomeIcon icon={faCaretDown} size={24} color="#666" />
                  </View>
                </View>

                <View style={styles.manualRegisterColumn}>
                  <Text style={styles.manualRegisterLabel}>Saída Almoço</Text>
                  <View style={styles.manualRegisterInputContainer}>
                    <TextInput
                      style={styles.manualRegisterInput}
                      value={manualLunchOut}
                      onChangeText={setManualLunchOut}
                      placeholder="HH:MM"
                      keyboardType="numeric"
                    />
                    <FontAwesomeIcon icon={faCaretDown} size={24} color="#666" />
                  </View>
                </View>
              </View>

              <View style={styles.manualRegisterRow}>
                <View style={styles.manualRegisterColumn}>
                  <Text style={styles.manualRegisterLabel}>Retorno Almoço</Text>
                  <View style={styles.manualRegisterInputContainer}>
                    <TextInput
                      style={styles.manualRegisterInput}
                      value={manualLunchReturn}
                      onChangeText={setManualLunchReturn}
                      placeholder="HH:MM"
                      keyboardType="numeric"
                    />
                    <FontAwesomeIcon icon={faCaretDown} size={24} color="#666" />
                  </View>
                </View>

                <View style={styles.manualRegisterColumn}>
                  <Text style={styles.manualRegisterLabel}>Saída</Text>
                  <View style={styles.manualRegisterInputContainer}>
                    <TextInput
                      style={styles.manualRegisterInput}
                      value={manualExit}
                      onChangeText={setManualExit}
                      placeholder="HH:MM"
                      keyboardType="numeric"
                    />
                    <FontAwesomeIcon icon={faCaretDown} size={24} color="#666" />
                  </View>
                </View>

                {/* Observação */}
                <View style={styles.manualRegisterField}>
                  <Text style={styles.manualRegisterLabel}>Observação (Opção)</Text>
                  <TextInput
                    style={[styles.manualRegisterInput, styles.manualRegisterTextArea]}
                    value={manualObservation}
                    onChangeText={setManualObservation}
                    placeholder="Adicione observação sobre este registro"
                    multiline={true}
                    numberOfLines={3}
                  />
                </View>
              </View>
            </ScrollView>

            {/* Botão Salvar */}
            <TouchableOpacity style={styles.manualRegisterSaveButton} onPress={saveManualRegister}>
              <Text style={styles.manualRegisterSaveButtonText}>Salvar Registro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Card */}
        <View style={styles.card}>
          {/* Clock and Date */}
          <View style={styles.clockContainer}>
            <Text style={styles.clockText}>{currentTime}</Text>
            <Text style={styles.dateText}>{currentDate}</Text>
          </View>

          {/* Status */}
          <Text style={styles.statusText}>{getStatusText()}</Text>

          {/* Time Records */}
          <View style={styles.recordsContainer}>
            <View style={styles.recordRow}>
              <View style={styles.recordItem}>
                <Text style={styles.recordLabel}>Entrada</Text>
                <Text style={styles.recordTime}>{entryTime || "--:--"}</Text>
              </View>
              <View style={styles.recordItem}>
                <Text style={styles.recordLabel}>Saída para Almoço</Text>
                <Text style={styles.recordTime}>{lunchOutTime || "--:--"}</Text>
              </View>
            </View>

            <View style={styles.recordRow}>
              <View style={styles.recordItem}>
                <Text style={styles.recordLabel}>Retorno do Almoço</Text>
                <Text style={styles.recordTime}>{lunchReturnTime || "--:--"}</Text>
              </View>
              <View style={styles.recordItem}>
                <Text style={styles.recordLabel}>Saída</Text>
                <Text style={styles.recordTime}>{exitTime || "--:--"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={[
            styles.registerButton,
            { backgroundColor: getButtonColor() },
            nextRegisterType === RegisterType.NONE && styles.disabledButton,
          ]}
          onPress={registerTime}
          disabled={nextRegisterType === RegisterType.NONE}
        >
          <FontAwesomeIcon icon={faClock} size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.registerButtonText}>{getButtonText()}</Text>
        </TouchableOpacity>

        {/* Additional Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={openManualRegister}>
            <Text style={styles.optionText}>Registro Manual</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('History')}>
            <Text style={styles.optionText}>Histórico</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={navigateToHistory}>
          <FontAwesomeIcon icon={faCalendarAlt} size={24} color="#CCCCCC" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive}>
          <View style={styles.navActiveBackground}>
            <FontAwesomeIcon icon={faHome} size={24} color="#4CAF50" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={navigateToCalculation}>
          <FontAwesomeIcon icon={faCalculator} size={24} color="#CCCCCC" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const { width } = Dimensions.get("window")
const menuWidth = width * 0.75 // 75% da largura da tela

// Atualize os estilos para incluir o menu lateral e o modal de registro manual
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    justifyContent: "center",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  menuButton: {
    padding: 8,
    justifyContent: "space-between",
    height: 24,
    width: 30,
  },
  hamburgerLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#000",
    borderRadius: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40, // Mesmo tamanho do botão de menu para equilibrar o título
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center", // Centraliza verticalmente
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center", // Centraliza horizontalmente
  },
  clockContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  clockText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
    textAlign: "center",
  },
  statusText: {
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
  },
  recordsContainer: {
    width: "100%",
    marginTop: 8,
  },
  recordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  recordItem: {
    flex: 1,
    alignItems: "center",
  },
  recordLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
    textAlign: "center",
  },
  recordTime: {
    fontSize: 16,
    fontWeight: "500",
  },
  registerButton: {
    flexDirection: "row",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginHorizontal: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.7,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 14,
    color: "#666666",
  },
  bottomNav: {
    flexDirection: "row",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
  navItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navItemActive: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -15,
  },
  navActiveBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  // Estilos para o menu lateral
  modalContainer: {
    flex: 1,
    flexDirection: "row",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sideMenu: {
    width: menuWidth,
    backgroundColor: "#FFFFFF",
    borderRightWidth: 2,
    borderRightColor: "#2196F3",
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  menuContent: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  profileSection: {
    marginBottom: 20,
  },
  profileLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  profileValue: {
    fontSize: 16,
    marginBottom: 12,
  },
  marginTop: {
    marginTop: 8,
  },
  contractTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  contractTypeText: {
    fontSize: 14,
    marginHorizontal: 8,
    color: "#666666",
  },
  activeContractType: {
    fontWeight: "bold",
    color: "#000000",
  },
  menuActions: {
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  actionButtonText: {
    marginLeft: 12,
    fontSize: 16,
  },
  logoutButton: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  logoutButtonText: {
    color: "#F44336",
    fontSize: 16,
  },

  // Estilos para o modal de registro manual
  manualRegisterModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  manualRegisterModal: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
  },
  manualRegisterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  manualRegisterTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  manualRegisterCloseButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  manualRegisterCloseButtonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  manualRegisterContent: {
    padding: 16,
    maxHeight: 400,
  },
  manualRegisterField: {
    marginBottom: 16,
  },
  manualRegisterLabel: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 8,
  },
  manualRegisterInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  manualRegisterInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  manualRegisterTextArea: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 4,
  },
  manualRegisterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  manualRegisterColumn: {
    flex: 1,
    marginRight: 8,
  },
  manualRegisterSaveButton: {
    backgroundColor: "#000000",
    padding: 16,
    alignItems: "center",
  },
  manualRegisterSaveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default HomeScreen




// "use client"

// import { useState, useEffect } from "react"
// import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView } from "react-native"
// import { format } from "date-fns"
// import { ptBR } from "date-fns/locale"

// import { useNavigation } from "@react-navigation/native"
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
// import type { RootStackParamList } from "../../App"

// // Ícones
// import Icon from "react-native-vector-icons/MaterialIcons"

// // Tipos de registro
// enum RegisterType {
//   ENTRY = "ENTRY",
//   LUNCH_OUT = "LUNCH_OUT",
//   LUNCH_RETURN = "LUNCH_RETURN",
//   EXIT = "EXIT",
//   CLOSED = "CLOSED",
// }

// // Interface para os registros
// interface TimeRecord {
//   type: RegisterType
//   time: string
//   date: string
// }

// const HomeScreen = () => {
//   // Estado para a hora atual
// const navigation = useNavigation<NavigationProps>();
//   const [currentTime, setCurrentTime] = useState("")
//   const [currentDate, setCurrentDate] = useState("")

//   // Estado para o tipo de registro atual
//   const [currentRegisterType, setCurrentRegisterType] = useState<RegisterType>(RegisterType.ENTRY)

//   // Estado para os registros do dia
//   const [records, setRecords] = useState<TimeRecord[]>([])

//   // Atualiza a hora a cada segundo
//   useEffect(() => {
//     const updateTime = () => {
//       const now = new Date()
//       setCurrentTime(format(now, "HH:mm:ss"))
//       setCurrentDate(format(now, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }))
//     }

//     updateTime()
//     const interval = setInterval(updateTime, 1000)

//     return () => clearInterval(interval)
//   }, [])

//   // Função para registrar um horário
//   const registerTime = () => {
//     const now = new Date()
//     const timeString = format(now, "HH:mm")
//     const dateString = format(now, "dd/MM/yyyy")

//     const newRecord: TimeRecord = {
//       type: currentRegisterType,
//       time: timeString,
//       date: dateString,
//     }

//     // Adiciona o novo registro
//     setRecords([...records, newRecord])

//     // Atualiza para o próximo tipo de registro
//     switch (currentRegisterType) {
//       case RegisterType.ENTRY:
//         setCurrentRegisterType(RegisterType.LUNCH_OUT)
//         break
//       case RegisterType.LUNCH_OUT:
//         setCurrentRegisterType(RegisterType.LUNCH_RETURN)
//         break
//       case RegisterType.LUNCH_RETURN:
//         setCurrentRegisterType(RegisterType.EXIT)
//         break
//       case RegisterType.EXIT:
//         setCurrentRegisterType(RegisterType.CLOSED)
//         break
//       default:
//         break
//     }
//   }

//   // Função para obter o texto do status atual
//   const getStatusText = () => {
//     switch (currentRegisterType) {
//       case RegisterType.ENTRY:
//         return "Iniciar expediente de trabalho"
//       case RegisterType.LUNCH_OUT:
//         return "Iniciar intervalo de refeição"
//       case RegisterType.LUNCH_RETURN:
//         return "Iniciar expediente de trabalho"
//       case RegisterType.EXIT:
//         return "Iniciar intervalo de refeição"
//       case RegisterType.CLOSED:
//         return "Encerramento de expediente"
//       default:
//         return ""
//     }
//   }

//   // Função para obter o texto do botão
//   const getButtonText = () => {
//     switch (currentRegisterType) {
//       case RegisterType.ENTRY:
//         return "Registrar Entrada"
//       case RegisterType.LUNCH_OUT:
//         return "Registrar Saída para Almoço"
//       case RegisterType.LUNCH_RETURN:
//         return "Registrar Retorno do Almoço"
//       case RegisterType.EXIT:
//         return "Registrar Saída"
//       case RegisterType.CLOSED:
//         return "Expediente Encerrado"
//       default:
//         return ""
//     }
//   }

//   // Função para obter a cor do botão
//   const getButtonColor = () => {
//     switch (currentRegisterType) {
//       case RegisterType.ENTRY:
//         return "#4CAF50" // Verde
//       case RegisterType.LUNCH_OUT:
//         return "#FF9800" // Laranja
//       case RegisterType.LUNCH_RETURN:
//         return "#2196F3" // Azul
//       case RegisterType.EXIT:
//         return "#F44336" // Vermelho
//       case RegisterType.CLOSED:
//         return "#9E9E9E" // Cinza
//       default:
//         return "#4CAF50"
//     }
//   }

//   // Função para obter o horário de um tipo específico de registro
//   const getRecordTime = (type: RegisterType) => {
//     const record = records.find((r) => r.type === type)
//     return record ? record.time : "--:--"
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

//       {/* Header com menu hamburger */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.menuButton}>
//           <Icon name="menu" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>TimeTrack</Text>
//       </View>

//       <ScrollView contentContainerStyle={styles.content}>
//         {/* Relógio e data */}
//         <View style={styles.clockContainer}>
//           <Text style={styles.clockText}>{currentTime}</Text>
//           <Text style={styles.dateText}>{currentDate}</Text>
//         </View>

//         {/* Status atual */}
//         <View style={styles.statusContainer}>
//           <Text style={styles.statusLabel}>Status</Text>
//           <Text style={styles.statusText}>{getStatusText()}</Text>
//         </View>

//         {/* Registros do dia */}
//         <View style={styles.recordsContainer}>
//           <View style={styles.recordRow}>
//             <View style={styles.recordItem}>
//               <Text style={styles.recordLabel}>Entrada</Text>
//               <Text style={styles.recordTime}>{getRecordTime(RegisterType.ENTRY)}</Text>
//             </View>
//             <View style={styles.recordItem}>
//               <Text style={styles.recordLabel}>Saída para Almoço</Text>
//               <Text style={styles.recordTime}>{getRecordTime(RegisterType.LUNCH_OUT)}</Text>
//             </View>
//           </View>

//           <View style={styles.recordRow}>
//             <View style={styles.recordItem}>
//               <Text style={styles.recordLabel}>Retorno do Almoço</Text>
//               <Text style={styles.recordTime}>{getRecordTime(RegisterType.LUNCH_RETURN)}</Text>
//             </View>
//             <View style={styles.recordItem}>
//               <Text style={styles.recordLabel}>Saída</Text>
//               <Text style={styles.recordTime}>{getRecordTime(RegisterType.EXIT)}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Botão de registro */}
//         <TouchableOpacity
//           style={[styles.registerButton, { backgroundColor: getButtonColor() }]}
//           onPress={registerTime}
//           disabled={currentRegisterType === RegisterType.CLOSED}
//         >
//           <Text style={styles.registerButtonText}>{getButtonText()}</Text>
//         </TouchableOpacity>

//         {/* Opções adicionais */}
//         <View style={styles.optionsContainer}>
//           <TouchableOpacity style={styles.optionButton}>
//             <Text style={styles.optionText}>Registro Manual</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.optionButton}>
//             <Text style={styles.optionText}>Histórico</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Bottom Navigation */}
//       <View style={styles.bottomNav}>
//         <TouchableOpacity style={styles.navItem}>
//           <Icon name="home" size={24} color="#CCCCCC" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.navItem}>
//           <Icon name="access-time" size={24} color="#4CAF50" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.navItem}>
//           <Icon name="person" size={24} color="#CCCCCC" />
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     height: 56,
//     borderBottomWidth: 1,
//     borderBottomColor: "#EEEEEE",
//   },
//   menuButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     marginLeft: 16,
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   content: {
//     flexGrow: 1,
//     padding: 16,
//   },
//   clockContainer: {
//     alignItems: "center",
//     marginVertical: 24,
//   },
//   clockText: {
//     fontSize: 36,
//     fontWeight: "bold",
//   },
//   dateText: {
//     fontSize: 14,
//     color: "#666666",
//     marginTop: 4,
//   },
//   statusContainer: {
//     marginBottom: 24,
//   },
//   statusLabel: {
//     fontSize: 14,
//     color: "#666666",
//   },
//   statusText: {
//     fontSize: 16,
//     fontWeight: "500",
//     marginTop: 4,
//   },
//   recordsContainer: {
//     marginBottom: 24,
//   },
//   recordRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },
//   recordItem: {
//     flex: 1,
//     marginHorizontal: 4,
//   },
//   recordLabel: {
//     fontSize: 14,
//     color: "#666666",
//   },
//   recordTime: {
//     fontSize: 16,
//     fontWeight: "500",
//     marginTop: 4,
//   },
//   registerButton: {
//     height: 50,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   registerButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   optionsContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginBottom: 16,
//   },
//   optionButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   optionText: {
//     fontSize: 14,
//     color: "#666666",
//   },
//   bottomNav: {
//     flexDirection: "row",
//     height: 56,
//     borderTopWidth: 1,
//     borderTopColor: "#EEEEEE",
//   },
//   navItem: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// })

// export default HomeScreen
