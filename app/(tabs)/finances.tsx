import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
  Platform,
  Dimensions
} from 'react-native';
import { DollarSign, Filter, Plus, Search, ArrowDown, ArrowUp, Trash2, X, ArrowLeft, ArrowRight, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar as CalendarView } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import { PieChart } from 'react-native-svg-charts';
import { useLocalSearchParams } from 'expo-router';

import Colors from '../../constants/Colors';
import Spacing, { BorderRadius } from '../../constants/Spacing';
import { FontFamily } from '../../constants/Typography';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Payment as BasePayment, PaymentStatus } from '../../types';

// Mock data for payments
const MOCK_PAYMENTS = [
  { id: '1', userId: '1', year: 2023, month: 7, amount: 2000.0, status: 'PAID', userName: 'João Silva' },
  { id: '2', userId: '2', year: 2023, month: 7, amount: 2000.0, status: 'PAID', userName: 'Maria Oliveira' },
  { id: '3', userId: '3', year: 2023, month: 7, amount: 2000.0, status: 'PAID', userName: 'Pedro Santos' },
  { id: '4', userId: '4', year: 2023, month: 7, amount: 2000.0, status: 'OVERDUE', userName: 'Ana Souza' },
  { id: '5', userId: '5', year: 2023, month: 7, amount: 2000.0, status: 'PENDING', userName: 'Carlos Ferreira' },
  { id: '6', userId: '6', year: 2023, month: 8, amount: 2000.0, status: 'PENDING', userName: 'Mariana Costa' },
  { id: '7', userId: '7', year: 2023, month: 8, amount: 2000.0, status: 'PENDING', userName: 'Ricardo Lima' },
];

// Mock data for cash flow
const MOCK_CASH_FLOW = {
  totalIncome: 14000.0,
  totalExpense: 8950.0,
  balance: 5050.0,
  monthlyData: [
    { month: 'Jan', income: 14000, expense: 9500 },
    { month: 'Fev', income: 14000, expense: 8200 },
    { month: 'Mar', income: 14000, expense: 10300 },
    { month: 'Abr', income: 14000, expense: 7800 },
    { month: 'Mai', income: 14000, expense: 9200 },
    { month: 'Jun', income: 14000, expense: 8500 },
    { month: 'Jul', income: 14000, expense: 8950 },
  ],
};

// Mock data for annual closing
const MOCK_ANNUAL_DATA = {
  year: 2023,
  totalIncome: 168000.0,
  totalExpense: 107400.0,
  netProfit: 60600.0,
  monthlyData: [
    { month: 'Jan', income: 14000, expense: 9500, profit: 4500 },
    { month: 'Fev', income: 14000, expense: 8200, profit: 5800 },
    { month: 'Mar', income: 14000, expense: 10300, profit: 3700 },
    { month: 'Abr', income: 14000, expense: 7800, profit: 6200 },
    { month: 'Mai', income: 14000, expense: 9200, profit: 4800 },
    { month: 'Jun', income: 14000, expense: 8500, profit: 5500 },
    { month: 'Jul', income: 14000, expense: 8950, profit: 5050 },
    { month: 'Ago', income: 14000, expense: 9100, profit: 4900 },
    { month: 'Set', income: 14000, expense: 8800, profit: 5200 },
    { month: 'Out', income: 14000, expense: 9200, profit: 4800 },
    { month: 'Nov', income: 14000, expense: 8500, profit: 5500 },
    { month: 'Dez', income: 14000, expense: 8750, profit: 5250 },
  ],
};

type Month = 'Jan' | 'Fev' | 'Mar' | 'Abr' | 'Mai' | 'Jun' | 'Jul' | 'Ago' | 'Set' | 'Out' | 'Nov' | 'Dez';

interface MonthlyPayments {
  [memberId: string]: {
    [month in Month]: boolean;
  };
}

interface AnnualPayments {
  [year: number]: MonthlyPayments;
}

// Mock data for members
const MEMBERS = [
  { id: '1', name: 'Vitor e Bárbara' },
  { id: '2', name: 'Sílvia' },
  { id: '3', name: 'Lucas e Maeve' },
  { id: '4', name: 'Dery' },
  { id: '5', name: 'Kim' },
  { id: '6', name: 'Ana e Luke' },
  { id: '7', name: 'Rodrigo' },
];

// Mock data for monthly payments
const MOCK_MONTHLY_PAYMENTS: AnnualPayments = {
  2023: {
    '1': { Jan: true, Fev: true, Mar: true, Abr: true, Mai: true, Jun: true, Jul: true, Ago: true, Set: true, Out: true, Nov: true, Dez: true },
    '2': { Jan: true, Fev: true, Mar: true, Abr: true, Mai: true, Jun: true, Jul: true, Ago: true, Set: true, Out: true, Nov: true, Dez: true },
    '3': { Jan: true, Fev: true, Mar: true, Abr: true, Mai: true, Jun: true, Jul: true, Ago: true, Set: true, Out: true, Nov: true, Dez: true },
    '4': { Jan: true, Fev: true, Mar: true, Abr: true, Mai: true, Jun: true, Jul: true, Ago: true, Set: true, Out: true, Nov: true, Dez: true },
    '5': { Jan: true, Fev: true, Mar: true, Abr: true, Mai: true, Jun: true, Jul: true, Ago: true, Set: true, Out: true, Nov: true, Dez: true },
    '6': { Jan: true, Fev: true, Mar: true, Abr: true, Mai: true, Jun: true, Jul: true, Ago: true, Set: true, Out: true, Nov: true, Dez: true },
    '7': { Jan: true, Fev: true, Mar: true, Abr: true, Mai: true, Jun: true, Jul: true, Ago: true, Set: true, Out: true, Nov: true, Dez: true },
  },
  2024: {
    '1': { Jan: true, Fev: true, Mar: true, Abr: true, Mai: false, Jun: false, Jul: false, Ago: false, Set: false, Out: false, Nov: false, Dez: false },
    '2': { Jan: true, Fev: true, Mar: true, Abr: true, Mai: false, Jun: false, Jul: false, Ago: false, Set: false, Out: false, Nov: false, Dez: false },
    '3': { Jan: true, Fev: true, Mar: true, Abr: true, Mai: false, Jun: false, Jul: false, Ago: false, Set: false, Out: false, Nov: false, Dez: false },
    '4': { Jan: true, Fev: true, Mar: true, Abr: true, Mai: false, Jun: false, Jul: false, Ago: false, Set: false, Out: false, Nov: false, Dez: false },
    '5': { Jan: true, Fev: true, Mar: true, Abr: true, Mai: false, Jun: false, Jul: false, Ago: false, Set: false, Out: false, Nov: false, Dez: false },
    '6': { Jan: true, Fev: true, Mar: true, Abr: true, Mai: false, Jun: false, Jul: false, Ago: false, Set: false, Out: false, Nov: false, Dez: false },
    '7': { Jan: true, Fev: true, Mar: true, Abr: true, Mai: false, Jun: false, Jul: false, Ago: false, Set: false, Out: false, Nov: false, Dez: false },
  },
};

const MONTHS: Month[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  // Forçar a data como local, não UTC
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

type FinanceTab = 'expenses' | 'payments' | 'cashflow' | 'annual';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  receipt: string | null;
}

type AppPayment = Partial<BasePayment> & {
  memberName?: string;
  category?: string;
  date?: string;
  observations?: string;
};

export default function FinancesScreen() {
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<FinanceTab>('expenses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
  });
  const [monthlyPayments, setMonthlyPayments] = useState(MOCK_MONTHLY_PAYMENTS);
  const [expensesTab, setExpensesTab] = useState<'general' | 'monthly'>('general');
  const [selectedMonthlyYear, setSelectedMonthlyYear] = useState(new Date().getFullYear());
  const [showAddMonthlyModal, setShowAddMonthlyModal] = useState(false);
  const [newMonthlyExpense, setNewMonthlyExpense] = useState({
    description: '',
    amount: '',
    date: '',
    category: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMonthlyDatePicker, setShowMonthlyDatePicker] = useState(false);
  const [selectedMonthlyDate, setSelectedMonthlyDate] = useState(new Date());
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState<string | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState<'start' | 'end' | null>(null);
  const [showGeneralCalendar, setShowGeneralCalendar] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showMonthlyExpensesModal, setShowMonthlyExpensesModal] = useState(false);
  const [showFilterCategoryModal, setShowFilterCategoryModal] = useState(false);
  const [isAddPaymentModalVisible, setIsAddPaymentModalVisible] = useState(false);
  const [payments, setPayments] = useState<AppPayment[]>([]);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showPaymentCategoryModal, setShowPaymentCategoryModal] = useState(false);
  const [showPaymentDateCalendar, setShowPaymentDateCalendar] = useState(false);
  const [newPayment, setNewPayment] = useState({ memberId: '', memberName: '', amount: '', date: '', category: '', observations: '' });
  const [paymentsTab, setPaymentsTab] = useState<'general' | 'monthly'>('general');
  const [searchPaymentQuery, setSearchPaymentQuery] = useState('');
  const [filterPaymentCategory, setFilterPaymentCategory] = useState('');
  const [filterPaymentStartDate, setFilterPaymentStartDate] = useState<string | null>(null);
  const [filterPaymentEndDate, setFilterPaymentEndDate] = useState<string | null>(null);
  const [selectedPaymentYear, setSelectedPaymentYear] = useState(new Date().getFullYear());
  const [selectedPaymentMonth, setSelectedPaymentMonth] = useState(new Date().getMonth());
  const [showPaymentFilterModal, setShowPaymentFilterModal] = useState(false);
  const [showMonthlyPaymentsModal, setShowMonthlyPaymentsModal] = useState(false);

  const categories = Array.from(new Set(expenses.map(e => e.category)));

  const fixedCategories = ['Mensalidade', 'Taxa Extra', 'Funcionário', 'Insumos', 'Infraestrutura', 'Maquinário', 'Mão de Obra', 'Outros'];

  const applyFilters = (expense: typeof expenses[0]) => {
    let pass = true;
    if (filterStartDate) pass = pass && new Date(expense.date) >= new Date(filterStartDate);
    if (filterEndDate) pass = pass && new Date(expense.date) <= new Date(filterEndDate);
    if (filterCategory) pass = pass && expense.category === filterCategory;
    return pass;
  };

  const clearFilters = () => {
    setFilterStartDate(null);
    setFilterEndDate(null);
    setFilterCategory('');
  };

  // Filtrar despesas do mês/ano selecionado
  const monthlyExpenses = expenses.filter(exp => {
    if (!exp.date) return false;
    const [year, month] = exp.date.split('-');
    return (
      Number(year) === selectedMonthlyYear &&
      Number(month) === selectedMonth + 1 // selectedMonth é zero-based
    );
  });

  // Função para adicionar despesa mensal
  const handleAddMonthlyExpense = () => {
    if (!newMonthlyExpense.description || !newMonthlyExpense.amount || !newMonthlyExpense.category) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    const date = `${selectedMonthlyYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
    const expense = {
      id: Date.now().toString(),
      description: newMonthlyExpense.description,
      amount: parseFloat(newMonthlyExpense.amount),
      date,
      category: newMonthlyExpense.category,
      receipt: null,
    };
    setExpenses([expense, ...expenses]);
    setNewMonthlyExpense({ description: '', amount: '', date: '', category: '' });
    setShowAddMonthlyModal(false);
  };

  // Função utilitária para garantir estrutura do ano
  function ensureYearStructure(year: number, prev: AnnualPayments): AnnualPayments {
    if (prev[year]) return prev;
    const newYear: MonthlyPayments = {};
    MEMBERS.forEach(member => {
      newYear[member.id] = {} as { [month in Month]: boolean };
      MONTHS.forEach(month => {
        newYear[member.id][month] = false;
      });
    });
    return { ...prev, [year]: newYear };
  }

  const handleSetYear = (year: number) => {
    setMonthlyPayments(prev => ensureYearStructure(year, prev));
    setSelectedYear(year);
  };

  const handlePaymentToggle = (memberId: string, month: Month) => {
    setMonthlyPayments(prev => {
      const safePrev = ensureYearStructure(selectedYear, prev);
      return {
        ...safePrev,
        [selectedYear]: {
          ...safePrev[selectedYear],
          [memberId]: {
            ...safePrev[selectedYear][memberId],
            [month]: !safePrev[selectedYear][memberId][month]
          }
        }
      };
    });
  };

  const handleDeleteExpense = (expenseId: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta despesa?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setExpenses(expenses.filter(expense => expense.id !== expenseId));
          }
        }
      ]
    );
  };

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
      category: newExpense.category,
      receipt: null,
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
    });
    setIsAddModalVisible(false);
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setNewExpense({
        ...newExpense,
        date: date.toISOString().split('T')[0]
      });
    }
  };

  const handleMonthlyDateChange = (event: any, date?: Date) => {
    setShowMonthlyDatePicker(false);
    if (date) {
      setSelectedMonthlyDate(date);
      setNewMonthlyExpense({
        ...newMonthlyExpense,
        date: date.toISOString().split('T')[0]
      });
    }
  };

  const renderAddExpenseModal = () => (
    <Modal
      visible={isAddModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsAddModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Card style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nova Despesa</Text>
            <TouchableOpacity
              onPress={() => setIsAddModalVisible(false)}
              style={styles.closeButton}
            >
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Input
              label="Descrição"
              value={newExpense.description}
              onChangeText={(text) => setNewExpense({ ...newExpense, description: text })}
              placeholder="Digite a descrição da despesa"
            />

            <Input
              label="Valor"
              value={newExpense.amount}
              onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
              placeholder="0,00"
              keyboardType="numeric"
              leftIcon={<DollarSign size={20} color={Colors.text.secondary} />}
            />

            <TouchableOpacity
              style={styles.dateInputContainer}
              onPress={() => setShowGeneralCalendar(true)}
            >
              <Text style={styles.dateInputLabel}>Data</Text>
              <View style={styles.dateInput}>
                <Text style={styles.dateInputText}>
                  {newExpense.date ? formatDate(newExpense.date) : 'Selecione uma data'}
                </Text>
                <Calendar size={20} color={Colors.text.secondary} />
              </View>
            </TouchableOpacity>

            {showGeneralCalendar && (
              <View style={{ marginBottom: 16 }}>
                <CalendarView
                  onDayPress={(day: { dateString: string; day: number; month: number; year: number; timestamp: number; }) => {
                    setNewExpense({ ...newExpense, date: day.dateString });
                    setShowGeneralCalendar(false);
                  }}
                  markedDates={newExpense.date ? { [newExpense.date]: { selected: true, selectedColor: Colors.primary.main } } : {}}
                  theme={{
                    todayTextColor: Colors.primary.main,
                    selectedDayBackgroundColor: Colors.primary.main,
                    arrowColor: Colors.primary.main,
                  }}
                />
              </View>
            )}

            <View style={{ marginBottom: 24 }}>
              <Text style={styles.dateInputLabel}>Categoria</Text>
              <TouchableOpacity
                style={[styles.dateInput, { padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={[styles.dateInputText, { color: newExpense.category ? Colors.text.primary : Colors.text.secondary }] }>
                  {newExpense.category || 'Selecionar Categoria'}
                </Text>
                <ArrowDown size={18} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <Button
              title="Cancelar"
              variant="outlined"
              onPress={() => setIsAddModalVisible(false)}
              style={{ ...styles.modalButton, marginRight: 12 }}
            />
            <Button
              title="Adicionar"
              variant="primary"
              onPress={handleAddExpense}
              style={styles.modalButton}
            />
          </View>
        </Card>
      </View>
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} activeOpacity={1} onPress={() => setShowCategoryModal(false)} />
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: Colors.background.paper, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 }}>
          {fixedCategories.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => {
                setNewExpense({ ...newExpense, category: cat });
                setShowCategoryModal(false);
              }}
              style={{
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: Colors.border.light,
              }}
            >
              <Text style={{ fontSize: 16, color: Colors.text.primary }}>{cat}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setShowCategoryModal(false)} style={{ paddingVertical: 16 }}>
            <Text style={{ fontSize: 16, color: Colors.error.main, textAlign: 'center' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Modal>
  );

  const filteredExpenses = expenses.filter(expense => {
    const query = searchQuery.toLowerCase();
    return (
      expense.description.toLowerCase().includes(query) ||
      expense.category.toLowerCase().includes(query) ||
      expense.amount.toString().includes(query)
    );
  });

  const renderExpensesTab = () => {
    const firstColumnMonths = MONTHS_PT.slice(0, 6);
    const secondColumnMonths = MONTHS_PT.slice(6, 12);

    return (
      <View style={styles.tabContent}>
        <View style={styles.expensesTabsContainer}>
          <TouchableOpacity
            style={[styles.expensesTab, expensesTab === 'general' && styles.activeExpensesTab]}
            onPress={() => setExpensesTab('general')}
          >
            <Text style={[styles.expensesTabText, expensesTab === 'general' && styles.activeExpensesTabText]}>Despesas Gerais</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.expensesTab, expensesTab === 'monthly' && styles.activeExpensesTab]}
            onPress={() => setExpensesTab('monthly')}
          >
            <Text style={[styles.expensesTabText, expensesTab === 'monthly' && styles.activeExpensesTabText]}>Despesas Mensais</Text>
          </TouchableOpacity>
        </View>
        {expensesTab === 'general' ? (
          <>
            <View style={styles.searchContainer}>
              <Input
                placeholder="Buscar despesas..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                leftIcon={<Search size={20} color={Colors.text.secondary} />}
                containerStyle={styles.searchInput}
              />
              <TouchableOpacity style={styles.filterButton} onPress={() => setIsFilterModalVisible(true)}>
                <Filter size={20} color={Colors.text.primary} />
              </TouchableOpacity>
              <Button
                title="Nova"
                variant="primary"
                size="small"
                icon={<Plus size={16} color={Colors.white} />}
                onPress={() => setIsAddModalVisible(true)}
              />
            </View>

            <FlatList
              data={filteredExpenses.filter(applyFilters)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Card style={styles.expenseCard}>
                  <View style={styles.expenseHeader}>
                    <Text style={styles.expenseDescription}>{item.description}</Text>
                    <View style={styles.expenseHeaderRight}>
                      <Text style={styles.expenseAmount}>{formatCurrency(item.amount)}</Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteExpense(item.id)}
                        style={styles.deleteButton}
                      >
                        <Trash2 size={16} color={Colors.error.main} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.expenseDetails}>
                    <View style={styles.expenseDetail}>
                      <Text style={styles.expenseDetailLabel}>Data:</Text>
                      <Text style={styles.expenseDetailValue}>{formatDate(item.date)}</Text>
                    </View>
                    <View style={styles.expenseDetail}>
                      <Text style={styles.expenseDetailLabel}>Categoria:</Text>
                      <Text style={styles.expenseDetailValue}>{item.category}</Text>
                    </View>
                    {item.receipt && (
                      <TouchableOpacity style={styles.receiptButton}>
                        <Text style={styles.receiptButtonText}>Ver comprovante</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </Card>
              )}
              style={styles.expensesList}
            />
          </>
        ) : (
          <>
            <View style={styles.monthlyYearSelector}>
              <TouchableOpacity onPress={() => setSelectedMonthlyYear(selectedMonthlyYear - 1)} style={styles.periodControl}>
                <ArrowLeft size={20} color={Colors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.periodText}>{selectedMonthlyYear}</Text>
              <TouchableOpacity onPress={() => setSelectedMonthlyYear(selectedMonthlyYear + 1)} style={styles.periodControl}>
                <ArrowRight size={20} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.monthButtonsGrid}>
              <View style={styles.monthColumn}>
                {firstColumnMonths.map((month, idx) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.monthButton,
                      selectedMonth === idx && styles.activeMonthButton
                    ]}
                    onPress={() => {
                      setSelectedMonth(idx);
                      setShowMonthlyExpensesModal(true);
                    }}
                  >
                    <Text style={[
                      styles.monthButtonText,
                      selectedMonth === idx && styles.activeMonthButtonText
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.monthColumn}>
                {secondColumnMonths.map((month, idx) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.monthButton,
                      selectedMonth === idx + 6 && styles.activeMonthButton
                    ]}
                    onPress={() => {
                      setSelectedMonth(idx + 6);
                      setShowMonthlyExpensesModal(true);
                    }}
                  >
                    <Text style={[
                      styles.monthButtonText,
                      selectedMonth === idx + 6 && styles.activeMonthButtonText
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
      </View>
    );
  };

  const getMonthName = (month: number) => {
    const date = new Date();
    date.setMonth(month - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return Colors.success.main;
      case 'PENDING':
        return Colors.warning.main;
      case 'OVERDUE':
        return Colors.error.main;
      default:
        return Colors.text.secondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Pago';
      case 'PENDING':
        return 'Pendente';
      case 'OVERDUE':
        return 'Atrasado';
      default:
        return status;
    }
  };

  const renderPaymentsTab = () => {
    const firstColumnMonths = MONTHS_PT.slice(0, 6);
    const secondColumnMonths = MONTHS_PT.slice(6, 12);

    // Filtros
    const filteredPayments = payments.filter(payment => {
      const query = searchPaymentQuery.toLowerCase();
      let pass = true;
      if (query) {
        pass = pass && (
          payment.memberName?.toLowerCase().includes(query) ||
          payment.category?.toLowerCase().includes(query) ||
          payment.amount?.toString().includes(query)
        );
      }
      if (filterPaymentCategory) pass = pass && payment.category === filterPaymentCategory;
      if (filterPaymentStartDate) pass = pass && new Date(payment.date) >= new Date(filterPaymentStartDate);
      if (filterPaymentEndDate) pass = pass && new Date(payment.date) <= new Date(filterPaymentEndDate);
      return pass;
    });

    // Pagamentos do mês/ano selecionado
    const monthlyPaymentsList = payments.filter(payment => {
      if (!payment.date) return false;
      const [year, month] = payment.date.split('-');
      return (
        Number(year ?? 0) === selectedPaymentYear &&
        Number(month ?? 0) === selectedPaymentMonth + 1
      );
    });

    return (
      <View style={styles.tabContent}>
        <View style={styles.expensesTabsContainer}>
          <TouchableOpacity
            style={[styles.expensesTab, paymentsTab === 'general' && styles.activeExpensesTab]}
            onPress={() => setPaymentsTab('general')}
          >
            <Text style={[styles.expensesTabText, paymentsTab === 'general' && styles.activeExpensesTabText]}>Pagamentos Geral</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.expensesTab, paymentsTab === 'monthly' && styles.activeExpensesTab]}
            onPress={() => setPaymentsTab('monthly')}
          >
            <Text style={[styles.expensesTabText, paymentsTab === 'monthly' && styles.activeExpensesTabText]}>Pagamento Mensal</Text>
          </TouchableOpacity>
        </View>

        {paymentsTab === 'general' ? (
          <>
            <View style={styles.searchContainer}>
              <Input
                placeholder="Buscar pagamentos..."
                value={searchPaymentQuery}
                onChangeText={setSearchPaymentQuery}
                leftIcon={<Search size={20} color={Colors.text.secondary} />}
                containerStyle={styles.searchInput}
              />
              <TouchableOpacity style={styles.filterButton} onPress={() => setShowPaymentFilterModal(true)}>
                <Filter size={20} color={Colors.text.primary} />
              </TouchableOpacity>
              <Button
                title="Novo Pagamento"
                variant="primary"
                size="small"
                icon={<Plus size={16} color={Colors.white} />}
                onPress={() => setIsAddPaymentModalVisible(true)}
              />
            </View>
            <FlatList
              data={filteredPayments}
              keyExtractor={(item, index) => item.id ? String(item.id) : String(index)}
              renderItem={({ item }) => (
                <Card style={styles.expenseCard}>
                  <View style={styles.expenseHeader}>
                    <Text style={styles.expenseDescription}>{String(item.memberName ?? '')}</Text>
                    <View style={styles.expenseHeaderRight}>
                      <Text style={[styles.expenseAmount, { color: Colors.primary.main }]}>{formatCurrency(Number(item.amount ?? 0))}</Text>
                      <TouchableOpacity
                        onPress={() => handleDeletePayment(item.id)}
                        style={styles.deleteButton}
                      >
                        <Trash2 size={16} color={Colors.error.main} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.expenseDetails}>
                    <View style={styles.expenseDetail}>
                      <Text style={styles.expenseDetailLabel}>Data:</Text>
                      <Text style={styles.expenseDetailValue}>{formatDate(String(item.date ?? ''))}</Text>
                    </View>
                    <View style={styles.expenseDetail}>
                      <Text style={styles.expenseDetailLabel}>Categoria:</Text>
                      <Text style={styles.expenseDetailValue}>{String(item.category ?? '')}</Text>
                    </View>
                    {item.observations && (
                      <View style={styles.expenseDetail}>
                        <Text style={styles.expenseDetailLabel}>Obs:</Text>
                        <Text style={styles.expenseDetailValue}>{String(item.observations ?? '')}</Text>
                      </View>
                    )}
                  </View>
                </Card>
              )}
              style={styles.expensesList}
            />
          </>
        ) : (
          <>
            <View style={styles.monthlyYearSelector}>
              <TouchableOpacity onPress={() => setSelectedPaymentYear(selectedPaymentYear - 1)} style={styles.periodControl}>
                <ArrowLeft size={20} color={Colors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.periodText}>{selectedPaymentYear}</Text>
              <TouchableOpacity onPress={() => setSelectedPaymentYear(selectedPaymentYear + 1)} style={styles.periodControl}>
                <ArrowRight size={20} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.monthButtonsGrid}>
              <View style={styles.monthColumn}>
                {firstColumnMonths.map((month, idx) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.monthButton,
                      selectedPaymentMonth === idx && styles.activeMonthButton
                    ]}
                    onPress={() => {
                      setSelectedPaymentMonth(idx);
                      setShowMonthlyPaymentsModal(true);
                    }}
                  >
                    <Text style={[
                      styles.monthButtonText,
                      selectedPaymentMonth === idx && styles.activeMonthButtonText
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.monthColumn}>
                {secondColumnMonths.map((month, idx) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.monthButton,
                      selectedPaymentMonth === idx + 6 && styles.activeMonthButton
                    ]}
                    onPress={() => {
                      setSelectedPaymentMonth(idx + 6);
                      setShowMonthlyPaymentsModal(true);
                    }}
                  >
                    <Text style={[
                      styles.monthButtonText,
                      selectedPaymentMonth === idx + 6 && styles.activeMonthButtonText
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
      </View>
    );
  };

  const renderCashFlowTab = () => {
    // Filtrar despesas do ano selecionado
    const annualExpenses = expenses.filter(exp => {
      if (!exp.date) return false;
      const [year] = exp.date.split('-');
      return Number(year) === selectedYear;
    });
    const totalAnnualExpense = annualExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Calcular despesas por categoria
    const expensesByCategory = annualExpenses.reduce((acc, exp) => {
      if (!acc[exp.category]) {
        acc[exp.category] = 0;
      }
      acc[exp.category] += exp.amount;
      return acc;
    }, {} as { [key: string]: number });

    // Preparar dados para o gráfico
    const pieData = Object.entries(expensesByCategory)
      .filter(([_, amount]) => typeof amount === 'number' && amount > 0)
      .map(([category, amount], index) => ({
        value: amount,
        svg: {
          fill: [
            Colors.primary.main,
            Colors.success.main,
            Colors.warning.main,
            Colors.error.main,
            Colors.accent.main,
            Colors.grey[400],
            Colors.grey[600],
            Colors.grey[800],
          ][index % 8],
          onPress: () => Alert.alert(category, `Total: ${formatCurrency(amount)}`),
        },
        key: `pie-${index}`,
        arc: { cornerRadius: 5 },
      }));

    // Debug logs
    console.log('pieData:', pieData);
    console.log('expensesByCategory:', expensesByCategory);

    // Calcular receita (pagamentos) do ano selecionado
    const annualIncome = payments.filter(p => {
      if (!p.date) return false;
      const [year] = String(p.date ?? '').split('-');
      return Number(year) === selectedYear;
    }).reduce((sum, p) => sum + Number(p.amount ?? 0), 0);

    // Calcular saldo
    const annualBalance = annualIncome - totalAnnualExpense;

    return (
      <View style={styles.tabContent}>
        <Card style={styles.cashFlowSummary}>
          <View style={styles.yearSelector}>
            <TouchableOpacity onPress={() => setSelectedYear(selectedYear - 1)} style={styles.yearControl}>
              <ArrowDown size={20} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.yearText}>{selectedYear}</Text>
            <TouchableOpacity onPress={() => setSelectedYear(selectedYear + 1)} style={styles.yearControl}>
              <ArrowUp size={20} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.cashFlowTitle}>Fluxo de Caixa Anual</Text>
          <View style={styles.cashFlowDetails}>
            <View style={styles.cashFlowItem}>
              <Text style={styles.cashFlowLabel}>Despesas</Text>
              <Text style={[styles.cashFlowValue, { color: Colors.error.main, fontWeight: 'bold' }]}>
                {formatCurrency(totalAnnualExpense)}
              </Text>
            </View>
            <View style={styles.cashFlowItem}>
              <Text style={styles.cashFlowLabel}>Receita</Text>
              <Text style={[styles.cashFlowValue, { color: Colors.success.main, fontWeight: 'bold' }]}>
                {formatCurrency(annualIncome)}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <Text style={[styles.cashFlowLabel, { fontSize: 18 }]}>Saldo</Text>
            <Text style={[styles.cashFlowValue, { color: Colors.accent.main, fontWeight: 'bold', fontSize: 24 }]}>{formatCurrency(annualBalance)}</Text>
          </View>
        </Card>
        {/* O gráfico de pizza foi removido daqui */}
      </View>
    );
  };

  const renderAnnualClosingTab = () => {
    return (
      <View style={styles.tabContent}>
        <Card style={styles.annualSummary}>
          <View style={styles.yearSelector}>
            <TouchableOpacity 
              onPress={() => handleSetYear(selectedYear - 1)}
              style={styles.yearControl}
            >
              <ArrowDown size={20} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.yearText}>{selectedYear}</Text>
            <TouchableOpacity 
              onPress={() => handleSetYear(selectedYear + 1)}
              style={styles.yearControl}
            >
              <ArrowUp size={20} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.membersTable}>
          <ScrollView horizontal>
            <View>
              <View style={styles.tableHeader}>
                <View style={[styles.memberCell]}>
                  <Text style={styles.headerText}>Membro</Text>
                </View>
                {MONTHS.map((month) => (
                  <View key={month} style={[styles.monthCell]}>
                    <Text style={styles.headerText}>{month}</Text>
                  </View>
                ))}
              </View>
              <ScrollView>
                {MEMBERS.map((member) => (
                  <View key={member.id} style={styles.tableRow}>
                    <View style={styles.memberCell}>
                      <Text style={styles.memberName}>{member.name}</Text>
                    </View>
                    {MONTHS.map((month) => (
                      <TouchableOpacity
                        key={month}
                        style={[
                          styles.monthCell,
                          styles.paymentCell,
                          Boolean(monthlyPayments[selectedYear]?.[member.id]?.[month] ?? false) && styles.paidCell
                        ]}
                        onPress={() => handlePaymentToggle(member.id, month)}
                      >
                        <Text style={[
                          styles.paymentText,
                          Boolean(monthlyPayments[selectedYear]?.[member.id]?.[month] ?? false) && styles.paidText
                        ]}>
                          {Boolean(monthlyPayments[selectedYear]?.[member.id]?.[month] ?? false) ? '✓' : ''}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </Card>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.paidCell]} />
            <Text style={styles.legendText}>Pago</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.unpaidCell]} />
            <Text style={styles.legendText}>Não Pago</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderFilterModal = () => (
    <Modal
      visible={isFilterModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Card style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrar Despesas</Text>
            <TouchableOpacity onPress={() => setIsFilterModalVisible(false)} style={styles.closeButton}>
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <TouchableOpacity style={styles.dateInputContainer} onPress={() => setShowCalendar('start')}>
              <Text style={styles.dateInputLabel}>Data Inicial</Text>
              <View style={styles.dateInput}>
                <Text style={styles.dateInputText}>{filterStartDate ? formatDate(filterStartDate) : 'Selecione'}</Text>
                <Calendar size={20} color={Colors.text.secondary} />
              </View>
            </TouchableOpacity>
            {showCalendar === 'start' && (
              <View style={{ marginBottom: 16 }}>
                <CalendarView
                  onDayPress={(day: { dateString: string; day: number; month: number; year: number; timestamp: number; }) => {
                    setFilterStartDate(day.dateString);
                    setShowCalendar(null);
                  }}
                  markedDates={filterStartDate ? { [filterStartDate]: { selected: true, selectedColor: Colors.primary.main } } : {}}
                  theme={{
                    todayTextColor: Colors.primary.main,
                    selectedDayBackgroundColor: Colors.primary.main,
                    arrowColor: Colors.primary.main,
                  }}
                />
              </View>
            )}
            <TouchableOpacity style={styles.dateInputContainer} onPress={() => setShowCalendar('end')}>
              <Text style={styles.dateInputLabel}>Data Final</Text>
              <View style={styles.dateInput}>
                <Text style={styles.dateInputText}>{filterEndDate ? formatDate(filterEndDate) : 'Selecione'}</Text>
                <Calendar size={20} color={Colors.text.secondary} />
              </View>
            </TouchableOpacity>
            {showCalendar === 'end' && (
              <View style={{ marginBottom: 16 }}>
                <CalendarView
                  onDayPress={(day: { dateString: string; day: number; month: number; year: number; timestamp: number; }) => {
                    setFilterEndDate(day.dateString);
                    setShowCalendar(null);
                  }}
                  markedDates={filterEndDate ? { [filterEndDate]: { selected: true, selectedColor: Colors.primary.main } } : {}}
                  theme={{
                    todayTextColor: Colors.primary.main,
                    selectedDayBackgroundColor: Colors.primary.main,
                    arrowColor: Colors.primary.main,
                  }}
                />
              </View>
            )}
            <View style={{ marginBottom: 24 }}>
              <Text style={styles.dateInputLabel}>Categoria</Text>
              <TouchableOpacity
                style={[styles.dateInput, { padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                onPress={() => setShowFilterCategoryModal(true)}
              >
                <Text style={[styles.dateInputText, { color: filterCategory ? Colors.text.primary : Colors.text.secondary }] }>
                  {filterCategory || 'Selecionar Categoria'}
                </Text>
                <ArrowDown size={18} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.modalFooter}>
            <Button title="Limpar" variant="outlined" onPress={clearFilters} style={{ ...styles.modalButton, marginRight: 12 }} />
            <Button title="Aplicar" variant="primary" onPress={() => setIsFilterModalVisible(false)} style={styles.modalButton} />
          </View>
        </Card>
      </View>
      <Modal
        visible={showFilterCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterCategoryModal(false)}
      >
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} activeOpacity={1} onPress={() => setShowFilterCategoryModal(false)} />
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: Colors.background.paper, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 }}>
          <TouchableOpacity
            onPress={() => {
              setFilterCategory('');
              setShowFilterCategoryModal(false);
            }}
            style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border.light }}
          >
            <Text style={{ fontSize: 16, color: filterCategory === '' ? Colors.primary.main : Colors.text.primary }}>Todas</Text>
          </TouchableOpacity>
          {fixedCategories.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => {
                setFilterCategory(cat);
                setShowFilterCategoryModal(false);
              }}
              style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border.light }}
            >
              <Text style={{ fontSize: 16, color: filterCategory === cat ? Colors.primary.main : Colors.text.primary }}>{cat}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setShowFilterCategoryModal(false)} style={{ paddingVertical: 16 }}>
            <Text style={{ fontSize: 16, color: Colors.error.main, textAlign: 'center' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Modal>
  );

  const renderMonthlyExpensesModal = () => {
    const totalMonthly = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
      <Modal
        visible={showMonthlyExpensesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMonthlyExpensesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Despesas de {MONTHS_PT[selectedMonth]} {selectedMonthlyYear}</Text>
              <TouchableOpacity
                onPress={() => setShowMonthlyExpensesModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontFamily: FontFamily.bold, fontSize: 16, color: Colors.text.primary }}>
                  Total do mês: {formatCurrency(totalMonthly)}
                </Text>
              </View>
              {monthlyExpenses.length > 0 ? (
                <FlatList
                  data={monthlyExpenses}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <Card style={styles.expenseCard}>
                      <View style={styles.expenseHeader}>
                        <Text style={styles.expenseDescription}>{item.description}</Text>
                        <View style={styles.expenseHeaderRight}>
                          <Text style={styles.expenseAmount}>{formatCurrency(item.amount)}</Text>
                          <TouchableOpacity
                            onPress={() => handleDeleteExpense(item.id)}
                            style={styles.deleteButton}
                          >
                            <Trash2 size={16} color={Colors.error.main} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.expenseDetails}>
                        <View style={styles.expenseDetail}>
                          <Text style={styles.expenseDetailLabel}>Data:</Text>
                          <Text style={styles.expenseDetailValue}>{formatDate(item.date)}</Text>
                        </View>
                        <View style={styles.expenseDetail}>
                          <Text style={styles.expenseDetailLabel}>Categoria:</Text>
                          <Text style={styles.expenseDetailValue}>{item.category}</Text>
                        </View>
                      </View>
                    </Card>
                  )}
                />
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateText}>
                    Nenhuma despesa registrada para este mês
                  </Text>
                </View>
              )}
            </View>
          </Card>
        </View>
      </Modal>
    );
  };

  const renderAddPaymentModal = () => (
    <Modal
      visible={isAddPaymentModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsAddPaymentModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Card style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Adicionar Pagamento</Text>
            <TouchableOpacity onPress={() => setIsAddPaymentModalVisible(false)} style={styles.closeButton}>
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.dateInputLabel}>Integrante</Text>
            <TouchableOpacity
              style={[styles.dateInput, { padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }]}
              onPress={() => setShowMemberModal(true)}
            >
              <Text style={[styles.dateInputText, { color: newPayment.memberName ? Colors.text.primary : Colors.text.secondary }] }>
                {newPayment.memberName || 'Selecionar Integrante'}
              </Text>
              <ArrowDown size={18} color={Colors.text.secondary} />
            </TouchableOpacity>
            <Input
              label="Valor"
              value={newPayment.amount}
              onChangeText={text => setNewPayment({ ...newPayment, amount: text })}
              placeholder="0,00"
              keyboardType="numeric"
              leftIcon={<DollarSign size={20} color={Colors.text.secondary} />}
            />
            <TouchableOpacity
              style={[styles.dateInputContainer, { marginTop: 16 }]}
              onPress={() => setShowPaymentDateCalendar(true)}
            >
              <Text style={styles.dateInputLabel}>Data</Text>
              <View style={styles.dateInput}>
                <Text style={styles.dateInputText}>
                  {newPayment.date ? formatDate(newPayment.date) : 'Selecione uma data'}
                </Text>
                <Calendar size={20} color={Colors.text.secondary} />
              </View>
            </TouchableOpacity>
            {showPaymentDateCalendar && (
              <View style={{ marginBottom: 16 }}>
                <CalendarView
                  onDayPress={(day: { dateString: string; day: number; month: number; year: number; timestamp: number; }) => {
                    setNewPayment({ ...newPayment, date: day.dateString });
                    setShowPaymentDateCalendar(false);
                  }}
                  markedDates={newPayment.date ? { [newPayment.date]: { selected: true, selectedColor: Colors.primary.main } } : {}}
                  theme={{
                    todayTextColor: Colors.primary.main,
                    selectedDayBackgroundColor: Colors.primary.main,
                    arrowColor: Colors.primary.main,
                  }}
                />
              </View>
            )}
            <TouchableOpacity
              style={[styles.dateInput, { padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }]}
              onPress={() => setShowPaymentCategoryModal(true)}
            >
              <Text style={[styles.dateInputText, { color: newPayment.category ? Colors.text.primary : Colors.text.secondary }] }>
                {newPayment.category || 'Selecionar Categoria'}
              </Text>
              <ArrowDown size={18} color={Colors.text.secondary} />
            </TouchableOpacity>
            <Input
              label="Observações"
              value={newPayment.observations}
              onChangeText={text => setNewPayment({ ...newPayment, observations: text })}
              placeholder="Ex: Pagamento referente a..."
              multiline
              containerStyle={{ marginTop: 16 }}
            />
          </View>
          <View style={styles.modalFooter}>
            <Button
              title="Cancelar"
              variant="outlined"
              onPress={() => setIsAddPaymentModalVisible(false)}
              style={{ ...styles.modalButton, marginRight: 12 }}
            />
            <Button
              title="Adicionar"
              variant="primary"
              onPress={() => {
                if (!newPayment.memberId || !newPayment.amount || !newPayment.date || !newPayment.category) return;
                const dateStr = String(newPayment.date ?? '');
                const dateObj = new Date(dateStr);
                setPayments([
                  {
                    ...newPayment,
                    id: Date.now().toString(),
                    year: dateObj.getFullYear(),
                    month: dateObj.getMonth() + 1,
                    status: PaymentStatus.PAID,
                    dueDate: dateStr,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    amount: Number(newPayment.amount),
                    date: dateStr,
                  },
                  ...payments,
                ]);
                setNewPayment({ memberId: '', memberName: '', amount: '', date: '', category: '', observations: '' });
                setIsAddPaymentModalVisible(false);
              }}
              style={styles.modalButton}
            />
          </View>
        </Card>
        {/* Modal ActionSheet Integrante */}
        <Modal
          visible={showMemberModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowMemberModal(false)}
        >
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} activeOpacity={1} onPress={() => setShowMemberModal(false)} />
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: Colors.background.paper, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 }}>
            {MEMBERS.map(member => (
              <TouchableOpacity
                key={member.id}
                onPress={() => {
                  setNewPayment({ ...newPayment, memberId: member.id, memberName: member.name });
                  setShowMemberModal(false);
                }}
                style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border.light }}
              >
                <Text style={{ fontSize: 16, color: newPayment.memberId === member.id ? Colors.primary.main : Colors.text.primary }}>{member.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowMemberModal(false)} style={{ paddingVertical: 16 }}>
              <Text style={{ fontSize: 16, color: Colors.error.main, textAlign: 'center' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {/* Modal ActionSheet Categoria */}
        <Modal
          visible={showPaymentCategoryModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowPaymentCategoryModal(false)}
        >
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} activeOpacity={1} onPress={() => setShowPaymentCategoryModal(false)} />
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: Colors.background.paper, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 }}>
            {fixedCategories.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => {
                  setNewPayment({ ...newPayment, category: cat });
                  setShowPaymentCategoryModal(false);
                }}
                style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border.light }}
              >
                <Text style={{ fontSize: 16, color: newPayment.category === cat ? Colors.primary.main : Colors.text.primary }}>{cat}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowPaymentCategoryModal(false)} style={{ paddingVertical: 16 }}>
              <Text style={{ fontSize: 16, color: Colors.error.main, textAlign: 'center' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </Modal>
  );

  const renderMonthlyPaymentsModal = () => {
    const monthlyPaymentsList = payments.filter(payment => {
      if (!payment.date) return false;
      const [year, month] = String(payment.date ?? '').split('-');
      return (
        Number(year ?? 0) === selectedPaymentYear &&
        Number(month ?? 0) === selectedPaymentMonth + 1
      );
    });
    const totalMonthly = monthlyPaymentsList.reduce((sum, p) => sum + Number(p.amount ?? 0), 0);
    return (
      <Modal
        visible={showMonthlyPaymentsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMonthlyPaymentsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pagamentos de {MONTHS_PT[selectedPaymentMonth]} {selectedPaymentYear}</Text>
              <TouchableOpacity
                onPress={() => setShowMonthlyPaymentsModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontFamily: FontFamily.bold, fontSize: 16, color: Colors.text.primary }}>
                  Total do mês: {formatCurrency(totalMonthly)}
                </Text>
              </View>
              {monthlyPaymentsList.length > 0 ? (
                <FlatList
                  data={monthlyPaymentsList}
                  keyExtractor={(item, index) => item.id ? String(item.id) : String(index)}
                  renderItem={({ item }) => (
                    <Card style={styles.expenseCard}>
                      <View style={styles.expenseHeader}>
                        <Text style={styles.expenseDescription}>{String(item.memberName ?? '')}</Text>
                        <View style={styles.expenseHeaderRight}>
                          <Text style={[styles.expenseAmount, { color: Colors.primary.main }]}>{formatCurrency(Number(item.amount ?? 0))}</Text>
                          <TouchableOpacity
                            onPress={() => handleDeletePayment(item.id)}
                            style={styles.deleteButton}
                          >
                            <Trash2 size={16} color={Colors.error.main} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.expenseDetails}>
                        <View style={styles.expenseDetail}>
                          <Text style={styles.expenseDetailLabel}>Data:</Text>
                          <Text style={styles.expenseDetailValue}>{formatDate(item.date ? String(item.date) : '')}</Text>
                        </View>
                        <View style={styles.expenseDetail}>
                          <Text style={styles.expenseDetailLabel}>Categoria:</Text>
                          <Text style={styles.expenseDetailValue}>{String(item.category ?? '')}</Text>
                        </View>
                        {item.observations && (
                          <View style={styles.expenseDetail}>
                            <Text style={styles.expenseDetailLabel}>Obs:</Text>
                            <Text style={styles.expenseDetailValue}>{String(item.observations ?? '')}</Text>
                          </View>
                        )}
                      </View>
                    </Card>
                  )}
                  style={styles.expensesList}
                />
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateText}>
                    Nenhum pagamento registrado para este mês
                  </Text>
                </View>
              )}
            </View>
          </Card>
        </View>
      </Modal>
    );
  };

  // Persistência com AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('expenses');
        if (saved) {
          try {
            setExpenses(JSON.parse(saved));
          } catch (e) {
            console.warn('Erro ao fazer parse das despesas:', e);
            setExpenses([]);
          }
        }
        const savedPayments = await AsyncStorage.getItem('payments');
        if (savedPayments) {
          try {
            setPayments(JSON.parse(savedPayments));
          } catch (e) {
            console.warn('Erro ao fazer parse dos pagamentos:', e);
            setPayments([]);
          }
        } else {
          setPayments(MOCK_PAYMENTS.map(p => ({ ...p, status: PaymentStatus.PAID })));
        }
      } catch (err) {
        console.warn('Erro ao carregar dados do AsyncStorage:', err);
      }
    })();
  }, []);

  useEffect(() => {
    try {
      AsyncStorage.setItem('expenses', JSON.stringify(expenses));
    } catch (err) {
      console.warn('Erro ao salvar despesas:', err);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      AsyncStorage.setItem('payments', JSON.stringify(payments));
    } catch (err) {
      console.warn('Erro ao salvar pagamentos:', err);
    }
  }, [payments]);

  // Adicione a função de confirmação para deletar pagamentos
  const handleDeletePayment = (paymentId: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este pagamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setPayments(payments.filter(payment => payment.id !== paymentId));
          }
        },
      ]
    );
  };

  // Adicione o modal de filtro de pagamentos, igual ao de despesas
  const renderPaymentFilterModal = () => (
    <Modal
      visible={showPaymentFilterModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowPaymentFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <Card style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrar Pagamentos</Text>
            <TouchableOpacity onPress={() => setShowPaymentFilterModal(false)} style={styles.closeButton}>
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <TouchableOpacity style={styles.dateInputContainer} onPress={() => setShowCalendar('start')}>
              <Text style={styles.dateInputLabel}>Data Inicial</Text>
              <View style={styles.dateInput}>
                <Text style={styles.dateInputText}>{filterPaymentStartDate ? formatDate(filterPaymentStartDate) : 'Selecione'}</Text>
                <Calendar size={20} color={Colors.text.secondary} />
              </View>
            </TouchableOpacity>
            {showCalendar === 'start' && (
              <View style={{ marginBottom: 16 }}>
                <CalendarView
                  onDayPress={(day: { dateString: string }) => {
                    setFilterPaymentStartDate(day.dateString);
                    setShowCalendar(null);
                  }}
                  markedDates={filterPaymentStartDate ? { [filterPaymentStartDate]: { selected: true, selectedColor: Colors.primary.main } } : {}}
                  theme={{
                    todayTextColor: Colors.primary.main,
                    selectedDayBackgroundColor: Colors.primary.main,
                    arrowColor: Colors.primary.main,
                  }}
                />
              </View>
            )}
            <TouchableOpacity style={styles.dateInputContainer} onPress={() => setShowCalendar('end')}>
              <Text style={styles.dateInputLabel}>Data Final</Text>
              <View style={styles.dateInput}>
                <Text style={styles.dateInputText}>{filterPaymentEndDate ? formatDate(filterPaymentEndDate) : 'Selecione'}</Text>
                <Calendar size={20} color={Colors.text.secondary} />
              </View>
            </TouchableOpacity>
            {showCalendar === 'end' && (
              <View style={{ marginBottom: 16 }}>
                <CalendarView
                  onDayPress={(day: { dateString: string }) => {
                    setFilterPaymentEndDate(day.dateString);
                    setShowCalendar(null);
                  }}
                  markedDates={filterPaymentEndDate ? { [filterPaymentEndDate]: { selected: true, selectedColor: Colors.primary.main } } : {}}
                  theme={{
                    todayTextColor: Colors.primary.main,
                    selectedDayBackgroundColor: Colors.primary.main,
                    arrowColor: Colors.primary.main,
                  }}
                />
              </View>
            )}
            <View style={{ marginBottom: 24 }}>
              <Text style={styles.dateInputLabel}>Categoria</Text>
              <TouchableOpacity
                style={[styles.dateInput, { padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                onPress={() => setShowPaymentCategoryModal(true)}
              >
                <Text style={[styles.dateInputText, { color: filterPaymentCategory ? Colors.text.primary : Colors.text.secondary }] }>
                  {filterPaymentCategory || 'Selecionar Categoria'}
                </Text>
                <ArrowDown size={18} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.modalFooter}>
            <Button title="Limpar" variant="outlined" onPress={() => { setFilterPaymentStartDate(null); setFilterPaymentEndDate(null); setFilterPaymentCategory(''); }} style={{ ...styles.modalButton, marginRight: 12 }} />
            <Button title="Aplicar" variant="primary" onPress={() => setShowPaymentFilterModal(false)} style={styles.modalButton} />
          </View>
        </Card>
      </View>
      <Modal
        visible={showPaymentCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentCategoryModal(false)}
      >
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} activeOpacity={1} onPress={() => setShowPaymentCategoryModal(false)} />
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: Colors.background.paper, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 }}>
          <TouchableOpacity
            onPress={() => {
              setFilterPaymentCategory('');
              setShowPaymentCategoryModal(false);
            }}
            style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border.light }}
          >
            <Text style={{ fontSize: 16, color: filterPaymentCategory === '' ? Colors.primary.main : Colors.text.primary }}>Todas</Text>
          </TouchableOpacity>
          {fixedCategories.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => {
                setFilterPaymentCategory(cat);
                setShowPaymentCategoryModal(false);
              }}
              style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border.light }}
            >
              <Text style={{ fontSize: 16, color: filterPaymentCategory === cat ? Colors.primary.main : Colors.text.primary }}>{cat}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setShowPaymentCategoryModal(false)} style={{ paddingVertical: 16 }}>
            <Text style={{ fontSize: 16, color: Colors.error.main, textAlign: 'center' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Modal>
  );

  // Sempre que a aba ativa for 'cashflow', defina selectedYear para o ano atual
  useEffect(() => {
    if (activeTab === 'cashflow') {
      setSelectedYear(new Date().getFullYear());
    }
  }, [activeTab]);

  useEffect(() => {
    if (params.tab && typeof params.tab === 'string') {
      setActiveTab(params.tab as FinanceTab);
    }
  }, [params.tab]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Finanças</Text>
        <DollarSign size={24} color={Colors.primary.main} />
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
          onPress={() => setActiveTab('expenses')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'expenses' && styles.activeTabText,
            ]}
          >
            Despesas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'payments' && styles.activeTab]}
          onPress={() => setActiveTab('payments')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'payments' && styles.activeTabText,
            ]}
          >
            Pagamentos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'cashflow' && styles.activeTab]}
          onPress={() => setActiveTab('cashflow')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'cashflow' && styles.activeTabText,
            ]}
          >
            Fluxo de Caixa
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'annual' && styles.activeTab]}
          onPress={() => setActiveTab('annual')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'annual' && styles.activeTabText,
            ]}
          >
            Fechamento Anual
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'expenses' && renderExpensesTab()}
      {activeTab === 'payments' && renderPaymentsTab()}
      {activeTab === 'cashflow' && renderCashFlowTab()}
      {activeTab === 'annual' && renderAnnualClosingTab()}
      {renderAddExpenseModal()}
      {renderFilterModal()}
      {renderMonthlyExpensesModal()}
      {renderAddPaymentModal()}
      {renderMonthlyPaymentsModal()}
      {renderPaymentFilterModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.l,
    backgroundColor: Colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  screenTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
    color: Colors.text.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.m,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary.main,
  },
  tabText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.primary.main,
  },
  tabContent: {
    flex: 1,
    padding: Spacing.l,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.m,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: Spacing.s,
  },
  filterButton: {
    padding: Spacing.s,
    backgroundColor: Colors.grey[200],
    borderRadius: BorderRadius.s,
    marginRight: Spacing.s,
  },
  expensesList: {
    flex: 1,
  },
  expenseCard: {
    marginBottom: Spacing.m,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  expenseDescription: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    color: Colors.text.primary,
    flex: 1,
  },
  expenseAmount: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.error.main,
  },
  expenseDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: Spacing.s,
  },
  expenseDetail: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  expenseDetailLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.secondary,
    marginRight: Spacing.xs,
    width: 80,
  },
  expenseDetailValue: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text.primary,
  },
  receiptButton: {
    marginTop: Spacing.xs,
  },
  receiptButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.primary.main,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.l,
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.m,
  },
  yearControl: {
    padding: Spacing.s,
  },
  yearText: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
    color: Colors.text.primary,
    marginHorizontal: Spacing.l,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.paper,
    borderRadius: BorderRadius.s,
    padding: Spacing.s,
  },
  periodControl: {
    padding: Spacing.xs,
  },
  periodText: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    color: Colors.text.primary,
    marginHorizontal: Spacing.s,
    minWidth: 80,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  paymentsList: {
    flex: 1,
  },
  paymentCard: {
    marginBottom: Spacing.m,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  paymentUser: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    color: Colors.text.primary,
  },
  paymentStatus: {
    paddingHorizontal: Spacing.s,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
  },
  paymentStatusText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.white,
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  paymentAmount: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.text.primary,
  },
  cashFlowSummary: {
    marginBottom: Spacing.l,
  },
  cashFlowTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: Spacing.m,
    textAlign: 'center',
  },
  cashFlowDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cashFlowItem: {
    flex: 1,
    alignItems: 'center',
  },
  cashFlowLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  cashFlowValue: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
  },
  incomeValue: {
    color: Colors.success.main,
  },
  expenseValue: {
    color: Colors.error.main,
  },
  balanceValue: {
    color: Colors.accent.main,
  },
  chartCard: {
    marginBottom: Spacing.l,
  },
  chartTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: Spacing.m,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: Colors.grey[100],
    borderRadius: BorderRadius.s,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  actionButtons: {
    marginTop: Spacing.m,
  },
  exportButton: {
    alignSelf: 'flex-end',
  },
  expenseHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.s,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: Spacing.l,
  },
  modalContent: {
    backgroundColor: Colors.background.paper,
    borderRadius: BorderRadius.l,
    paddingTop: Spacing.l,
    paddingHorizontal: Spacing.l,
    paddingBottom: 80,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  modalTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  modalBody: {
    marginBottom: 24,
  },
  addExpenseSection: {
    marginBottom: Spacing.l,
  },
  expensesListSection: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: Spacing.m,
  },
  expensesTabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  expensesTab: {
    flex: 1,
    paddingVertical: Spacing.m,
    alignItems: 'center',
  },
  activeExpensesTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary.main,
  },
  expensesTabText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.secondary,
  },
  activeExpensesTabText: {
    color: Colors.primary.main,
  },
  monthlyYearSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.l,
  },
  monthlyExpensesPlaceholder: {
    height: 200,
    backgroundColor: Colors.grey[100],
    borderRadius: BorderRadius.s,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthlyExpensesPlaceholderText: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  monthButtonsGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 16,
  },
  monthColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  monthButton: {
    width: 120,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: Colors.background.paper,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  activeMonthButton: {
    backgroundColor: Colors.primary.light,
    borderColor: Colors.primary.main,
  },
  monthButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.secondary,
  },
  activeMonthButtonText: {
    color: Colors.primary.main,
  },
  dateInputContainer: {
    marginBottom: Spacing.m,
  },
  dateInputLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.s,
    padding: Spacing.s,
    backgroundColor: Colors.background.paper,
  },
  dateInputText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text.primary,
  },
  monthlyExpensesContainer: {
    flex: 1,
    marginTop: Spacing.l,
  },
  monthlyExpensesTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: Spacing.m,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  emptyStateText: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  modalFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: Colors.background.paper,
    borderBottomLeftRadius: BorderRadius.l,
    borderBottomRightRadius: BorderRadius.l,
    padding: Spacing.l,
    gap: Spacing.s,
  },
  modalButton: {
    minWidth: 100,
  },
  annualSummary: {
    marginBottom: Spacing.l,
  },
  membersTable: {
    marginBottom: Spacing.l,
    borderRadius: BorderRadius.s,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.grey[100],
  },
  memberCell: {
    width: 150,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRightWidth: 1,
    borderRightColor: Colors.border.light,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.background.paper,
    paddingLeft: Spacing.s,
    paddingRight: Spacing.s,
  },
  headerText: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.text.primary,
  },
  monthCell: {
    width: 80,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.border.light,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    padding: 0,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  memberName: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary,
  },
  paymentCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paidCell: {
    backgroundColor: Colors.success.light,
  },
  unpaidCell: {
    backgroundColor: Colors.error.light,
  },
  paymentText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary,
  },
  paidText: {
    color: Colors.success.main,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.m,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: BorderRadius.round,
    marginRight: Spacing.s,
  },
  legendText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.secondary,
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.m,
  },
  pieChart: {
    height: 200,
    width: 200,
  },
  pieLegendContainer: {
    flex: 1,
    marginLeft: Spacing.m,
  },
  pieLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  pieLegendBox: {
    width: 16,
    height: 16,
    borderRadius: BorderRadius.round,
    marginRight: Spacing.s,
  },
  pieLegendText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary,
  },
});