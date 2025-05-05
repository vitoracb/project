import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { router } from 'expo-router';
import { ChartBar as BarChart, Calendar, Clock, DollarSign, FileText, MessageSquare, Briefcase, Bell } from 'lucide-react-native';

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

  const recentTasks = [
    { id: '1', title: 'Manutenção da cerca', status: 'pending', dueDate: '15/08/2023' },
    { id: '2', title: 'Plantio de milho', status: 'in-progress', dueDate: '20/08/2023' },
    { id: '3', title: 'Colheita de café', status: 'completed', dueDate: '10/08/2023' },
  ];

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
          <Image
            source={{ uri: user.profileImage }}
            style={styles.profileImage}
          />
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
            <TouchableOpacity onPress={() => navigateToModule('activities')}>
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
                <Text style={styles.taskDueDate}>Vencimento: {task.dueDate}</Text>
              </View>
            </Card>
          ))}
        </View>

        <View style={[styles.section, styles.halfSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos Eventos</Text>
            <TouchableOpacity onPress={() => navigateToModule('activities')}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingEvents.map(event => (
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
          <TouchableOpacity onPress={() => navigateToModule('finances')}>
            <Text style={styles.seeAllText}>Ver detalhes</Text>
          </TouchableOpacity>
        </View>
        
        <Card style={styles.financeCard}>
          <View style={styles.financeRow}>
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Receitas</Text>
              <Text style={[styles.financeValue, styles.incomeValue]}>R$ 15.000,00</Text>
            </View>
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Despesas</Text>
              <Text style={[styles.financeValue, styles.expenseValue]}>R$ 8.750,00</Text>
            </View>
          </View>
          <View style={styles.financeRow}>
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Balanço</Text>
              <Text style={[styles.financeValue, styles.balanceValue]}>R$ 6.250,00</Text>
            </View>
          </View>
          <View style={styles.chartPlaceholder}>
            <BarChart size={24} color={Colors.text.secondary} />
            <Text style={styles.chartPlaceholderText}>Gráfico de Fluxo de Caixa</Text>
          </View>
        </Card>
      </View>
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
  chartPlaceholder: {
    height: 100,
    backgroundColor: Colors.grey[100],
    borderRadius: BorderRadius.s,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.m,
  },
  chartPlaceholderText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
});