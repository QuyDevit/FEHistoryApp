import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, BackHandler, Dimensions, PanResponder, Animated, Modal, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { sendAnswer } from '../redux/QuestionSlice';

const Question = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { 
    type = 'practice', 
    review = false, 
    selectedAnswers: initialSelectedAnswers = {},
    testId: routeTestId 
  } = route.params || {};

  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  
  const testData = useSelector((state) => state.questions.test);
  const questions = testData?.listQuestion || [];
  const totalQuestions = questions.length;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(initialSelectedAnswers);
  const [results, setResults] = useState({
    correctAnswers: 0,
    wrongAnswers: 0,
    unanswered: 0,
  });

  const currentQuestionData = questions[currentQuestion] || {};
  const choices = currentQuestionData.choices || [];

  const translateX = useRef(new Animated.Value(0)).current;

  const [showAnswerList, setShowAnswerList] = useState(false);

  const dispatch = useDispatch();

  const testId = routeTestId || testData?.id;

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < totalQuestions) {
        Alert.alert(
            'Chưa hoàn thành',
            'Bạn cần chọn đáp án cho tất cả các câu hỏi trước khi nộp bài.',
            [{ text: 'OK' }]
        );
        return;
    }

    if (type === 'exam' && testId) {
      console.log('=== handleSubmit triggered ===');
      console.log('All selected answers:', selectedAnswers);
      console.log('Test ID:', testId);

      const answerPromises = Object.entries(selectedAnswers).map(([questionIndex, answerIndex]) => {
        const question = questions[questionIndex];
        const selectedChoice = question.choices[answerIndex];
        
        return dispatch(sendAnswer({
          testId: testId,
          questionId: question.id,
          answerId: selectedChoice.id
        }));
      });

      try {
        console.log('Waiting for all answers to be submitted...');
        const results = await Promise.all(answerPromises);
        console.log('All answers submitted successfully:', results);
      } catch (error) {
        console.error('Error submitting answers:', error);
        Alert.alert(
          'Lỗi',
          'Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    const finalResults = {
      correctAnswers: 0,
      wrongAnswers: 0,
      unanswered: totalQuestions
    };

    Object.entries(selectedAnswers).forEach(([questionIndex, answerIndex]) => {
      const question = questions[questionIndex];
      const isCorrect = question.choices[answerIndex]?.isCorrect;
      
      if (isCorrect) {
        finalResults.correctAnswers++;
      } else {
        finalResults.wrongAnswers++;
      }
      finalResults.unanswered--;
    });

    console.log('Final results:', finalResults);
    
    navigation.replace('Result', {
      correctAnswers: finalResults.correctAnswers,
      wrongAnswers: finalResults.wrongAnswers,
      unanswered: finalResults.unanswered,
      totalQuestions,
      selectedAnswers,
      testId: testId,
      questions
    });
  };

  useEffect(() => {
    if (type === 'exam' && !review) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setTimeout(() => {
              Alert.alert('Hết giờ', 'Đã hết thời gian làm bài!', [
                {
                  text: 'OK',
                  onPress: () => {
                    navigation.replace('Result', {
                      correctAnswers: 0,
                      wrongAnswers: 0,
                      unanswered: 40,
                      testId: testId,
                    });
                  }
                }
              ]);
            }, 0);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [type, navigation]);

  useEffect(() => {
    const backAction = () => {
      if (Object.keys(selectedAnswers).length < totalQuestions) {
        Alert.alert(
            'Chưa hoàn thành',
            'Bạn cần chọn đáp án cho tất cả các câu hỏi trước khi quay lại.',
            [
                {
                    text: 'Hủy',
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                    
                    },
                },
            ],
            { cancelable: false }
        );
        return true;
      }

      if (type === 'exam' && !review) {
        Alert.alert(
          'Dừng kiểm tra',
          'Bạn có muốn dừng kiểm tra?',
          [
            {
              text: 'Hủy',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                const finalResults = {
                  correctAnswers: 0,
                  wrongAnswers: 0,
                  unanswered: totalQuestions
                };

                Object.entries(selectedAnswers).forEach(([questionIndex, answerIndex]) => {
                  const question = questions[questionIndex];
                  const isCorrect = question.choices[answerIndex]?.isCorrect;
                  
                  if (isCorrect) {
                    finalResults.correctAnswers++;
                  } else {
                    finalResults.wrongAnswers++;
                  }
                  finalResults.unanswered--;
                });

                navigation.replace('Result', {
                  ...finalResults,
                  totalQuestions,
                  selectedAnswers,
                  testId: testId,
                });
              },
            },
          ],
          { cancelable: false }
        );
        return true;
      } else if (type === 'exam' && review) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation, totalQuestions, selectedAnswers, questions, type, review]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const onSelect = async (index) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: index
    }));

    const isCorrect = choices[index]?.isCorrect;
    setResults(prev => ({
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: prev.wrongAnswers + (!isCorrect ? 1 : 0),
      unanswered: totalQuestions - (Object.keys(selectedAnswers).length + 1)
    }));
    try {
      console.log('Request Data:', {
        testId: testId,
        questionId: currentQuestionData.id,
        answerId: choices[index].id
      });

      const response = await dispatch(sendAnswer({
        testId: testId,
        questionId: currentQuestionData.id,
        answerId: choices[index].id
      })).unwrap();

      if (response.status === true) {
        
      } else {
        Alert.alert(
          'Lỗi',
          'Không thể gửi câu trả lời. Vui lòng thử lại.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('SendAnswer error:', error);
      Alert.alert(
        'Lỗi',
        'Có lỗi xảy ra khi gửi câu trả lời. Vui lòng thử lại.',
        [{ text: 'OK' }]
      );
    }
  };

  const getOptionStyle = (index) => {
    const isCorrectAnswer = choices[index]?.isCorrect;
    const wasSelected = selectedAnswers[currentQuestion] === index;

    if (review) {
      if (wasSelected && !isCorrectAnswer) {
        return [styles.optionButton, styles.wrongOption]; 
      }
      if (isCorrectAnswer) {
        return [styles.optionButton, styles.correctOption]; 
      }
    }

    return styles.optionButton; 
  };

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const { dx, dy } = gestureState;
          return Math.abs(dx) > Math.abs(dy) * 2 && Math.abs(dx) > 10;
        },
        onPanResponderMove: (_, gestureState) => {
          translateX.setValue(gestureState.dx);
        },
        onPanResponderRelease: (_, gestureState) => {
          const { dx } = gestureState;
          if (dx > 50 && currentQuestion > 0) {
            Animated.timing(translateX, {
              toValue: Dimensions.get('window').width,
              duration: 200,
              useNativeDriver: false,
            }).start(() => {
              setCurrentQuestion(prev => prev - 1);
              translateX.setValue(-Dimensions.get('window').width);
              Animated.timing(translateX, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
              }).start();
            });
          } else if (dx < -50 && currentQuestion < totalQuestions - 1) {
            Animated.timing(translateX, {
              toValue: -Dimensions.get('window').width,
              duration: 200,
              useNativeDriver: false,
            }).start(() => {
              setCurrentQuestion(prev => prev + 1);
              translateX.setValue(Dimensions.get('window').width);
              Animated.timing(translateX, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
              }).start();
            });
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: false,
            }).start();
          }
        },
      }),
    [currentQuestion, totalQuestions]
  );

  const renderQuestionContent = () => (
    <Animated.View {...panResponder.panHandlers} style={[styles.questionContent, { transform: [{ translateX }] }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={{ flexGrow: 1 }}
        nestedScrollEnabled={true}
      >
        <View style={styles.questionBox}>
          <Text style={styles.questionNumber}>Câu {currentQuestion + 1}:</Text>
          <Text style={styles.questionText}>{currentQuestionData.content}</Text>
        </View>

        {choices.map((choice, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(index)}
            onPress={() => !review && onSelect(index)}
            disabled={review}
          >
            <View style={styles.radioContainer}>
              <View style={styles.radioOuter}>
                {(selectedAnswers[currentQuestion] === index) && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.optionText}>{choice.content}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {review && currentQuestionData.description && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationTitle}>Giải thích:</Text>
            <ScrollView 
              style={styles.explanationScrollView}
              nestedScrollEnabled={true}
            >
              <Text style={styles.explanationText}>{currentQuestionData.description}</Text>
            </ScrollView>
          </View>
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </Animated.View>
  );

  const handleQuestionSelect = (questionIndex) => {
    setCurrentQuestion(questionIndex);
    setShowAnswerList(false);
  };

  const renderAnswerList = () => (
    
    <Modal
      visible={showAnswerList}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowAnswerList(false)}
    >
{type === 'exam' && !review && (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Danh Sách Câu Trả Lời</Text>
          <View style={styles.answerGrid}>
            {Array.from({ length: totalQuestions }, (_, index) => {
              const isAnswered = selectedAnswers[index] !== undefined;

              const buttonStyle = [
                styles.answerItem,
                isAnswered && styles.selectedItem 
              ];

              return (
                <TouchableOpacity
                  key={index}
                  style={buttonStyle}
                  onPress={() => handleQuestionSelect(index)}
                >
                  <Text style={styles.answerItemText}>CÂU {index + 1}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.continueButton]}
              onPress={() => setShowAnswerList(false)}
            >
              <Text style={styles.continueButtonText}>Làm tiếp</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalButton, styles.submitButton]}
              onPress={() => {
                setShowAnswerList(false);
                handleSubmit();
              }}
            >
              <Text style={styles.submitButtonText}>Nộp bài</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )}
      {type === 'exam' && review && (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Danh Sách Câu Trả Lời</Text>
          <View style={styles.answerGrid}>
            {Array.from({ length: totalQuestions }, (_, index) => {
              const isAnswered = selectedAnswers[index] !== undefined;
              const isCorrect = isAnswered && questions[index]?.choices[selectedAnswers[index]]?.isCorrect;
              
              const buttonStyle = [
                styles.answerItem,
                !isAnswered ? styles.unansweredItem : (isCorrect ? styles.correctAnswerItem : styles.wrongAnswerItem)
              ];
              
              return (
                <TouchableOpacity
                  key={index}
                  style={buttonStyle}
                  onPress={() => handleQuestionSelect(index)}
                >
                  <Text style={styles.answerItemText}>CÂU {index + 1}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity 
            style={styles.closeModalButton}
            onPress={() => setShowAnswerList(false)}
          >
            <Text style={styles.closeModalButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
      )}
    </Modal>
  );

  const handleSubmitButton = () => {
    setShowAnswerList(true);
  };

  useEffect(() => {
    console.log('Route params:', route.params);
    console.log('Review mode:', review);
    console.log('Initial selected answers:', initialSelectedAnswers);
    console.log('Selected answers state:', selectedAnswers);
  }, [review, selectedAnswers]);

  useEffect(() => {
    console.log('=== Test Data from Store ===');
    console.log('testData:', testData);
  }, [testData]);

  return (
    <View style={styles.container}>
      {type === 'exam' && !review && (
        <View style={styles.header}>
          <View style={[
            styles.timerContainer, 
            timeLeft <= 10 && styles.timerWarning
          ]}>
            <Text style={styles.timerIcon}>⏰</Text>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.headerSubmitButton} 
            onPress={handleSubmitButton}
          >
            <Text style={styles.headerSubmitText}>Nộp Bài</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <GestureHandlerRootView style={{ flex: 1 }}>
          {renderQuestionContent()}
      </GestureHandlerRootView>

      {review && (
        <TouchableOpacity 
          style={styles.showAnswersButton}
          onPress={() => setShowAnswerList(true)}
        >
          <Text style={styles.showAnswersButtonText}>Xem Danh Sách Câu Trả Lời</Text>
        </TouchableOpacity>
      )}

      {renderAnswerList()}

      {review && (
        <TouchableOpacity 
          style={styles.reviewBackButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.reviewBackButtonText}>Quay Lại</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2E8B57',
    paddingHorizontal: 20,
    paddingVertical: 12,
    height: 60,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  questionBox: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E8B57',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  optionButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2E8B57',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#2E8B57',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    letterSpacing: 0.3,
  },
  submitButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
    height: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
  },
  submitButtonText: {
    color: '#2E8B57',
    fontSize: 16,
    fontWeight: '600',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerIcon: {
    fontSize: 18,
    color: '#fff',
    marginRight: 6,
  },
  timerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timerWarning: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
  },
  correctOption: {
    backgroundColor: '#90EE90', // Màu xanh nhạt cho đáp án đúng
  },
  wrongOption: {
    backgroundColor: '#FFB6C1', // Màu đỏ nhạt cho đáp án sai
  },
  reviewBackButton: {
    backgroundColor: '#FF6B00',
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 15,
    borderRadius: 30,
    alignSelf: 'stretch',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  reviewBackButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  questionContainer: {
    flex: 1,
  },
  questionContent: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B00',
    textAlign: 'center',
    marginBottom: 20,
  },
  answerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  answerItem: {
    width: '48%',
    padding: 10,
    borderWidth: 2,
    borderColor: '#2E8B57',
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  answeredItem: {
    backgroundColor: '#90EE90',
  },
  answerItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E8B57',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    padding: 15,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#2E8B57', // Màu xanh lá
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitButton: {
    backgroundColor: '#FF6B00', // Màu cam
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerSubmitButton: {
    backgroundColor: '#FF6B00', 
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 40,
  },
  headerSubmitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  explanationContainer: {
    backgroundColor: '#F5F5F7',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2E8B57',
    marginBottom: 20,
  },
  explanationScrollView: {
    maxHeight: 150,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  selectedOption: {
    borderColor: '#FFD700', // Gold color for selected option
    borderWidth: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 180,
  },
  bottomPadding: {
    height: 180,
  },
  showAnswersButton: {
    backgroundColor: '#2196F3',
    marginHorizontal: 16,
    marginVertical: 10,
    paddingVertical: 15,
    borderRadius: 30,
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  showAnswersButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  correctAnswerItem: {
    backgroundColor: '#90EE90', 
    borderColor: '#4CAF50',
  },
  wrongAnswerItem: {
    backgroundColor: '#FFB6C1', 
    borderColor: '#FF5722',
  },
  closeModalButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: 'center',
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  unansweredItem: {
    backgroundColor: '#FFE082', // Màu vàng nhạt
    borderColor: '#FFA000', // Màu viền vàng đậm
  },
  selectedItem:{
    backgroundColor: '#82e0aa',
    borderColorl:'#196f3d',
  },
});

export default Question;
