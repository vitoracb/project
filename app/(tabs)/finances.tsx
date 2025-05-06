import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { DollarSign, Filter, Plus, Search, ArrowDown, ArrowUp, Trash2, X } from 'lucide-react-native';

import Colors from '../../constants/Colors';
import Spacing, { BorderRadius } from '../../constants/Spacing';
import { FontFamily } from '../../constants/Typography';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

// Mock data for expenses
const MOCK_EXPENSES = [
  { 
    id: '1', 
    description: 'Fertilizantes', 
    amount: 2500.0, 
    date: '2023-08-10',
    category: 'Insumos',
    receipt: null,
  },
  { 
    id: '2', 
    description: 'Manutenção do trator', 
    amount: 1200.0, 
    date: '2023-08-05',
    category: 'Maquinário',
    receipt: 'receipt_url.pdf',
  },
  { 
    id: '3', 
    description: 'Sementes', 
    amount: 3500.0, 
    date: '2023-07-25',
    category: 'Insumos',
    receipt: null,
  },
  { 
    id: '4', 
    description: 'Mão de obra', 
    amount: 5000.0, 
    date: '2023-07-20',
    category: 'Pessoal',
    receipt: null,
  },
  { 
    id: '5', 
    description: 'Conta de energia', 
    amount: 750.0, 
    date: '2023-07-15',
    category: 'Utilidades',
    receipt: 'receipt_url.pdf',
  },
];

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

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

type FinanceTab = 'expenses' | 'payments' | 'cashflow' | 'annual';

export default function FinancesScreen() {
  const [activeTab, setActiveTab] = useState<FinanceTab>('expenses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
  });
  const [monthlyPayments, setMonthlyPayments] = useState(MOCK_MONTHLY_PAYMENTS);

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

            <Input
              label="Data"
              value={newExpense.date}
              onChangeText={(text) => setNewExpense({ ...newExpense, date: text })}
              placeholder="YYYY-MM-DD"
            />

            <Input
              label="Categoria"
              value={newExpense.category}
              onChangeText={(text) => setNewExpense({ ...newExpense, category: text })}
              placeholder="Digite a categoria"
            />
          </View>

          <View style={styles.modalFooter}>
            <Button
              title="Cancelar"
              variant="outlined"
              onPress={() => setIsAddModalVisible(false)}
              style={styles.modalButton}
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
    </Modal>
  );

  const renderExpensesTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.searchContainer}>
          <Input
            placeholder="Buscar despesas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={20} color={Colors.text.secondary} />}
            containerStyle={styles.searchInput}
          />
          <TouchableOpacity style={styles.filterButton}>
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
          data={expenses}
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
    return (
      <View style={styles.tabContent}>
        <View style={styles.periodSelector}>
          <View style={styles.yearSelector}>
            <TouchableOpacity 
              onPress={() => handleSetYear(selectedYear - 1)}
              style={styles.periodControl}
            >
              <ArrowDown size={20} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.periodText}>{selectedYear}</Text>
            <TouchableOpacity 
              onPress={() => handleSetYear(selectedYear + 1)}
              style={styles.periodControl}
            >
              <ArrowUp size={20} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.monthSelector}>
            <TouchableOpacity 
              onPress={() => setSelectedMonth(selectedMonth > 1 ? selectedMonth - 1 : 12)}
              style={styles.periodControl}
            >
              <ArrowDown size={20} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.periodText}>{getMonthName(selectedMonth)}</Text>
            <TouchableOpacity 
              onPress={() => setSelectedMonth(selectedMonth < 12 ? selectedMonth + 1 : 1)}
              style={styles.periodControl}
            >
              <ArrowUp size={20} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={MOCK_PAYMENTS.filter(p => p.year === selectedYear && p.month === selectedMonth)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <Text style={styles.paymentUser}>{item.userName}</Text>
                <View style={[styles.paymentStatus, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.paymentStatusText}>{getStatusLabel(item.status)}</Text>
                </View>
              </View>
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentAmount}>{formatCurrency(item.amount)}</Text>
                <Button
                  title={item.status === 'PAID' ? 'Marcado' : 'Marcar Pago'}
                  variant={item.status === 'PAID' ? 'text' : 'primary'}
                  size="small"
                  disabled={item.status === 'PAID'}
                  onPress={() => console.log('Mark as paid', item.id)}
                />
              </View>
            </Card>
          )}
          style={styles.paymentsList}
        />
      </View>
    );
  };

  const renderCashFlowTab = () => {
    return (
      <View style={styles.tabContent}>
        <Card style={styles.cashFlowSummary}>
          <Text style={styles.cashFlowTitle}>Resumo Financeiro</Text>
          <View style={styles.cashFlowDetails}>
            <View style={styles.cashFlowItem}>
              <Text style={styles.cashFlowLabel}>Receitas</Text>
              <Text style={[styles.cashFlowValue, styles.incomeValue]}>
                {formatCurrency(MOCK_CASH_FLOW.totalIncome)}
              </Text>
            </View>
            <View style={styles.cashFlowItem}>
              <Text style={styles.cashFlowLabel}>Despesas</Text>
              <Text style={[styles.cashFlowValue, styles.expenseValue]}>
                {formatCurrency(MOCK_CASH_FLOW.totalExpense)}
              </Text>
            </View>
            <View style={styles.cashFlowItem}>
              <Text style={styles.cashFlowLabel}>Balanço</Text>
              <Text style={[styles.cashFlowValue, styles.balanceValue]}>
                {formatCurrency(MOCK_CASH_FLOW.balance)}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Fluxo de Caixa Mensal</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>
              Gráfico será implementado na próxima versão
            </Text>
          </View>
        </Card>

        <View style={styles.actionButtons}>
          <Button
            title="Exportar Relatório"
            variant="outlined"
            onPress={() => console.log('Export report')}
            style={styles.exportButton}
          />
        </View>
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
                          monthlyPayments[selectedYear][member.id][month] && styles.paidCell
                        ]}
                        onPress={() => handlePaymentToggle(member.id, month)}
                      >
                        <Text style={[
                          styles.paymentText,
                          monthlyPayments[selectedYear][member.id][month] && styles.paidText
                        ]}>
                          {monthlyPayments[selectedYear][member.id][month] ? '✓' : ''}
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
    padding: Spacing.l,
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
    marginBottom: Spacing.l,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  tableContainer: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.grey[100],
  },
  headerCell: {
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
  headerText: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.text.primary,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
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
  memberName: {
    fontFamily: FontFamily.medium,
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
  paymentCell: {
    backgroundColor: Colors.grey[50],
  },
  paidCell: {
    backgroundColor: Colors.success.light,
  },
  unpaidCell: {
    backgroundColor: Colors.grey[50],
  },
  paymentText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  paidText: {
    color: Colors.success.main,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.m,
    gap: Spacing.l,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.s,
  },
  legendText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.secondary,
  },
});