import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const DetailHistory = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const detailResult = route.params?.detailResult;

  const testId = detailResult?.testId;

  const getAnswerStatus = (question) => {
    if (question.answerSelected === 0) {
      return {
        text: 'Chưa trả lời',
        style: styles.noAnswerBadge,
        textStyle: styles.noAnswerText
      };
    }
    return {
      text: question.isCorrect ? 'Đúng' : 'Sai',
      style: question.isCorrect ? styles.correctBadge : styles.incorrectBadge,
      textStyle: styles.resultBadgeText
    };
  };

  if (!detailResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không có dữ liệu</Text>
      </View>
    );
  }

  return (
    <View style={styles.containerWrapper}>
    <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LỊCH SỬ KIỂM TRA</Text>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{detailResult.titleTest}</Text>
          <Text style={styles.userName}>Thí sinh: {detailResult.userName}</Text>
        </View>

        {detailResult.questionsTest.map((question, index) => {
          const answerStatus = getAnswerStatus(question);
          
          return (
            <View key={question.id} style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>Câu {index + 1}</Text>
                <View style={[styles.resultBadge, answerStatus.style]}>
                  <Text style={answerStatus.textStyle}>{answerStatus.text}</Text>
                </View>
              </View>

              <Text style={styles.questionTitle}>{question.title}</Text>
            
              <View style={styles.choicesContainer}>
                {question.choices.map((choice) => (
                  <View 
                    key={choice.id} 
                    style={[
                      styles.choiceItem,
                      choice.id === question.answerSelected && styles.selectedChoiceContainer,
                      choice.isCorrect && styles.correctChoiceContainer,
                      choice.id === question.answerSelected && !choice.isCorrect && styles.wrongChoiceContainer
                    ]}
                  >
                    <Text style={[
                      styles.choiceText,
                      choice.id === question.answerSelected && styles.selectedChoiceText,
                      choice.isCorrect && styles.correctChoiceText,
                      choice.id === question.answerSelected && !choice.isCorrect && styles.wrongChoiceText
                    ]}>
                      {choice.content}
                    </Text>
                    {choice.id === question.answerSelected && (
                      <Text style={styles.answerLabel}>
                        (Đáp án của bạn)
                      </Text>
                    )}
                    {choice.isCorrect && (
                      <Text style={styles.correctLabel}>
                        (Đáp án đúng)
                      </Text>
                    )}
                  </View>
                ))}
              </View>
              {question.description && (
                <View style={styles.explanationContainer}>
                  <Text style={styles.explanationTitle}>Giải thích:</Text>
                  <Text style={styles.explanationText}>{question.description}</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.replace('Question', { 
            type: 'exam', 
            review: false,
            testId: testId,
          })}
        >
          <Text style={styles.buttonText}>Làm lại</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.outlineButton]}
          onPress={() => navigation.goBack()}
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
    backgroundColor: '#F5F5F5',
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
  headerSection: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    color: '#666',
  },
  questionCard: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  correctBadge: {
    backgroundColor: '#E8F5E9',
  },
  incorrectBadge: {
    backgroundColor: '#FFEBEE',
  },
  resultBadgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  questionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  choicesContainer: {
    marginTop: 10,
  },
  choiceItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedChoiceContainer: {
    borderColor: '#FF6B00',
    backgroundColor: '#FFF3E0',
  },
  correctChoiceContainer: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  choiceText: {
    fontSize: 14,
    color: '#333',
  },
  selectedChoiceText: {
    color: '#FF6B00',
    fontWeight: '500',
  },
  correctChoiceText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noAnswerBadge: {
    backgroundColor: '#E0E0E0',
    width: "35%",
  },
  noAnswerText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  wrongChoiceContainer: {
    borderColor: '#FF5252',
    backgroundColor: '#FFEBEE',
  },
  wrongChoiceText: {
    color: '#FF5252',
    fontWeight: '500',
  },
  answerLabel: {
    fontSize: 12,
    color: '#FF6B00',
    marginTop: 4,
    fontStyle: 'italic',
  },
  correctLabel: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
    fontStyle: 'italic',
  },
  containerWrapper: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  buttonContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flexDirection: 'column',
    gap: 10,
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
  explanationContainer: {
    backgroundColor: '#F5F5F7',
    padding: 16,
    marginTop: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default DetailHistory;
