import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  NativeSyntheticEvent,
  Alert
} from 'react-native';
import { Calendar, ChevronLeft, ChevronRight, Plus, X, Trash2, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { Calendar as CalendarView } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../../constants/Colors';
import Spacing, { BorderRadius } from '../../constants/Spacing';
import { FontFamily } from '../../constants/Typography';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate?: string;
}

// Mock data
const MOCK_TASKS: Task[] = [];

// Função utilitária para gerar string de data YYYY-MM-DD
function getDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function ActivitiesScreen() {
  const [viewMode, setViewMode] = useState<'calendar' | 'tasks'>('tasks');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedDayTasks, setSelectedDayTasks] = useState<Task[]>([]);

  // Carregar tarefas do AsyncStorage ao abrir o app
  useEffect(() => {
    AsyncStorage.getItem('user_tasks').then(data => {
      if (data) {
        setTasks(JSON.parse(data));
      }
    });
  }, []);

  // Salvar tarefas sempre que tasks mudar
  useEffect(() => {
    AsyncStorage.setItem('user_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Group tasks by status
  const tasksByStatus = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Baixa':
        return Colors.success.main;
      case 'Média':
        return Colors.warning.main;
      case 'Alta':
        return Colors.error.main;
      case 'Urgente':
        return Colors.error.dark;
      default:
        return Colors.grey[500];
    }
  };

  const getStatusColumnTitle = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return 'A Fazer';
      case 'IN_PROGRESS':
        return 'Em Andamento';
      case 'DONE':
        return 'Concluído';
      default:
        return status;
    }
  };

  const getFormattedDate = (dateString?: string) => {
    if (!dateString) return 'Sem data';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const previousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const getMonthName = () => {
    return currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (date: string) => {
    // Usa o horário do meio-dia para evitar problemas de fuso horário
    const newDate = new Date(date + 'T12:00:00');
    setSelectedDate(newDate);
    const tasksForDay = tasks.filter(task => task.dueDate === date);
    setSelectedDayTasks(tasksForDay);
    setShowAddModal(true);
    setShowCalendar(false);
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta atividade?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setTasks(prevTasks => {
              const updatedTasks = prevTasks.filter(task => task.id !== taskId);
              // Atualizar também as tarefas do dia selecionado
              const dayString = selectedDate.toLocaleDateString('en-CA');
              setSelectedDayTasks(updatedTasks.filter(task => task.dueDate === dayString));
              return updatedTasks;
            });
          }
        }
      ]
    );
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      // Salva a data no formato YYYY-MM-DD, exatamente como selecionada
      const dueDate = selectedDate.toISOString().split('T')[0];
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        status: 'TODO',
        dueDate,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setShowAddModal(false);
    }
  };

  const handleMoveTask = (taskId: string, direction: 'left' | 'right') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const statusOrder: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
    const currentIndex = statusOrder.indexOf(task.status);
    
    let newStatus: TaskStatus;
    if (direction === 'right' && currentIndex < statusOrder.length - 1) {
      newStatus = statusOrder[currentIndex + 1];
    } else if (direction === 'left' && currentIndex > 0) {
      newStatus = statusOrder[currentIndex - 1];
    } else {
      return;
    }

    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate.getDate() === day && 
                        selectedDate.getMonth() === currentMonth.getMonth() &&
                        selectedDate.getFullYear() === currentMonth.getFullYear();
      
      const hasTask = tasks.some(task => {
        if (!task.dueDate) return false;
        const [year, month, date] = task.dueDate.split('-').map(Number);
        return year === currentMonth.getFullYear() &&
               month === currentMonth.getMonth() + 1 &&
               date === day;
      });

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isSelected && styles.selectedDay,
            hasTask && styles.dayWithTask
          ]}
          onPress={() => handleDateSelect(getDateString(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day)))}
        >
          <Text style={[
            styles.dayText,
            isSelected && styles.selectedDayText
          ]}>
            {day}
          </Text>
          {hasTask && <View style={styles.taskDot} />}
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.calendarGrid}>
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <Text key={day} style={styles.weekDayText}>{day}</Text>
        ))}
        {days}
      </View>
    );
  };

  const renderAddTaskModal = () => (
    <Modal
      visible={showAddModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowAddModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nova Atividade</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={24} color={Colors.grey[500]} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Input
              label="Título"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="Digite o título da atividade"
            />

            <View style={styles.dateInputContainer}>
              <Text style={styles.inputLabel}>Data</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowCalendar(true)}
              >
                <Text style={styles.dateInputText}>
                  {selectedDate.toLocaleDateString('pt-BR')}
                </Text>
                <Calendar size={20} color={Colors.grey[500]} />
              </TouchableOpacity>
            </View>

            {showCalendar && (
              <View style={styles.calendarContainer}>
                <CalendarView
                  current={selectedDate.toISOString().split('T')[0]}
                  onDayPress={(day) => handleDateSelect(day.dateString)}
                  markedDates={{
                    [selectedDate.toISOString().split('T')[0]]: {
                      selected: true,
                      selectedColor: Colors.primary.main
                    }
                  }}
                  theme={{
                    calendarBackground: Colors.background,
                    textSectionTitleColor: Colors.text.primary,
                    selectedDayBackgroundColor: Colors.primary.main,
                    selectedDayTextColor: Colors.white,
                    todayTextColor: Colors.primary.main,
                    dayTextColor: Colors.text.primary,
                    textDisabledColor: Colors.grey[400],
                    dotColor: Colors.primary.main,
                    selectedDotColor: Colors.white,
                    arrowColor: Colors.primary.main,
                    monthTextColor: Colors.text.primary,
                    indicatorColor: Colors.primary.main,
                    textDayFontFamily: FontFamily.regular,
                    textMonthFontFamily: FontFamily.medium,
                    textDayHeaderFontFamily: FontFamily.medium,
                    textDayFontSize: 14,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 14
                  }}
                />
              </View>
            )}
          </View>

          <View style={styles.modalFooter}>
            <Button
              title="Adicionar"
              onPress={handleAddTask}
              style={styles.modalButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Atividades</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'calendar' && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode('calendar')}
          >
            <Calendar size={20} color={viewMode === 'calendar' ? Colors.white : Colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'tasks' && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode('tasks')}
          >
            <Text style={viewMode === 'tasks' ? styles.toggleTextActive : styles.toggleText}>
              Tarefas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'calendar' ? (
        <View style={styles.calendarContainer}>
          <View style={styles.monthSelector}>
            <TouchableOpacity onPress={previousMonth}>
              <ChevronLeft size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.monthText}>{getMonthName()}</Text>
            <TouchableOpacity onPress={nextMonth}>
              <ChevronRight size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
          {renderCalendar()}
        </View>
      ) : (
        <View style={styles.taskBoardContainer}>
          <ScrollView horizontal contentContainerStyle={styles.taskBoard}>
            {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((status) => (
              <View key={status} style={styles.taskColumn}>
                <View style={styles.columnHeader}>
                  <Text style={styles.columnTitle}>{getStatusColumnTitle(status)}</Text>
                  <Text style={styles.taskCount}>{tasksByStatus[status]?.length || 0}</Text>
                </View>

                <ScrollView style={styles.taskList}>
                  {tasksByStatus[status]?.map((task) => (
                    <Card key={task.id} style={styles.taskCard}>
                      <View style={styles.taskHeader}>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        <View style={styles.taskActions}>
                          {status !== 'TODO' && (
                            <TouchableOpacity
                              onPress={() => handleMoveTask(task.id, 'left')}
                              style={styles.moveButton}
                            >
                              <ArrowLeft size={16} color={Colors.primary.main} />
                            </TouchableOpacity>
                          )}
                          {status !== 'DONE' && (
                            <TouchableOpacity
                              onPress={() => handleMoveTask(task.id, 'right')}
                              style={styles.moveButton}
                            >
                              <ArrowRight size={16} color={Colors.primary.main} />
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            onPress={() => handleDeleteTask(task.id)}
                            style={styles.deleteButton}
                          >
                            <Trash2 size={16} color={Colors.error.main} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      
                      {task.dueDate && (
                        <View style={styles.taskFooter}>
                          <Text style={styles.taskDueDate}>
                            Data: {task.dueDate ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR') : ''}
                          </Text>
                        </View>
                      )}
                    </Card>
                  ))}
                </ScrollView>

                {status === 'TODO' && (
                  <Button
                    title="Adicionar Tarefa"
                    variant="outlined"
                    size="small"
                    onPress={() => {
                      setSelectedDate(new Date());
                      setShowAddModal(true);
                    }}
                    icon={<Plus size={16} color={Colors.primary.main} />}
                    style={styles.addTaskButton}
                  />
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {renderAddTaskModal()}
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
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.grey[200],
    borderRadius: BorderRadius.round,
    padding: 4,
  },
  toggleButton: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary.main,
  },
  toggleText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary,
  },
  toggleTextActive: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.white,
  },
  calendarContainer: {
    flex: 1,
    padding: Spacing.l,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  monthText: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.text.primary,
    textTransform: 'capitalize',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Colors.background.paper,
    borderRadius: BorderRadius.m,
    padding: Spacing.s,
  },
  weekDayText: {
    width: '14.28%',
    textAlign: 'center',
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: Spacing.s,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xs,
  },
  selectedDay: {
    backgroundColor: Colors.primary.main,
    borderRadius: BorderRadius.round,
  },
  dayWithTask: {
    position: 'relative',
  },
  dayText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary,
  },
  selectedDayText: {
    color: Colors.white,
  },
  taskDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary.main,
  },
  taskBoardContainer: {
    flex: 1,
  },
  taskBoard: {
    padding: Spacing.l,
  },
  taskColumn: {
    width: 280,
    marginRight: Spacing.l,
    backgroundColor: Colors.grey[100],
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    maxHeight: '100%',
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  columnTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.text.primary,
  },
  taskCount: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.secondary,
    backgroundColor: Colors.grey[200],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
  },
  taskList: {
    maxHeight: '80%',
  },
  taskCard: {
    marginBottom: Spacing.s,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  taskTitle: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  taskFooter: {
    marginTop: Spacing.xs,
  },
  taskDueDate: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.text.secondary,
  },
  addTaskButton: {
    marginTop: Spacing.m,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.l,
    width: '90%',
    maxWidth: 500,
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
  modalBody: {
    marginBottom: Spacing.l,
  },
  inputLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: Spacing.s,
  },
  dateInputContainer: {
    marginBottom: Spacing.md,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.grey[300],
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.white,
  },
  dateInputText: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: FontFamily.regular,
  },
  calendarContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    marginTop: Spacing.l,
  },
  modalButton: {
    minWidth: 100,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moveButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.s,
  },
  deleteButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.s,
  },
});