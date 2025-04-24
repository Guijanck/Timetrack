"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Platform,
} from "react-native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes, faCaretDown, faCalendarAlt, faHome, faCalculator } from "@fortawesome/free-solid-svg-icons";

// Tipo para os registros de ponto
interface TimeRecord {
  id: string
  date: string
  entry: string
  lunchOut: string
  lunchReturn: string
  exit: string
  hours: string
}

// Dados fictícios para março e abril de 2025
const mockData: { [key: string]: TimeRecord[] } = {
  "03-2025": [
    {
      id: "1",
      date: "03/03",
      entry: "08:16",
      lunchOut: "11:26",
      lunchReturn: "13:26",
      exit: "18:55",
      hours: "8h39",
    },
    {
      id: "2",
      date: "04/03",
      entry: "08:19",
      lunchOut: "12:32",
      lunchReturn: "14:32",
      exit: "18:27",
      hours: "8h13",
    },
    {
      id: "3",
      date: "05/03",
      entry: "07:25",
      lunchOut: "12:26",
      lunchReturn: "14:26",
      exit: "17:48",
      hours: "8h38",
    },
    {
      id: "4",
      date: "06/03",
      entry: "08:08",
      lunchOut: "11:11",
      lunchReturn: "12:11",
      exit: "18:15",
      hours: "9h12",
    },
    {
      id: "5",
      date: "10/03",
      entry: "08:51",
      lunchOut: "11:43",
      lunchReturn: "13:43",
      exit: "18:36",
      hours: "7h53",
    },
    {
      id: "6",
      date: "11/03",
      entry: "08:51",
      lunchOut: "11:43",
      lunchReturn: "13:43",
      exit: "18:36",
      hours: "7h53",
    },
    {
      id: "7",
      date: "12/03",
      entry: "08:51",
      lunchOut: "11:43",
      lunchReturn: "13:43",
      exit: "18:36",
      hours: "7h53",
    },
    {
      id: "8",
      date: "13/03",
      entry: "08:51",
      lunchOut: "11:43",
      lunchReturn: "13:43",
      exit: "18:36",
      hours: "7h53",
    },
    {
      id: "9",
      date: "14/03",
      entry: "08:30",
      lunchOut: "12:00",
      lunchReturn: "13:00",
      exit: "17:30",
      hours: "8h00",
    },
    {
      id: "10",
      date: "17/03",
      entry: "08:45",
      lunchOut: "12:15",
      lunchReturn: "13:15",
      exit: "18:45",
      hours: "9h00",
    },
  ],
  "04-2025": [
    {
      id: "11",
      date: "01/04",
      entry: "08:00",
      lunchOut: "12:00",
      lunchReturn: "13:00",
      exit: "17:00",
      hours: "8h00",
    },
    {
      id: "12",
      date: "02/04",
      entry: "08:15",
      lunchOut: "12:15",
      lunchReturn: "13:15",
      exit: "17:15",
      hours: "8h00",
    },
    {
      id: "13",
      date: "03/04",
      entry: "08:30",
      lunchOut: "12:30",
      lunchReturn: "13:30",
      exit: "17:30",
      hours: "8h00",
    },
    {
      id: "14",
      date: "04/04",
      entry: "08:45",
      lunchOut: "12:45",
      lunchReturn: "13:45",
      exit: "17:45",
      hours: "8h00",
    },
    {
      id: "15",
      date: "07/04",
      entry: "09:00",
      lunchOut: "13:00",
      lunchReturn: "14:00",
      exit: "18:00",
      hours: "8h00",
    },
    {
      id: "16",
      date: "08/04",
      entry: "08:30",
      lunchOut: "12:30",
      lunchReturn: "13:30",
      exit: "18:30",
      hours: "9h00",
    },
    {
      id: "17",
      date: "09/04",
      entry: "08:15",
      lunchOut: "12:15",
      lunchReturn: "13:15",
      exit: "18:15",
      hours: "9h00",
    },
    {
      id: "18",
      date: "10/04",
      entry: "08:00",
      lunchOut: "12:00",
      lunchReturn: "13:00",
      exit: "18:00",
      hours: "9h00",
    },
    {
      id: "19",
      date: "11/04",
      entry: "08:45",
      lunchOut: "12:45",
      lunchReturn: "13:45",
      exit: "17:45",
      hours: "8h00",
    },
    {
      id: "20",
      date: "14/04",
      entry: "08:30",
      lunchOut: "12:30",
      lunchReturn: "13:30",
      exit: "17:30",
      hours: "8h00",
    },
    {
      id: "21",
      date: "15/04",
      entry: "08:15",
      lunchOut: "12:15",
      lunchReturn: "13:15",
      exit: "17:15",
      hours: "8h00",
    },
    {
      id: "22",
      date: "16/04",
      entry: "08:00",
      lunchOut: "12:00",
      lunchReturn: "13:00",
      exit: "17:00",
      hours: "8h00",
    },
    {
      id: "23",
      date: "17/04",
      entry: "08:45",
      lunchOut: "12:45",
      lunchReturn: "13:45",
      exit: "17:45",
      hours: "8h00",
    },
  ],
}

// Meses disponíveis
const months = [
  { label: "Janeiro", value: "01" },
  { label: "Fevereiro", value: "02" },
  { label: "Março", value: "03" },
  { label: "Abril", value: "04" },
  { label: "Maio", value: "05" },
  { label: "Junho", value: "06" },
  { label: "Julho", value: "07" },
  { label: "Agosto", value: "08" },
  { label: "Setembro", value: "09" },
  { label: "Outubro", value: "10" },
  { label: "Novembro", value: "11" },
  { label: "Dezembro", value: "12" },
]

// Anos disponíveis
const years = [
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
]

const HistoryScreen = ({ navigation }: any) => {
  const [selectedMonth, setSelectedMonth] = useState("03")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [showYearPicker, setShowYearPicker] = useState(false)

  // Obter os registros para o mês e ano selecionados
  const records = mockData[`${selectedMonth}-${selectedYear}`] || []

  // Calcular o total de horas
  const calculateTotalHours = () => {
    let totalMinutes = 0

    records.forEach((record) => {
      const [hours, minutes] = record.hours.replace("h", ":").split(":")
      totalMinutes += Number.parseInt(hours) * 60 + Number.parseInt(minutes)
    })

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return `${hours}.${minutes.toString().padStart(2, "0")}`
  }

  // Formatar o nome do mês e ano para exibição
  const getMonthYearDisplay = () => {
    const monthName = months.find((m) => m.value === selectedMonth)?.label || ""
    return `${monthName} ${selectedYear}`
  }

  // Componente para o seletor de mês
  const MonthPickerModal = () => (
    <Modal
      visible={showMonthPicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowMonthPicker(false)}
    >
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowMonthPicker(false)}>
        <View style={styles.pickerModalContent}>
          <View style={styles.pickerModalHeader}>
            <Text style={styles.pickerModalTitle}>Selecione o Mês</Text>
            <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
              <FontAwesomeIcon icon={faTimes} size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {months.map((month) => (
              <TouchableOpacity
                key={month.value}
                style={[styles.pickerItem, selectedMonth === month.value && styles.pickerItemSelected]}
                onPress={() => {
                  setSelectedMonth(month.value)
                  setShowMonthPicker(false)
                }}
              >
                <Text style={[styles.pickerItemText, selectedMonth === month.value && styles.pickerItemTextSelected]}>
                  {month.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  )

  // Componente para o seletor de ano
  const YearPickerModal = () => (
    <Modal
      visible={showYearPicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowYearPicker(false)}
    >
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowYearPicker(false)}>
        <View style={styles.pickerModalContent}>
          <View style={styles.pickerModalHeader}>
            <Text style={styles.pickerModalTitle}>Selecione o Ano</Text>
            <TouchableOpacity onPress={() => setShowYearPicker(false)}>
              <FontAwesomeIcon icon={faTimes} size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {years.map((year) => (
              <TouchableOpacity
                key={year.value}
                style={[styles.pickerItem, selectedYear === year.value && styles.pickerItemSelected]}
                onPress={() => {
                  setSelectedYear(year.value)
                  setShowYearPicker(false)
                }}
              >
                <Text style={[styles.pickerItemText, selectedYear === year.value && styles.pickerItemTextSelected]}>
                  {year.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico de Pontos</Text>
      </View>

      {/* Total de Horas */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total de Horas:</Text>
        <Text style={styles.totalHours}>{calculateTotalHours()}h</Text>
      </View>

      {/* Seletores de Mês e Ano */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowMonthPicker(true)}>
          <Text style={styles.pickerLabel}>Mês:</Text>
          <View style={styles.pickerValueContainer}>
            <Text style={styles.pickerValue}>{months.find((m) => m.value === selectedMonth)?.label}</Text>
            <FontAwesomeIcon icon={faCaretDown} size={24} color="#000" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowYearPicker(true)}>
          <Text style={styles.pickerLabel}>Ano:</Text>
          <View style={styles.pickerValueContainer}>
            <Text style={styles.pickerValue}>{selectedYear}</Text>
            <FontAwesomeIcon icon={faCaretDown} size={24} color="#000" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Modais para os seletores */}
      <MonthPickerModal />
      <YearPickerModal />

      {/* Título da Tabela */}
      <View style={styles.monthTitleContainer}>
        <Text style={styles.monthTitle}>{getMonthYearDisplay()}</Text>
      </View>

      {/* Cabeçalho da Tabela */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.dateCell]}>Data</Text>
        <Text style={[styles.headerCell, styles.timeCell]}>Entrada</Text>
        <Text style={[styles.headerCell, styles.timeCell]}>Saída Al.</Text>
        <Text style={[styles.headerCell, styles.timeCell]}>Retorno Al.</Text>
        <Text style={[styles.headerCell, styles.timeCell]}>Saída</Text>
        <Text style={[styles.headerCell, styles.hoursCell]}>Horas</Text>
      </View>

      {/* Lista de Registros */}
      {records.length > 0 ? (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.dateCell]}>{item.date}</Text>
              <Text style={[styles.cell, styles.timeCell]}>{item.entry}</Text>
              <Text style={[styles.cell, styles.timeCell]}>{item.lunchOut}</Text>
              <Text style={[styles.cell, styles.timeCell]}>{item.lunchReturn}</Text>
              <Text style={[styles.cell, styles.timeCell]}>{item.exit}</Text>
              <Text style={[styles.cell, styles.hoursCell]}>{item.hours}</Text>
            </View>
          )}
        />
      ) : (
        <View style={styles.noRecordsContainer}>
          <Text style={styles.noRecordsText}>Nenhum registro encontrado para este período</Text>
        </View>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <View style={styles.navActiveBackground}>
            <FontAwesomeIcon icon={faCalendarAlt} size={24} color="#4CAF50" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <FontAwesomeIcon icon={faHome} size={24} color="#CCCCCC" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Calculation")}>
          <FontAwesomeIcon icon={faCalculator} size={24} color="#CCCCCC" />
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
  totalContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: "#333333",
    marginRight: 8,
  },
  totalHours: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 4,
    padding: 8,
  },
  pickerLabel: {
    fontSize: 14,
    color: "#333333",
    marginRight: 8,
  },
  pickerValueContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerValue: {
    fontSize: 14,
    color: "#000000",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerModalContent: {
    width: "80%",
    maxHeight: "60%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
  },
  pickerModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  pickerModalTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  pickerItemSelected: {
    backgroundColor: "#F0F0F0",
  },
  pickerItemText: {
    fontSize: 16,
  },
  pickerItemTextSelected: {
    fontWeight: "bold",
    color: "#4CAF50",
  },
  monthTitleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    backgroundColor: "#F5F5F5",
  },
  headerCell: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666666",
  },
  dateCell: {
    width: "15%",
  },
  timeCell: {
    width: "17%",
  },
  hoursCell: {
    width: "17%",
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  cell: {
    fontSize: 12,
  },
  noRecordsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noRecordsText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
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

export default HistoryScreen
