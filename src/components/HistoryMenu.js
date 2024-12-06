import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChaptersByGrade, fetchLesson, fetchTest } from '../redux/QuestionSlice';
import AntDesign from 'react-native-vector-icons/AntDesign'

const HistoryMenu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { title = 'THI TRẮC NGHIỆM LỊCH SỬ', screenType = 'exam' } = route.params || {};
  const chapters = useSelector((state) => state.questions.chapters);
  const [selectedGrade, setSelectedGrade] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('DrawerHome')}
        >
          <AntDesign name="arrowleft" size={24} color="#fff" />
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
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('QuizMenu', {
              title: 'ÔN TẬP LỊCH SỬ CẤP 1',
              screenType: 'cap1'
          })}
        >
          <View style={styles.iconCircle}>
            <Image 
              source={require('../assets/Images/scholarship.png')} 
              style={styles.socialIcon} 
            />
          </View>
          <Text style={styles.menuItemText}>Ôn Tập Lịch Sử Cấp 1</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('QuizMenu', {
              title: 'ÔN TẬP LỊCH SỬ CẤP 2',
              screenType: 'cap2'
          })}
        >
          <View style={styles.iconCircle}>
            <Image 
              source={require('../assets/Images/scholarship.png')} 
              style={styles.socialIcon} 
            />
          </View>
          <Text style={styles.menuItemText}>Ôn Tập Lịch Sử Cấp 2</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('QuizMenu', {
              title: 'ÔN TẬP LỊCH SỬ CẤP 3',
              screenType: 'ontap'
          })}
        >
          <View style={styles.iconCircle}>
            <Image 
              source={require('../assets/Images/scholarship.png')} 
              style={styles.socialIcon} 
            />
          </View>
          <Text style={styles.menuItemText}>Ôn Tập Lịch Sử Cấp 3</Text>
        </TouchableOpacity>
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
  menuItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
});

export default HistoryMenu;