import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchListResult, fetchDetailResult } from '../redux/QuestionSlice';
import { useNavigation, useRoute } from '@react-navigation/native';

const HistoryTest = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const userId = route.params?.userId;
  const { testResults, loadingResults, resultError } = useSelector((state) => state.questions);

  useEffect(() => {
    dispatch(fetchListResult());
  }, [dispatch]);


  const userResults = testResults?.filter(result => result.userId === userId) || [];


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleResultPress = async (testId) => {
    try {
      const detailResult = await dispatch(fetchDetailResult(testId)).unwrap();
      navigation.navigate('DetailHistory', { testId, detailResult });
    } catch (error) {
      console.error('Failed to fetch detail result:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LỊCH SỬ KIỂM TRA</Text>
      </View>

      {loadingResults ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : resultError ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Lỗi: {resultError}</Text>
        </View>
      ) : !testResults || testResults.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.noDataText}>Đang tải dữ liệu...</Text>
        </View>
      ) : userResults.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.noDataText}>Chưa có bài kiểm tra nào</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {userResults.map((result) => (
            <TouchableOpacity 
              key={result.testId}
              style={styles.resultItem}
              onPress={() => handleResultPress(result.testId)}
            >
              <Text style={styles.resultTitle}>{result.testTile}</Text>
              <Text style={styles.resultDate}>
                Thời gian: {formatDate(result.createdAt)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
  content: {
    flex: 1,
    padding: 15,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  resultTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultDate: {
    fontSize: 14,
    color: '#666',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    width: '100%',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
  },
});

export default HistoryTest;
