import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity , Image, Platform, BackHandler} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { getInfoUser } from '../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Stored token:', token);

      if (token) {
        console.log('Dispatching getInfoUser...');
        const result = await dispatch(getInfoUser());
        console.log('GetInfoUser result:', result);
      } else {
        console.log('No token found');
      }
    };
    
    fetchUserInfo();

  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Entypo name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.appBarText}>ÔN TRẮC NGHIỆM LỊCH SỬ</Text>
        
        <TouchableOpacity style={styles.moreButton}>
          <Feather name="more-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.bannerContainer}>
        <Image
          source={require('../assets/Images/banner.jpg')}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <View style={styles.dividerDot} />
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.menuGrid}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.iconCircle}>
            <Image 
              source={require('../assets/Images/12.png')} 
              style={styles.socialIcon} 
            />
          </View>
          <Text style={styles.menuItemText}>Ôn Thi Đại Học Lịch Sử</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('QuizMenu', {
            title: 'ÔN TẬP TRẮC NGHIỆM',
            screenType: 'practice'
          })}
        >
          <View style={styles.iconCircle}>
            <Image 
              source={require('../assets/Images/choose.png')} 
              style={styles.socialIcon} 
            />
          </View>
          <Text style={styles.menuItemText}>Ôn Tập Trắc Nghiệm</Text>
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

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('QuizMenu', {
            title: 'THI TRẮC NGHIỆM LỊCH SỬ',
            screenType: 'exam'
          })}
        >
          <View style={styles.iconCircle}>
            <Image 
              source={require('../assets/Images/correct.png')} 
              style={styles.socialIcon} 
            />
          </View>
          <Text style={styles.menuItemText}>Làm Bài Thi Trắc Nghiệm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  appBar: {
    height: 56,
    backgroundColor: '#FF6B00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
    height: Platform.OS === 'ios' ? 96 : 56,
  },
  appBarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  menuButton: {
    padding: 8,
  },
  moreButton: {
    padding: 8,
  },
  menuGrid: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: '10%',
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
    borderColor: '#FF5733',
    marginRight: 15,
    backgroundColor: '#fff',
  },
  socialIcon: {
    width: 60,
    height: 60,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  bannerContainer: {
    width: '100%',
    height: 250,
    marginBottom: 10,

  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
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
});

export default Home;
