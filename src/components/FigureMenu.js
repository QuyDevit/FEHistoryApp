import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity , Image, Platform, BackHandler, ScrollView} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

const FigureMenu = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NHÂN VẬT LỊCH SỬ</Text>
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

      <ScrollView style={styles.menuGrid}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Figure')}
        >
          <View style={styles.iconCircle}>
            <Image 
              source={require('../assets/Images/man.png')} 
              style={styles.socialIcon} 
            />
          </View>
          <Text style={styles.menuItemText}>Tìm Hiểu Nhân Vật Lịch Sử</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('GuessFigure')}
        >
          <View style={styles.iconCircle}>
            <Image 
              source={require('../assets/Images/question.png')} 
              style={styles.socialIcon} 
            />
          </View>
          <Text style={styles.menuItemText}>Đoán Nhân Vật Lịch Sử</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
    textAlign:'center',
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

export default FigureMenu;
