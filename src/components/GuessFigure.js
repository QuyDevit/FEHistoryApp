import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchListHisFigure } from '../redux/QuestionSlice'
import { API_URL } from '@env';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native';

const GuessFigure = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const historicalFigures = useSelector((state) => state.questions.historicalFigures);
  const [currentFigureIndex, setCurrentFigureIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [shuffledFigures, setShuffledFigures] = useState([]);
  const inputRefs = useRef([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    dispatch(fetchListHisFigure());
  }, [dispatch]);

  useEffect(() => {
    if (historicalFigures.length > 0) {
      const shuffled = [...historicalFigures].sort(() => Math.random() - 0.5);
      setShuffledFigures(shuffled);
      setCurrentFigureIndex(0);
      setAnswers(Array(shuffled[0].name.length).fill(''));
    }
  }, [historicalFigures]);

  const handleInputChange = (text, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = text;
    setAnswers(newAnswers);

    if (text.length === 1) {
      if (index < newAnswers.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (text.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const removeDiacritics = (str) => {
    return str
      .normalize("NFD") 
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d") 
      .replace(/Đ/g, "D"); 
  };
  

  const handleCheck = () => {
    const finalAnswer = removeDiacritics(answers.join('').replace(/\s/g, '').toLowerCase());
    const currentFigure = shuffledFigures[currentFigureIndex];
    const correctAnswer = removeDiacritics(currentFigure.name.replace(/\s/g, '').toLowerCase());
  
    console.log('Đáp án đúng', correctAnswer);
    console.log('Đáp án sai:', finalAnswer);
  
    if (finalAnswer === correctAnswer) {
        setModalMessage('Đáp án đúng!');
        setModalVisible(true);
        setWrongAttempts(0); 
     } else {
        setWrongAttempts((prev) => prev + 1);
        if (wrongAttempts + 1 >= 3) {
          setModalMessage(`Đáp án đúng là: ${currentFigure.name}`);
          setModalVisible(true);
          setWrongAttempts(0);
        } else {
          console.log('Đáp án sai:', finalAnswer);
        }
     }
  };
  
  
  const handleNextFigure = () => {
    const nextIndex = (currentFigureIndex + 1) % shuffledFigures.length;
    setCurrentFigureIndex(nextIndex); 
    setAnswers(Array(shuffledFigures[nextIndex].name.length).fill('')); 
    setModalVisible(false); 
    inputRefs.current[0]?.focus(); 
  };
  

  if (historicalFigures.length === 0) {
    return <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>;
  }

  const currentFigure = shuffledFigures[currentFigureIndex];

  if (!currentFigure) {
    return <Text style={styles.loadingText}>Không có dữ liệu nhân vật.</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ĐOÁN NHÂN VẬT LỊCH SỬ</Text>
      </View>
      <Text style={styles.title}>Đây là ai ?</Text>
      <Image 
        source={{ uri: `${API_URL}${currentFigure.imageUrl}` }}  
        style={styles.image} 
        resizeMode="contain"
      />
     <View style={styles.heartContainer}>
        <AntDesign 
            name="heart" 
            size={24} 
            color={wrongAttempts === 2 ? "#EF4444" : wrongAttempts === 1 ? "#EAB308" : "#22C55E"}
        />
        <Text style={styles.wrongAttemptsText}>{3 - wrongAttempts}</Text>
     </View>

      <View style={styles.inputContainer}>
      {Array.from({ length: currentFigure.name.replace(/\s/g, '').replace(/\đ/g, 'd').length }).map((_, index) => (
        <View key={index} style={styles.inputWrapper}>
            <TextInput
            ref={(el) => (inputRefs.current[index] = el)}
            style={styles.input}
            maxLength={1}
            onChangeText={(text) => handleInputChange(text, index)}
            onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                const newAnswers = [...answers];
                if (answers[index] === '' && index > 0) {
                    newAnswers[index - 1] = '';
                    setAnswers(newAnswers);
                    inputRefs.current[index - 1]?.focus();
                } else {
                    newAnswers[index] = '';
                    setAnswers(newAnswers);
                }
                }
            }}
            keyboardType="default"
            value={answers[index]}
            />
        </View>
        ))}
      </View>
      <TouchableOpacity style={styles.checkButton} onPress={handleCheck}>
        <Text style={styles.checkButtonText}>Kiểm Tra</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity 
                style={styles.continueButton} 
                onPress={handleNextFigure} // Gọi hàm mới
            >
                <Text style={styles.continueButtonText}>Tiếp tục</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>

    </KeyboardAvoidingView>
  )
}

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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
    textAlign:'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    marginHorizontal: 5,
    marginBottom: 5,
  },
  input: {
    width: 40,
    height: 50,
    borderWidth: 2,
    borderColor: '#FF6B00',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#fff',
  },
  checkButton: {
    marginLeft:'10%',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF6B00',
    borderRadius: 5,
    width: '80%',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#FF6B00',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  continueButton: {
    padding: 10,
    backgroundColor: '#FF6B00',
    borderRadius: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  wrongAttemptsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginLeft: 5,
  },
});

export default GuessFigure