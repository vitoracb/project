import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert
} from 'react-native';
import { 
  Send, 
  Image as ImageIcon, 
  Paperclip,
  Heart,
  MessageSquare,
  AtSign,
  Trash2
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../../constants/Colors';
import Spacing, { BorderRadius } from '../../constants/Spacing';
import { FontFamily } from '../../constants/Typography';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  userName: string;
  userImage: string;
  likes: number;
  replies: number;
  hasImage: boolean;
  imageUrl?: string;
  replyTo?: string;
  children?: Comment[];
}

// Mock comments data
const MOCK_COMMENTS = [
  {
    id: '1',
    content: 'Pessoal, precisamos marcar uma reunião para discutir os planos de plantio do próximo semestre. O que acham de marcarmos para o próximo sábado?',
    createdAt: '2023-08-09T10:30:00Z',
    userId: '1',
    userName: 'João Silva',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    likes: 3,
    replies: 2,
    hasImage: false,
  },
  {
    id: '2',
    content: 'Acabei de passar pela divisa norte e notei que parte da cerca está danificada. @João acho que precisamos providenciar o reparo o quanto antes.',
    createdAt: '2023-08-08T16:45:00Z',
    userId: '2',
    userName: 'Maria Oliveira',
    userImage: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
    likes: 5,
    replies: 1,
    hasImage: true,
    imageUrl: 'https://images.pexels.com/photos/111362/pexels-photo-111362.jpeg',
  },
  {
    id: '3',
    content: 'O pagamento referente à colheita do mês passado já foi depositado. Por favor, confirmem se todos receberam.',
    createdAt: '2023-08-07T09:15:00Z',
    userId: '3',
    userName: 'Pedro Santos',
    userImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    likes: 7,
    replies: 0,
    hasImage: false,
  },
  {
    id: '4',
    content: 'Atualizei os documentos de registro da propriedade na pasta de Documentos. @Maria @Pedro, por favor, verifiquem se está tudo correto.',
    createdAt: '2023-08-06T14:20:00Z',
    userId: '1',
    userName: 'João Silva',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    likes: 2,
    replies: 3,
    hasImage: false,
  },
  {
    id: '5',
    content: 'O técnico agrícola virá na próxima terça-feira para fazer a análise do solo. Alguém consegue estar presente para acompanhá-lo?',
    createdAt: '2023-08-05T11:30:00Z',
    userId: '4',
    userName: 'Ana Souza',
    userImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    likes: 4,
    replies: 5,
    hasImage: false,
  },
];

export default function CommentsScreen() {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    (async () => {
      setRefreshing(true);
      const saved = await AsyncStorage.getItem('comments');
      if (saved) setComments(JSON.parse(saved));
      setRefreshing(false);
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      content: newComment,
      createdAt: new Date().toISOString(),
      userId: user?.id || '1',
      userName: user?.name || 'Usuário',
      userImage: user?.profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      likes: 0,
      replies: 0,
      hasImage: false,
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleLikeComment = (id: string) => {
    setComments(
      comments.map(comment => 
        comment.id === id 
          ? { ...comment, likes: comment.likes + 1 } 
          : comment
      )
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) {
      return 'agora mesmo';
    } else if (diffMin < 60) {
      return `${diffMin} min atrás`;
    } else if (diffHour < 24) {
      return `${diffHour} h atrás`;
    } else if (diffDay < 30) {
      return `${diffDay} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const highlightMentions = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <Text key={index} style={styles.mention}>
            {part}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  const handleDeleteComment = (commentId: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este comentário?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setComments(comments.filter(comment => comment.id !== commentId));
          }
        }
      ]
    );
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;
    const reply: Comment = {
      id: Date.now().toString(),
      content: replyText,
      createdAt: new Date().toISOString(),
      userId: user?.id || '1',
      userName: user?.name || 'Usuário',
      userImage: user?.profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      likes: 0,
      replies: 0,
      hasImage: false,
      replyTo: parentId,
    };
    setComments(prev => prev.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: (comment.replies || 0) + 1,
          children: comment.children ? [reply, ...comment.children] : [reply],
        };
      }
      return comment;
    }));
    setReplyingTo(null);
    setReplyText('');
  };

  const renderReplies = (children?: Comment[]) => {
    if (!children || children.length === 0) return null;
    return (
      <View style={{ marginLeft: 32, marginTop: 8 }}>
        {children.map(reply => (
          <View key={reply.id} style={styles.commentContainer}>
            <View style={styles.commentHeader}>
              <Image source={{ uri: reply.userImage }} style={styles.userImage} />
              <View style={styles.commentHeaderInfo}>
                <Text style={styles.userName}>{reply.userName}</Text>
                <Text style={styles.timeAgo}>{formatTimeAgo(reply.createdAt)}</Text>
              </View>
            </View>
            <View style={styles.commentContent}>
              <Text style={styles.commentText}>{highlightMentions(reply.content)}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderComment = ({ item }: { item: typeof comments[0] }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Image source={{ uri: item.userImage }} style={styles.userImage} />
        <View style={styles.commentHeaderInfo}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.timeAgo}>{formatTimeAgo(item.createdAt)}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteComment(item.id)}
          style={styles.deleteButton}
        >
          <Trash2 size={16} color={Colors.error.main} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.commentContent}>
        <Text style={styles.commentText}>
          {highlightMentions(item.content)}
        </Text>
        
        {item.hasImage && item.imageUrl && (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.commentImage} 
            resizeMode="cover"
          />
        )}
      </View>
      
      <View style={styles.commentActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLikeComment(item.id)}
        >
          <Heart size={16} color={Colors.text.secondary} />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setReplyingTo(item.id)}
        >
          <MessageSquare size={16} color={Colors.text.secondary} />
          <Text style={styles.actionText}>{item.replies}</Text>
        </TouchableOpacity>
      </View>
      {replyingTo === item.id && (
        <View style={{ marginTop: 8 }}>
          <Input
            placeholder="Responder..."
            value={replyText}
            onChangeText={setReplyText}
            containerStyle={styles.input}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={() => setReplyingTo(null)} style={{ marginRight: 8 }}>
              <Text style={{ color: Colors.text.secondary }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAddReply(item.id)}>
              <Text style={{ color: Colors.primary.main, fontWeight: 'bold' }}>Comentar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {renderReplies(item.children)}
    </View>
  );

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setComments(MOCK_COMMENTS);
      setRefreshing(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Comentários</Text>
      </View>

      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.commentsList}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      <View style={styles.composer}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Escreva um comentário..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            containerStyle={styles.input}
          />
          <View style={styles.composerActions}>
            <TouchableOpacity style={styles.composerButton}>
              <ImageIcon size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.composerButton}>
              <Paperclip size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.composerButton}>
              <AtSign size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            !newComment.trim() && styles.sendButtonDisabled
          ]}
          onPress={handleAddComment}
          disabled={!newComment.trim()}
        >
          <Send size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
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
  commentsList: {
    padding: Spacing.m,
  },
  commentContainer: {
    backgroundColor: Colors.background.paper,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentHeaderInfo: {
    marginLeft: Spacing.s,
  },
  userName: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary,
  },
  timeAgo: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.text.secondary,
  },
  commentContent: {
    marginBottom: Spacing.s,
  },
  commentText: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  mention: {
    color: Colors.primary.main,
    fontFamily: FontFamily.medium,
  },
  commentImage: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.s,
    marginTop: Spacing.s,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: Spacing.s,
    marginTop: Spacing.s,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.l,
  },
  actionText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.m,
    backgroundColor: Colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  inputContainer: {
    flex: 1,
    marginRight: Spacing.s,
  },
  input: {
    marginBottom: 0,
  },
  composerActions: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
  },
  composerButton: {
    marginRight: Spacing.m,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.grey[400],
  },
  deleteButton: {
    padding: Spacing.xs,
    marginLeft: 'auto',
  },
});