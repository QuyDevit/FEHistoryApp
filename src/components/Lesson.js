import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign'

const Lesson = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { chapters, gradeId, screenType } = route.params || [];

  const headerTitle = (screenType === 'ontap' || screenType === 'cap1' || screenType === 'cap2') 
    ? 'ÔN TẬP LỊCH SỬ'
    : 'ÔN TẬP TRẮC NGHIỆM LỊCH SỬ';

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
        {chapters.map((chapter) => (
          <TouchableOpacity 
            key={chapter.id}
            style={styles.lessonItem}
            onPress={() => {
              navigation.navigate('ReviewLesson', { 
                lessonId: chapter.id,
                type: (screenType === 'ontap' || screenType === 'cap1' || screenType === 'cap2') ? 'ontap' : 'practice',
                chapterName: chapter.chapterName,
                description: chapter.description,
                gradeId: gradeId
              });
            }}
          >
            <Image 
              source={require('../assets/Images/lesson.png')} 
              style={styles.lessonIcon} 
            />
            <View style={styles.lessonContent}>
              <Text style={styles.lessonText}>{chapter.chapterName}</Text>
              <Text style={styles.lessonDescription}>{chapter.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  lessonIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  lessonContent: {
    flex: 1,
  },
  lessonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  lessonDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default Lesson;
