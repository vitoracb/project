import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Modal,
  TextInput
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ChartBar as BarChart, Calendar, Clock, DollarSign, FileText, MessageSquare, Briefcase, Bell } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../../constants/Colors';
import Spacing, { BorderRadius } from '../../constants/Spacing';
import { FontFamily } from '../../constants/Typography';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';

export default function DashboardScreen() {
  const { user } = useAuth();

  const notifications = [
    { id: '1', title: 'Pagamento pendente', description: 'Mensalidade de Julho ainda não foi paga', type: 'payment' },
    { id: '2', title: 'Nova tarefa', description: 'Manutenção da cerca foi adicionada', type: 'task' },
    { id: '3', title: 'Novo documento', description: 'João adicionou um novo mapa da propriedade', type: 'document' },
  ];

  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [financeYear, setFinanceYear] = useState(new Date().getFullYear());
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '' });
  const [events, setEvents] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Tela inicial ganhou foco, recarregando tarefas recentes...');
      (async () => {
        const data = await AsyncStorage.getItem('user_tasks');
        if (data) {
          const tasks = JSON.parse(data);
          // Ordena por id (timestamp) decrescente e pega as 3 mais recentes
          const sorted = [...tasks].sort((a, b) => Number(b.id) - Number(a.id));
          setRecentTasks(sorted.slice(0, 3));
        } else {
          setRecentTasks([]);
        }
      })();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const expensesData = await AsyncStorage.getItem('expenses');
        setExpenses(expensesData ? JSON.parse(expensesData) : []);
        const paymentsData = await AsyncStorage.getItem('payments');
        setPayments(paymentsData ? JSON.parse(paymentsData) : []);
      })();
    }, [])
  );

  // Calcular receitas, despesas e saldo do ano atual
  const totalExpense = expenses.filter(e => {
    if (!e.date) return false;
    const [year] = String(e.date).split('-');
    return Number(year) === financeYear;
  }).reduce((sum, e) => sum + Number(e.amount ?? 0), 0);

  const totalIncome = payments.filter(p => {
    if (!p.date) return false;
    const [year] = String(p.date).split('-');
    return Number(year) === financeYear;
  }).reduce((sum, p) => sum + Number(p.amount ?? 0), 0);

  const balance = totalIncome - totalExpense;

  const upcomingEvents = [
    { id: '1', title: 'Reunião de proprietários', date: '15/08/2023', time: '15:00' },
    { id: '2', title: 'Visita do agrônomo', date: '20/08/2023', time: '09:30' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.warning.main;
      case 'in-progress':
        return Colors.accent.main;
      case 'completed':
        return Colors.success.main;
      default:
        return Colors.grey[500];
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign size={20} color={Colors.warning.main} />;
      case 'task':
        return <Briefcase size={20} color={Colors.accent.main} />;
      case 'document':
        return <FileText size={20} color={Colors.success.main} />;
      default:
        return <Bell size={20} color={Colors.primary.main} />;
    }
  };

  const navigateToModule = (module: string) => {
    router.push(`/(tabs)/${module}`);
  };

  // Carregar eventos do AsyncStorage
  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem('user_events');
      if (data) {
        setEvents(JSON.parse(data));
      } else {
        setEvents([]);
      }
    })();
  }, []);

  // Salvar eventos sempre que mudar
  useEffect(() => {
    AsyncStorage.setItem('user_events', JSON.stringify(events));
  }, [events]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Olá, {user?.name || 'Usuário'}</Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </Text>
        </View>
        {user?.profileImage && (
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Image
              source={{ uri: user.profileImage }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.modulesContainer}>
        <Text style={styles.sectionTitle}>Módulos</Text>
        <View style={styles.modules}>
          <TouchableOpacity 
            style={styles.moduleCard} 
            onPress={() => navigateToModule('activities')}
          >
            <Calendar size={32} color={Colors.accent.main} />
            <Text style={styles.moduleText}>Atividades</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.moduleCard}
            onPress={() => navigateToModule('finances')}
          >
            <DollarSign size={32} color={Colors.success.main} />
            <Text style={styles.moduleText}>Finanças</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.moduleCard}
            onPress={() => navigateToModule('documents')}
          >
            <FileText size={32} color={Colors.secondary.main} />
            <Text style={styles.moduleText}>Documentos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.moduleCard}
            onPress={() => navigateToModule('comments')}
          >
            <MessageSquare size={32} color={Colors.warning.main} />
            <Text style={styles.moduleText}>Comentários</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        
        {notifications.map(notification => (
          <Card key={notification.id} style={styles.notificationCard}>
            <View style={styles.notificationContainer}>
              <View style={styles.notificationIconContainer}>
                {getNotificationIcon(notification.type)}
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationDescription}>{notification.description}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.rowContainer}>
        <View style={[styles.section, styles.halfSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tarefas Recentes</Text>
            <TouchableOpacity style={{ paddingHorizontal: 8, paddingVertical: 4 }} onPress={() => navigateToModule('activities')}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          {recentTasks.map(task => (
            <Card key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View 
                  style={[
                    styles.statusIndicator, 
                    { backgroundColor: getStatusColor(task.status) }
                  ]} 
                />
              </View>
              <View style={styles.taskFooter}>
                <Clock size={14} color={Colors.text.secondary} />
                <Text style={styles.taskDueDate}>{task.dueDate}</Text>
              </View>
            </Card>
          ))}
        </View>

        <View style={[styles.section, styles.halfSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos Eventos</Text>
            <TouchableOpacity onPress={() => setShowAddEventModal(true)}>
              <Text style={styles.seeAllText}>Adicionar Evento</Text>
            </TouchableOpacity>
          </View>
          
          {events.map(event => (
            <Card key={event.id} style={styles.eventCard}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.eventDetails}>
                <View style={styles.eventDetailItem}>
                  <Calendar size={14} color={Colors.text.secondary} />
                  <Text style={styles.eventDetailText}>{event.date}</Text>
                </View>
                <View style={styles.eventDetailItem}>
                  <Clock size={14} color={Colors.text.secondary} />
                  <Text style={styles.eventDetailText}>{event.time}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/finances', params: { tab: 'cashflow' } })}>
            <Text style={styles.seeAllText}>Ver detalhes</Text>
          </TouchableOpacity>
        </View>
        
        <Card style={styles.financeCard}>
          <View style={styles.financeRow}>
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Receitas</Text>
              <Text style={[styles.financeValue, styles.incomeValue]}>{totalIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
            </View>
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Despesas</Text>
              <Text style={[styles.financeValue, styles.expenseValue]}>{totalExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
            </View>
          </View>
          <View style={styles.financeRow}>
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Balanço</Text>
              <Text style={[styles.financeValue, styles.balanceValue]}>{balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Modal para adicionar evento */}
      {showAddEventModal && (
        <Modal
          visible={showAddEventModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAddEventModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: Colors.white, borderRadius: 12, padding: 24, width: '90%', maxWidth: 400 }}>
              <Text style={{ fontFamily: FontFamily.bold, fontSize: 18, marginBottom: 16 }}>Novo Evento</Text>
              <TextInput
                placeholder="Título do evento"
                value={newEvent.title}
                onChangeText={text => setNewEvent({ ...newEvent, title: text })}
                style={{ borderWidth: 1, borderColor: Colors.grey[300], borderRadius: 8, padding: 8, marginBottom: 12 }}
              />
              <TextInput
                placeholder="Data (DD/MM/AAAA)"
                value={newEvent.date}
                onChangeText={text => setNewEvent({ ...newEvent, date: text })}
                style={{ borderWidth: 1, borderColor: Colors.grey[300], borderRadius: 8, padding: 8, marginBottom: 12 }}
              />
              <TextInput
                placeholder="Horário (ex: 14:00)"
                value={newEvent.time}
                onChangeText={text => setNewEvent({ ...newEvent, time: text })}
                style={{ borderWidth: 1, borderColor: Colors.grey[300], borderRadius: 8, padding: 8, marginBottom: 16 }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
                <TouchableOpacity onPress={() => setShowAddEventModal(false)}>
                  <Text style={{ color: Colors.error.main, fontFamily: FontFamily.medium, fontSize: 16 }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (!newEvent.title || !newEvent.date) return;
                    setEvents([{ ...newEvent, id: Date.now().toString() }, ...events]);
                    setNewEvent({ title: '', date: '', time: '' });
                    setShowAddEventModal(false);
                  }}
                >
                  <Text style={{ color: Colors.primary.main, fontFamily: FontFamily.bold, fontSize: 16 }}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
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
    backgroundColor: Colors.primary.main,
    padding: Spacing.l,
    paddingTop: Spacing.xxl,
  },
  welcomeText: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  dateText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.primary.light,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  modulesContainer: {
    padding: Spacing.l,
  },
  modules: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: Spacing.s,
  },
  moduleCard: {
    width: '48%',
    backgroundColor: Colors.background.paper,
    borderRadius: BorderRadius.m,
    padding: Spacing.l,
    alignItems: 'center',
    marginBottom: Spacing.m,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  moduleText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary,
    marginTop: Spacing.s,
  },
  section: {
    padding: Spacing.l,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.s,
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.text.primary,
  },
  seeAllText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.primary.main,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
    textAlign: 'right',
  },
  notificationCard: {
    marginBottom: Spacing.s,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.grey[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  notificationDescription: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.text.secondary,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.l,
  },
  halfSection: {
    width: '48%',
    padding: 0,
  },
  taskCard: {
    marginBottom: Spacing.s,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  taskTitle: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDueDate: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  eventCard: {
    marginBottom: Spacing.s,
  },
  eventTitle: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  eventDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  eventDetailText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  financeCard: {
    padding: Spacing.m,
  },
  financeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.s,
  },
  financeItem: {
    flex: 1,
  },
  financeLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  financeValue: {
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
});