import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestionsByGradeAndChapter, fetchLesson } from '../redux/QuestionSlice';

const ReviewLesson = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { lessonId, type, chapterName, description, gradeId } = route.params;
  const [fontSize, setFontSize] = useState(16);
  const [showAnswer, setShowAnswer] = useState({});
  const dispatch = useDispatch();
  
  const { questions, lesson, loading } = useSelector((state) => state.questions);

  useEffect(() => {
    if (type === 'practice') {
      dispatch(fetchQuestionsByGradeAndChapter({ gradeId, chapterId: lessonId }));
    } else if (type === 'ontap') {
      dispatch(fetchLesson(lessonId));
    }
  }, [dispatch, lessonId, type, gradeId]);

  const gradeMapping = {
    1: 10,
    2: 11,
    3: 12
  };

  const renderLessonContent = (content) => {
    const sections = content.split('\n\n');
    return sections.map((section, index) => {
      const isRomanNumeral = /^[IVX]+\./.test(section);
      return (
        <Text
          key={index}
          style={[
            styles.paragraphText,
            { fontSize, fontWeight: isRomanNumeral ? 'bold' : 'normal' }
          ]}
        >
          {section}
        </Text>
      );
    });
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
        <Text style={styles.headerTitle}>
          {type === 'practice' 
            ? `${chapterName} - Lớp ${gradeMapping[gradeId]}`
            : `${lesson?.name || 'ÔN TẬP LỊCH SỬ CẤP 3'} - Lớp ${gradeMapping[gradeId]}`
          }
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* <View style={styles.chapterInfo}>
          <Text style={[styles.chapterRow, { fontSize }]}>
            <Text style={styles.chapterName}>{chapterName}</Text>
            <Text style={styles.chapterDescription}>: {description}</Text>
          </Text>
        </View> */}

        {loading ? (
          <Text style={styles.loadingText}>Đang tải...</Text>
        ) : type === 'practice' ? (
          questions.map((question, index) => (
            <View key={question.id} style={styles.questionContainer}>
              <Text style={[styles.questionText, { fontSize }]}>Câu {index + 1}:</Text>
              <Text style={[styles.questionContent, { fontSize }]}>{question.content}</Text>
              {question.choices.map((choice, choiceIndex) => (
                <View key={choiceIndex} style={styles.optionContainer}>
                  <Text style={[styles.optionText, { fontSize }]}>
                    {String.fromCharCode(65 + choiceIndex)}. {choice.content}
                  </Text>
                </View>
              ))}
              <TouchableOpacity onPress={() => setShowAnswer(prev => ({ ...prev, [question.id]: !prev[question.id] }))}>
                <Text style={styles.toggleAnswerText}>
                  {showAnswer[question.id] ? 'Ẩn đáp án và giải thích' : 'Hiện đáp án và giải thích'}
                </Text>
              </TouchableOpacity>
              {showAnswer[question.id] && (
                <>
                  <Text style={[styles.answerText, { fontSize }]}>
                    Đáp án đúng: {String.fromCharCode(65 + question.choices.findIndex(choice => choice.isCorrect))}
                  </Text>
                  {question.description && (
                    <View style={styles.descriptionContainer}>
                      <Text style={[styles.descriptionText, { fontSize }]} adjustsFontSizeToFit={false}>
                        Giải thích: {question.description}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          ))
        ) : (
          <View style={styles.lessonContainer}>
            {lesson && lesson.content ? (
              renderLessonContent(lesson.content)
            ) : (
              <Text style={styles.loadingText}>Không có nội dung bài học</Text>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.zoomControls}>
        <TouchableOpacity 
          onPress={() => setFontSize(Math.max(12, fontSize - 2))} 
          style={styles.zoomButton}
        >
          <Feather name="zoom-out" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setFontSize(Math.min(24, fontSize + 2))} 
          style={styles.zoomButton}
        >
          <Feather name="zoom-in" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
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
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 80,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d9534f',
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'column',
    minHeight: 100,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questionContent: {
    fontSize: 16,
    marginBottom: 15,
  },
  optionContainer: {
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
  },
  answerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#5cb85c',
  },
  zoomControls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  zoomButton: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  descriptionContainer: {
    marginTop: 10,
    paddingRight: 10,
  },
  descriptionText: {
    fontStyle: 'italic',
    color: '#666',
    lineHeight: 20,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  toggleAnswerText: {
    color: '#007bff',
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  chapterInfo: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#FF0000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chapterName: {
    // Remove individual styles
  },
  chapterDescription: {
    // Remove individual styles
  },
  lessonContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bulletPoint: {
    flexDirection: 'row',
    paddingLeft: 16,
    marginVertical: 8,
  },
  bulletText: {
    flex: 1,
    color: '#333',
    lineHeight: 24,
  },
  subBulletPoint: {
    flexDirection: 'row',
    paddingLeft: 32,
    marginVertical: 6,
  },
  subBulletText: {
    flex: 1,
    color: '#666',
    lineHeight: 22,
  },
  paragraphText: {
    marginVertical: 12,
    color: '#333',
    lineHeight: 24,
  },
});

export default ReviewLesson;
