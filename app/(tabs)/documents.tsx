import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { FileText, Map, Paperclip, Search, FilePlus, FileDown, ExternalLink, MapPin, CircleAlert as AlertCircle } from 'lucide-react-native';

import Colors from '../../constants/Colors';
import Spacing, { BorderRadius } from '../../constants/Spacing';
import { FontFamily } from '../../constants/Typography';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { DocumentCategory } from '../../types';

// Mock document data
const MOCK_DOCUMENTS = [
  {
    id: '1',
    title: 'Escritura da Fazenda',
    description: 'Documento oficial de registro da propriedade',
    fileUrl: 'https://example.com/escritura.pdf',
    fileType: 'application/pdf',
    fileSize: 2500000,
    category: DocumentCategory.ESCRITURA,
    createdAt: '2023-01-15T10:30:00Z',
    uploaderId: '1',
    uploaderName: 'João Silva',
  },
  {
    id: '2',
    title: 'Mapa de Divisão de Lotes',
    description: 'Mapa mostrando a divisão territorial entre os proprietários',
    fileUrl: 'https://example.com/mapa_lotes.jpg',
    fileType: 'image/jpeg',
    fileSize: 4500000,
    category: DocumentCategory.MAPAS,
    createdAt: '2023-02-20T14:45:00Z',
    uploaderId: '2',
    uploaderName: 'Maria Oliveira',
  },
  {
    id: '3',
    title: 'Certidão de Ônus',
    description: 'Certidão negativa de ônus reais',
    fileUrl: 'https://example.com/certidao.pdf',
    fileType: 'application/pdf',
    fileSize: 1800000,
    category: DocumentCategory.CERTIDAO_ONUS,
    createdAt: '2023-03-10T09:15:00Z',
    uploaderId: '1',
    uploaderName: 'João Silva',
  },
  {
    id: '4',
    title: 'Comprovante de IPTU 2023',
    description: 'Comprovante de pagamento do IPTU referente ao ano de 2023',
    fileUrl: 'https://example.com/iptu2023.pdf',
    fileType: 'application/pdf',
    fileSize: 950000,
    category: DocumentCategory.COMPROVANTES_PAGAMENTO,
    createdAt: '2023-05-05T16:20:00Z',
    uploaderId: '3',
    uploaderName: 'Pedro Santos',
  },
  {
    id: '5',
    title: 'Mapa Topográfico',
    description: 'Mapa com curvas de nível e detalhes topográficos da fazenda',
    fileUrl: 'https://example.com/mapa_topo.pdf',
    fileType: 'application/pdf',
    fileSize: 8500000,
    category: DocumentCategory.MAPAS,
    createdAt: '2023-04-25T11:30:00Z',
    uploaderId: '2',
    uploaderName: 'Maria Oliveira',
  },
];

type TabName = DocumentCategory | 'ALL';

export default function DocumentsScreen() {
  const [activeTab, setActiveTab] = useState<TabName>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<typeof MOCK_DOCUMENTS[0] | null>(null);

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return <Image source={{ uri: 'https://images.pexels.com/photos/38136/pexels-photo-38136.jpeg' }} style={styles.thumbnailImage} />;
    } else if (fileType.includes('pdf')) {
      return <FileText size={36} color={Colors.error.main} />;
    } else {
      return <Paperclip size={36} color={Colors.text.secondary} />;
    }
  };

  const getFileSizeString = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getCategoryName = (category: DocumentCategory) => {
    switch (category) {
      case DocumentCategory.ESCRITURA:
        return 'Escritura';
      case DocumentCategory.MAPAS:
        return 'Mapas';
      case DocumentCategory.CERTIDAO_ONUS:
        return 'Certidão de Ônus';
      case DocumentCategory.COMPROVANTES_PAGAMENTO:
        return 'Comprovantes';
      case DocumentCategory.OUTROS:
        return 'Outros';
      default:
        return category;
    }
  };

  const getCategoryIcon = (category: DocumentCategory) => {
    switch (category) {
      case DocumentCategory.ESCRITURA:
        return <FileText size={20} color={Colors.primary.main} />;
      case DocumentCategory.MAPAS:
        return <Map size={20} color={Colors.accent.main} />;
      case DocumentCategory.CERTIDAO_ONUS:
        return <AlertCircle size={20} color={Colors.warning.main} />;
      case DocumentCategory.COMPROVANTES_PAGAMENTO:
        return <Paperclip size={20} color={Colors.secondary.main} />;
      default:
        return <FilePlus size={20} color={Colors.text.secondary} />;
    }
  };

  const filteredDocuments = MOCK_DOCUMENTS.filter(doc => {
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeTab === 'ALL' || doc.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Documentos</Text>
        <Button
          title="Novo"
          size="small"
          onPress={() => console.log('Add document')}
          icon={<FilePlus size={16} color={Colors.white} />}
        />
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Buscar documentos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={Colors.text.secondary} />}
          containerStyle={styles.searchInput}
        />
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ALL' && styles.activeTab]}
            onPress={() => setActiveTab('ALL')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'ALL' && styles.activeTabText,
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>
          
          {Object.values(DocumentCategory).map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.tab, activeTab === category && styles.activeTab]}
              onPress={() => setActiveTab(category)}
            >
              <View style={styles.tabContent}>
                {getCategoryIcon(category)}
                <Text
                  style={[
                    styles.tabText,
                    activeTab === category && styles.activeTabText,
                  ]}
                >
                  {getCategoryName(category)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {selectedDocument ? (
        <View style={styles.documentDetail}>
          <Card style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setSelectedDocument(null)}
              >
                <Text style={styles.backButtonText}>← Voltar</Text>
              </TouchableOpacity>
              <Text style={styles.detailTitle}>{selectedDocument.title}</Text>
            </View>
            
            <View style={styles.detailContent}>
              <View style={styles.fileTypeContainer}>
                {getFileTypeIcon(selectedDocument.fileType)}
              </View>
              
              <View style={styles.detailInfo}>
                <Text style={styles.detailDescription}>{selectedDocument.description}</Text>
                
                <View style={styles.metadataContainer}>
                  <View style={styles.metadataItem}>
                    <Text style={styles.metadataLabel}>Categoria:</Text>
                    <Text style={styles.metadataValue}>{getCategoryName(selectedDocument.category)}</Text>
                  </View>
                  
                  <View style={styles.metadataItem}>
                    <Text style={styles.metadataLabel}>Tamanho:</Text>
                    <Text style={styles.metadataValue}>{getFileSizeString(selectedDocument.fileSize)}</Text>
                  </View>
                  
                  <View style={styles.metadataItem}>
                    <Text style={styles.metadataLabel}>Enviado por:</Text>
                    <Text style={styles.metadataValue}>{selectedDocument.uploaderName}</Text>
                  </View>
                  
                  <View style={styles.metadataItem}>
                    <Text style={styles.metadataLabel}>Data:</Text>
                    <Text style={styles.metadataValue}>{formatDate(selectedDocument.createdAt)}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <Button
                title="Baixar"
                variant="outlined"
                icon={<FileDown size={18} color={Colors.primary.main} />}
                onPress={() => console.log('Download', selectedDocument.id)}
                style={styles.actionButton}
              />
              <Button
                title="Abrir"
                icon={<ExternalLink size={18} color={Colors.white} />}
                onPress={() => console.log('Open', selectedDocument.id)}
                style={styles.actionButton}
              />
            </View>
          </Card>
        </View>
      ) : (
        <FlatList
          data={filteredDocuments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card 
              style={styles.documentCard}
              onPress={() => setSelectedDocument(item)}
            >
              <View style={styles.documentRow}>
                <View style={styles.fileTypeIcon}>
                  {getFileTypeIcon(item.fileType)}
                </View>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentTitle}>{item.title}</Text>
                  <Text style={styles.documentDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <View style={styles.documentFooter}>
                    <View style={styles.categoryTag}>
                      {getCategoryIcon(item.category)}
                      <Text style={styles.categoryText}>
                        {getCategoryName(item.category)}
                      </Text>
                    </View>
                    <Text style={styles.documentDate}>{formatDate(item.createdAt)}</Text>
                  </View>
                </View>
              </View>
            </Card>
          )}
          contentContainerStyle={styles.documentsList}
        />
      )}
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
  searchContainer: {
    padding: Spacing.m,
    backgroundColor: Colors.background.paper,
  },
  searchInput: {
    marginBottom: 0,
  },
  tabsContainer: {
    paddingVertical: Spacing.s,
    backgroundColor: Colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  tab: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    marginHorizontal: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  activeTab: {
    backgroundColor: Colors.primary.light,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
  },
  activeTabText: {
    color: Colors.white,
  },
  documentsList: {
    padding: Spacing.m,
  },
  documentCard: {
    marginBottom: Spacing.m,
  },
  documentRow: {
    flexDirection: 'row',
  },
  fileTypeIcon: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.s,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  documentDescription: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  documentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey[100],
    paddingHorizontal: Spacing.s,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
  },
  categoryText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  documentDate: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.text.secondary,
  },
  documentDetail: {
    flex: 1,
    padding: Spacing.m,
  },
  detailCard: {
    flex: 1,
  },
  detailHeader: {
    marginBottom: Spacing.m,
  },
  backButton: {
    marginBottom: Spacing.s,
  },
  backButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.primary.main,
  },
  detailTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    color: Colors.text.primary,
  },
  detailContent: {
    flexDirection: 'row',
    marginBottom: Spacing.l,
  },
  fileTypeContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.grey[100],
    borderRadius: BorderRadius.s,
    marginRight: Spacing.m,
  },
  detailInfo: {
    flex: 1,
  },
  detailDescription: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: Spacing.m,
  },
  metadataContainer: {
    backgroundColor: Colors.grey[50],
    borderRadius: BorderRadius.s,
    padding: Spacing.m,
  },
  metadataItem: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  metadataLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.secondary,
    width: 100,
  },
  metadataValue: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.m,
  },
  actionButton: {
    marginLeft: Spacing.m,
  },
});