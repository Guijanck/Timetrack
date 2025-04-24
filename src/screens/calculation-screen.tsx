"use client"

import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TextInput, TouchableOpacity, ScrollView, Platform } from "react-native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClock, faCalendarAlt, faHome, faCalculator } from "@fortawesome/free-solid-svg-icons";
import { RootStackParamList } from "../../App"

// Tipo para os dados de cálculo mensal
interface MonthlyData {
  id: string
  month: string
  shortMonth: string
  year: string
  hoursWorked: number
  grossSalary: number
  netSalary: number
  taxRate: number
}


type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Calculation'>;

// Dados fictícios para os últimos meses
const mockMonthlyData: MonthlyData[] = [
  {
    id: "mar-2025",
    month: "Março",
    shortMonth: "mar.",
    year: "2025",
    hoursWorked: 145,
    grossSalary: 7250,
    netSalary: 6162.5,
    taxRate: 15,
  },
  {
    id: "fev-2025",
    month: "Fevereiro",
    shortMonth: "fev.",
    year: "2025",
    hoursWorked: 143,
    grossSalary: 7150,
    netSalary: 6077.5,
    taxRate: 15,
  },
  {
    id: "jan-2025",
    month: "Janeiro",
    shortMonth: "jan.",
    year: "2025",
    hoursWorked: 129,
    grossSalary: 6450,
    netSalary: 5482.5,
    taxRate: 15,
  },
]

// Enum para as abas
enum TabType {
  CALCULATOR = "CALCULATOR",
  HISTORY = "HISTORY",
}

const CalculationScreen = ({ navigation, route }: any) => {
  const { isPJ } = route.params || { isPJ: true }; // Padrão: PJ
  // Estados para os inputs
  const [hourlyRate, setHourlyRate] = useState("50")
  const [taxRate, setTaxRate] = useState("15")
  const [selectedMonthId, setSelectedMonthId] = useState("mar-2025")
  const [activeTab, setActiveTab] = useState<TabType>(TabType.CALCULATOR)

  // Função para validar entrada numérica (apenas números positivos e ponto decimal)
  const validateNumericInput = (text: string) => {
    // Permite apenas dígitos e um único ponto decimal
    return text.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1")
  }

  // Obter os dados do mês selecionado
  const selectedMonth = mockMonthlyData.find((month) => month.id === selectedMonthId)

  // Calcular os valores
  const calculateValues = () => {
    if (!selectedMonth) return { grossSalary: 0, taxAmount: 0, netSalary: 0 }

    const hourlyRateValue = Number.parseFloat(hourlyRate) || 0
    const taxRateValue = Number.parseFloat(taxRate) || 0

    // Se o usuário alterou o valor da hora, recalcular o salário bruto
    const grossSalary = selectedMonth.hoursWorked * hourlyRateValue
    const taxAmount = (grossSalary * taxRateValue) / 100
    const netSalary = grossSalary - taxAmount

    return { grossSalary, taxAmount, netSalary }
  }

  const calculateCltValues = () => {
    if (!selectedMonth) return { grossSalary: 0, taxAmount: 0, netSalary: 0, inss: 0, irrf: 0 }

    const hourlyRateValue = 50
    const grossSalary = selectedMonth.hoursWorked * hourlyRateValue

    let inss = 0
    const salaryInss = grossSalary
    if (salaryInss <= 1412.00) {
      inss = salaryInss * 0.075
    } else if (salaryInss <= 2666.68) {
      inss = (1412.00 * 0.075) + ((salaryInss - 1412.00) * 0.09)
    } else if (salaryInss <= 4000.03) {
      inss = (1412.00 * 0.075) + ((2666.68 - 1412.00) * 0.09) + ((salaryInss - 2666.68) * 0.12)
    } else {
      inss = (1412.00 * 0.075) + ((2666.68 - 1412.00) * 0.09) + ((4000.03 - 2666.68) * 0.12) + ((salaryInss - 4000.03) * 0.14)
    }

    const baseIrrf = grossSalary - inss
    let irrf = 0
    if (baseIrrf <= 2112.00) {
      irrf = 0
    } else if (baseIrrf <= 2826.65) {
      irrf = baseIrrf * 0.075 - 158.40
    } else if (baseIrrf <= 3751.05) {
      irrf = baseIrrf * 0.15 - 370.40
    } else if (baseIrrf <= 4664.68) {
      irrf = baseIrrf * 0.225 - 651.73
    } else {
      irrf = baseIrrf * 0.275 - 884.96
    }

    const netSalary = grossSalary - inss - irrf
    return { grossSalary, taxAmount: inss + irrf, netSalary, inss, irrf }
  }

  const { grossSalary, taxAmount, netSalary, inss, irrf } = isPJ ? calculateValues() : calculateCltValues()

  // Formatar valores monetários
  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace(".", ",")}`
  }

  // Renderizar a aba de calculadora
  const renderCalculatorTab = () => {
    return (
      <>
        {/* Input Fields */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Valor da Hora</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.input}
                value={hourlyRate}
                onChangeText={(text) => setHourlyRate(validateNumericInput(text))}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
          </View>

          {isPJ && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Taxa de Imposto</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.currencySymbol}>%</Text>
                <TextInput
                  style={styles.input}
                  value={taxRate}
                  onChangeText={(text) => setTaxRate(validateNumericInput(text))}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
            </View>
          )}

        </View>

        {/* Month Selection */}
        <View style={styles.monthSelectionContainer}>
          <Text style={styles.sectionTitle}>Mês de Referência</Text>
          <View style={styles.monthsRow}>
            {mockMonthlyData.map((month) => (
              <TouchableOpacity
                key={month.id}
                style={[styles.monthButton, selectedMonthId === month.id && styles.selectedMonthButton]}
                onPress={() => setSelectedMonthId(month.id)}
              >
                <Text style={[styles.monthButtonText, selectedMonthId === month.id && styles.selectedMonthButtonText]}>
                  {month.shortMonth} de {month.year}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Results */}
        <View style={styles.resultsContainer}>
          <View style={styles.resultRow}>
            <View style={styles.resultLabelContainer}>
              <FontAwesomeIcon icon={faClock} size={16} color="#666666" style={styles.resultIcon} />
              <Text style={styles.resultLabel}>Horas Trabalhadas:</Text>
            </View>
            <Text style={styles.resultValue}>{selectedMonth?.hoursWorked}h</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Salário Bruto:</Text>
            <Text style={styles.resultValue}>{formatCurrency(grossSalary)}</Text>
          </View>

          {!isPJ && (
            <>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Desconto INSS:</Text>
                <Text style={styles.taxValue}>{formatCurrency(inss)}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Desconto IRRF:</Text>
                <Text style={styles.taxValue}>{formatCurrency(irrf)}</Text>
              </View>
            </>
          )}

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Impostos ({taxRate}%):</Text>
            <Text style={styles.taxValue}>{formatCurrency(taxAmount)}</Text>
          </View>

          <View style={[styles.resultRow, styles.netSalaryRow]}>
            <Text style={styles.netSalaryLabel}>Salário Líquido:</Text>
            <Text style={styles.netSalaryValue}>{formatCurrency(netSalary)}</Text>
          </View>
        </View>
      </>
    )
  }

  // Renderizar a aba de histórico
  const renderHistoryTab = () => {
    return (
      <View style={styles.historyContainer}>
        {mockMonthlyData.map((month) => (
          <View key={month.id} style={styles.historyItem}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyMonth}>
                {month.month} de {month.year}
              </Text>
              <Text style={styles.historyNetSalary}>{formatCurrency(month.netSalary)}</Text>
            </View>
            <View style={styles.historyDetails}>
              <Text style={styles.historyHours}>{month.hoursWorked} horas trabalhadas</Text>
              <Text style={styles.historyGrossSalary}>Bruto: {formatCurrency(month.grossSalary)}</Text>
            </View>
          </View>
        ))}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cálculo de Remuneração</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Main Content */}
        <View style={styles.content}>
          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cálculo de Remuneração ({isPJ ? "PJ" : "CLT"})</Text>

            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === TabType.CALCULATOR && styles.activeTab]}
                onPress={() => setActiveTab(TabType.CALCULATOR)}
              >
                <Text style={[styles.tabText, activeTab === TabType.CALCULATOR && styles.activeTabText]}>
                  Calculadora
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === TabType.HISTORY && styles.activeTab]}
                onPress={() => setActiveTab(TabType.HISTORY)}
              >
                <Text style={[styles.tabText, activeTab === TabType.HISTORY && styles.activeTabText]}>Histórico</Text>
              </TouchableOpacity>
            </View>

            {/* Conteúdo da aba ativa */}
            {activeTab === TabType.CALCULATOR ? renderCalculatorTab() : renderHistoryTab()}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("History")}>
          <FontAwesomeIcon icon={faCalendarAlt} size={24} color="#CCCCCC" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <FontAwesomeIcon icon={faHome} size={24} color="#CCCCCC" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive}>
          <View style={styles.navActiveBackground}>
            <FontAwesomeIcon icon={faCalculator} size={24} color="#4CAF50" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

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
    alignItems: "center",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
  },
  tabText: {
    color: "#999999",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#000000",
    fontWeight: "bold",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  inputContainer: {
    width: "48%",
  },
  inputLabel: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  currencySymbol: {
    fontSize: 16,
    color: "#666666",
    marginRight: 4,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  monthSelectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 8,
  },
  monthsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  monthButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 4,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    marginHorizontal: 2,
  },
  selectedMonthButton: {
    backgroundColor: "#4CAF50",
  },
  monthButtonText: {
    fontSize: 12,
    color: "#333333",
  },
  selectedMonthButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  resultsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 16,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resultLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultIcon: {
    marginRight: 4,
  },
  resultLabel: {
    fontSize: 14,
    color: "#333333",
  },
  resultValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  taxValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#F44336", // Vermelho para impostos
  },
  netSalaryRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  netSalaryLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  netSalaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50", // Verde para salário líquido
  },
  // Estilos para a aba de histórico
  historyContainer: {
    marginTop: 8,
  },
  historyItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 16,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  historyMonth: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  historyNetSalary: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  historyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historyHours: {
    fontSize: 14,
    color: "#666666",
  },
  historyGrossSalary: {
    fontSize: 14,
    color: "#4CAF50",
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
})

export default CalculationScreen
