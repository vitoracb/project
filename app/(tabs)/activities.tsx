import React, { useState } from 'react';
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
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

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
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
}

// Mock data
const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Manutenção da cerca norte', status: 'TODO', priority: 'HIGH', dueDate: '2023-08-15' },
  { id: '2', title: 'Comprar sementes de milho', status: 'TODO', priority: 'MEDIUM', dueDate: '2023-08-20' },
  { id: '3', title: 'Coordenar plantio', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2023-08-25' },
  { id: '4', title: 'Reunião com agrônomo', status: 'IN_PROGRESS', priority: 'MEDIUM', dueDate: '2023-08-18' },
  { id: '5', title: 'Pagar conta de energia', status: 'DONE', priority: 'HIGH', dueDate: '2023-08-10' },
  { id: '6', title: 'Contratar serviço de irrigação', status: 'DONE', priority: 'LOW', dueDate: '2023-08-05' },
];

export default function ActivitiesScreen() {
  const [viewMode, setViewMode] = useState<'calendar' | 'tasks'>('tasks');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

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
      case 'LOW':
        return Colors.success.main;
      case 'MEDIUM':
        return Colors.warning.main;
      case 'HIGH':
        return Colors.error.main;
      case 'URGENT':
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

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth);
    newDate.setDate(day);
    setSelectedDate(newDate);
    setShowAddModal(true);
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
            setTasks(tasks.filter(task => task.id !== taskId));
          }
        }
      ]
    );
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        status: 'TODO',
        priority: newTaskPriority,
        dueDate: selectedDate.toISOString().split('T')[0],
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
        const taskDate = new Date(task.dueDate || '');
        return taskDate.getDate() === day && 
               taskDate.getMonth() === currentMonth.getMonth() &&
               taskDate.getFullYear() === currentMonth.getFullYear();
      });

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isSelected && styles.selectedDay,
            hasTask && styles.dayWithTask
          ]}
          onPress={() => handleDateSelect(day)}
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
                        <View 
                          style={[
                            styles.priorityIndicator, 
                            { backgroundColor: getPriorityColor(task.priority) }
                          ]} 
                        />
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
                            Data: {getFormattedDate(task.dueDate)}
                          </Text>
                        </View>
                      )}
                    </Card>
                  ))}
                </ScrollView>

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
              </View>
            ))}
          </ScrollView>
        </View>
      )}

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
                <X size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <Input
              placeholder="Título da atividade"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              containerStyle={styles.input}
            />

            <View style={styles.priorityContainer}>
              <Text style={styles.priorityLabel}>Prioridade:</Text>
              <View style={styles.priorityButtons}>
                {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      newTaskPriority === priority && styles.priorityButtonActive,
                      { borderColor: getPriorityColor(priority) }
                    ]}
                    onPress={() => setNewTaskPriority(priority)}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      newTaskPriority === priority && styles.priorityButtonTextActive,
                      { color: getPriorityColor(priority) }
                    ]}>
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>Data:</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {selectedDate.toLocaleDateString('pt-BR')}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event: DateTimePickerEvent, date?: Date) => {
                  setShowDatePicker(false);
                  if (date) setSelectedDate(date);
                }}
              />
            )}

            <View style={styles.modalFooter}>
              <Button
                title="Cancelar"
                variant="outlined"
                onPress={() => setShowAddModal(false)}
                style={styles.modalButton}
              />
              <Button
                title="Adicionar"
                onPress={handleAddTask}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  priorityIndicator: {
    width: 3,
    height: '100%',
    borderRadius: 2,
    marginRight: Spacing.s,
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
    width: '90%',
    backgroundColor: Colors.background.paper,
    borderRadius: BorderRadius.m,
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
  input: {
    marginBottom: Spacing.m,
  },
  priorityContainer: {
    marginBottom: Spacing.m,
  },
  priorityLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: Spacing.s,
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderWidth: 1,
    borderRadius: BorderRadius.s,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: Colors.primary.light,
  },
  priorityButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
  },
  priorityButtonTextActive: {
    color: Colors.primary.main,
  },
  dateContainer: {
    marginBottom: Spacing.l,
  },
  dateLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: Spacing.s,
  },
  dateButton: {
    padding: Spacing.s,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.s,
  },
  dateButtonText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text.primary,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    marginLeft: Spacing.m,
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