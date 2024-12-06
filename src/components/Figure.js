import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchListHisFigure } from '../redux/QuestionSlice';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { API_URL } from '@env';

const Figure = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { historicalFigures } = route.params || {};
  const [figures, setFigures] = useState([]);

  const headerTitle = 'NHÂN VẬT LICH SỬ LỊCH SỬ';

  useEffect(() => {
    const fetchFigures = async () => {
      const response = await dispatch(fetchListHisFigure());
      if (response.meta.requestStatus === 'fulfilled') {
        setFigures(response.payload);
      }
    };
    fetchFigures();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
           <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
      </View>
      <Image
        source={require('../assets/Images/ot.jpg')}
        style={styles.bannerImage}
        resizeMode="cover"
      />

        <ScrollView style={styles.content}>
        {figures && figures.length > 0 ? (
            figures.map((figure) => (
            <TouchableOpacity
              key={figure.id}
              style={styles.figureItem}
              onPress={() => navigation.navigate('ReviewFigure', { id: figure.id })}
            >
                <Image 
                source={{ uri: `${API_URL}${figure.imageUrl}` }} 
                style={styles.figureImage} 
                />
                <Text style={styles.figureName}>{figure.name}</Text>
            </TouchableOpacity>
            ))
        ) : (
            <Text style={styles.noDataText}>Không có dữ liệu.</Text>
        )}
        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 56,
    backgroundColor: '#FF6B00',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  bannerImage: {
    width: '100%',
    height: 200,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  figureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  figureImage: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  figureName: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default Figure;
