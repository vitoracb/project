import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import { DollarSign, Filter, Plus, Search, ArrowDown, ArrowUp, Trash2 } from 'lucide-react-native';

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

type FinanceTab = 'expenses' | 'payments' | 'cashflow';

export default function FinancesScreen() {
  const [activeTab, setActiveTab] = useState<FinanceTab>('expenses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState(2023);
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);

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
            onPress={() => console.log('Add expense')}
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
              onPress={() => setSelectedYear(selectedYear - 1)}
              style={styles.periodControl}
            >
              <ArrowDown size={20} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.periodText}>{selectedYear}</Text>
            <TouchableOpacity 
              onPress={() => setSelectedYear(selectedYear + 1)}
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
      </View>

      {activeTab === 'expenses' && renderExpensesTab()}
      {activeTab === 'payments' && renderPaymentsTab()}
      {activeTab === 'cashflow' && renderCashFlowTab()}
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
    backgroundColor: Colors.background.paper,
    borderRadius: BorderRadius.s,
    padding: Spacing.s,
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
});