import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const Result = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { 
    correctAnswers, 
    wrongAnswers, 
    unanswered,
    selectedAnswers,
    questions,
    totalQuestions,
    testId 
  } = route.params;
  
  // Tính điểm (thang điểm 10)
  const score = totalQuestions > 0 
    ? ((correctAnswers / totalQuestions) * 10).toFixed(1) 
    : 'N/A';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kết quả</Text>
      
      <Image 
        source={require('../assets/Images/success.png')} 
        style={styles.image}
      />

      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Tổng số câu:</Text>
          <Text style={styles.statValue}>{totalQuestions}</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Số câu đúng:</Text>
          <Text style={[styles.statValue, {color: '#4CAF50'}]}>{correctAnswers}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Số câu sai & bỏ qua:</Text>
          <Text style={[styles.statValue, {color: '#FF5722'}]}>{wrongAnswers + unanswered}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Điểm số:</Text>
          <Text style={[styles.statValue, {color: '#2196F3'}]}>{score}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.replace('Question', { 
            type: 'exam', 
            review: false,
            testId: testId 
          })}
        >
          <Text style={styles.buttonText}>Làm lại</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#2196F3' }]}
          onPress={() => navigation.navigate('Question', { 
            type: 'exam', 
            review: true,
            selectedAnswers: selectedAnswers,
            questions: questions,
            testId: testId 
          })}
        >
          <Text style={styles.buttonText}>Xem lại bài làm</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.outlineButton]}
          onPress={() => navigation.navigate('QuizMenu', { type: 'exam'})}
        >
          <Text style={[styles.buttonText, styles.outlineButtonText]}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    width:'50%'
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  outlineButtonText: {
    color: '#FF9800',
  },
});

export default Result;
