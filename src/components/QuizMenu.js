import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChaptersByGrade, fetchLesson, fetchTest } from '../redux/QuestionSlice';

const QuizMenu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { title = 'THI TRẮC NGHIỆM LỊCH SỬ', screenType = 'exam' } = route.params || {};
  const chapters = useSelector((state) => state.questions.chapters);
  const [selectedGrade, setSelectedGrade] = useState(null);

  // Add grade mapping
  const gradeToIdMapping = {
    10: 1,
    11: 2,
    12: 3
  };

  const handleQuizPress = (grade) => {
    setSelectedGrade(grade);
    if (screenType === 'exam') {
      const gradeId = gradeToIdMapping[grade];
      dispatch(fetchTest(gradeId)).then((response) => {
        const testId = response.payload?.testId;
        navigation.navigate('Question', { 
          grade,
          type: screenType,
          testId: testId
        });
      });
    } else if (screenType === 'ontap') {
      const gradeId = gradeToIdMapping[grade];
      dispatch(fetchChaptersByGrade(gradeId));
    } else {
      const gradeId = gradeToIdMapping[grade];
      dispatch(fetchChaptersByGrade(gradeId));
    }
  };

  useEffect(() => {
    if (chapters.length > 0 && selectedGrade && screenType !== 'exam') {
      navigation.navigate('Lesson', { 
        chapters,
        gradeId: gradeToIdMapping[selectedGrade],
        screenType: screenType
      });
    }
  }, [chapters, navigation, selectedGrade]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('DrawerHome')}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <Image
        source={screenType === 'exam' 
          ? require('../assets/Images/ttn.jpg') 
          : require('../assets/Images/ot.jpg')
        }
        style={styles.bannerImage}
        resizeMode="cover"
      />

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <View style={styles.dividerDot} />
        <View style={styles.dividerLine} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.menuGrid}>
          {screenType === 'exam' ? (
            
            <>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleQuizPress(10)}
              >
                <View style={styles.iconCircle}>
                <Image 
                source={require('../assets/Images/10.png')} 
                style={styles.socialIcon} 
                />
                </View>
                <Text style={styles.menuItemText}>Đề Thi Ngẫu Nhiên Lớp 10</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleQuizPress(11)}
            >
                <View style={styles.iconCircle}>
                <Image 
                source={require('../assets/Images/eleven.png')} 
                style={styles.socialIcon} 
                />
                </View>
                <Text style={styles.menuItemText}>Đề Thi Ngẫu Nhiên Lớp 11</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleQuizPress(12)}
            >
                <View style={styles.iconCircle}>
                <Image 
                source={require('../assets/Images/12.png')} 
                style={styles.socialIcon} 
                />
                </View>
                <Text style={styles.menuItemText}>Đề Thi Ngẫu Nhiên Lớp 12</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleQuizPress('university')}
            >
                <View style={styles.iconCircle}>
                <Image 
                source={require('../assets/Images/mortarboard.png')} 
                style={styles.socialIcon} 
                />
                </View>
                <Text style={styles.menuItemText}>Đề Thi Đại Học Ngẫu Nhiên</Text>
            </TouchableOpacity>
            </>
          ) : screenType === 'ontap' ? (
            <>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleQuizPress(10)}
              >
                <View style={styles.iconCircle}>
                <Image 
                source={require('../assets/Images/10.png')} 
                style={styles.socialIcon} 
                />
                </View>
                <Text style={styles.menuItemText}>Lịch Sử Lớp 10</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleQuizPress(11)}
              >
                <View style={styles.iconCircle}>
                <Image 
                source={require('../assets/Images/eleven.png')} 
                style={styles.socialIcon} 
                />
                </View>
                <Text style={styles.menuItemText}>Lịch Sử Lớp 11</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleQuizPress(12)}
              >
                <View style={styles.iconCircle}>
                <Image 
                source={require('../assets/Images/12.png')} 
                style={styles.socialIcon} 
                />
                </View>
                <Text style={styles.menuItemText}>Lịch Sử Lớp 12</Text>
              </TouchableOpacity>
            </>
          ) : (

            <>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleQuizPress(10)}
              >
                <View style={styles.iconCircle}>
                <Image 
                source={require('../assets/Images/10.png')} 
                style={styles.socialIcon} 
                />
                </View>
                <Text style={styles.menuItemText}>Ôn Tập Lớp 10</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleQuizPress(11)}
            >
                <View style={styles.iconCircle}>
                <Image 
                source={require('../assets/Images/eleven.png')} 
                style={styles.socialIcon} 
                />
                </View>
                <Text style={styles.menuItemText}>Ôn Tập Lớp 11</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleQuizPress(12)}
            >
                <View style={styles.iconCircle}>
                <Image 
                source={require('../assets/Images/12.png')} 
                style={styles.socialIcon} 
                />
                </View>
                <Text style={styles.menuItemText}>Ôn Tập Lớp 12</Text>
            </TouchableOpacity>
            </>
          )}
        </View>
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
    height: 250,
    
  },
  content: {
    flex: 1,
  },
  menuGrid: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    marginBottom: 15,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF6B00',
    marginRight: 15,
    backgroundColor: '#fff',
  },
  numberText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  graduateIcon: {
    width: 40,
    height: 40,
    tintColor: '#FF6B00',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#FF6B00',
  },
  dividerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B00',
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 60,
    height: 60,
  },
});

export default QuizMenu;