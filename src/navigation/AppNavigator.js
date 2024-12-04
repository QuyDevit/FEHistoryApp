import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import HomeScreen from '../screens/HomeScreen';
import { Image, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import QuizTest from '../components/QuizMenu';
import RegisterScreen from '../screens/RegisterScreen';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import InfoUserScreen from '../screens/InfoUserScreen';
import QuestionScreen from '../screens/QuestionScreen';
import ResultScreen from '../screens/ResultScreen';
import LessonScreen from '../screens/LessonScreen';
import ReviewLessonScreen from '../screens/ReviewLessonScreen';
import QuizScreen from '../screens/QuizScreen';
import HistoryTestScreen from '../screens/HistoryTestScreen';
import DetailHistoryScreen from '../screens/DetailHistoryScreen';
import RedoTestScreen from '../screens/RedoTestScreen';
import ResultRedoScreen from '../screens/ResultRedoScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
        drawerLabelStyle: {
          fontSize: 16,
        },
      }}
      drawerContent={props => (
        <DrawerContentScrollView 
          {...props}
          contentContainerStyle={{
            flex: 1,
          }}
        >
          <View style={{
            height: 200,
            width: '100%',
            overflow: 'hidden',
          }}>
            <Image
              source={require('../assets/Images/banner.jpg')}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
              }}
            />
          </View>
          <Text style={{
            fontSize: 15,
            padding: 16,
            color: '#333',
          }}>
            Ôn Tập Trắc Nghiệm Lịch Sử
          </Text>
          
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen 
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Home',
          drawerActiveTintColor: '#FF6B00',
          drawerInactiveTintColor: '#333',
          drawerIcon: ({color, size}) => (
            <Icon name="home" size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="InfoUserScreen"
        component={InfoUserScreen}
        options={{
          title: 'Thông Tin Cá Nhân',
          drawerIcon: ({color, size}) => (
            <Icon name="person" size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Privacy"
        component={HomeScreen}
        options={{
          title: 'Chính Sách Bảo Mật',
          drawerIcon: ({color, size}) => (
            <Icon name="shield" size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Rate"
        component={HomeScreen}
        options={{
          title: 'Đánh Giá Ứng Dụng',
          drawerIcon: ({color, size}) => (
            <Icon name="star" size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Download"
        component={HomeScreen}
        options={{
          title: 'Tải Thêm Ứng Dụng',
          drawerIcon: ({color, size}) => (
            <Icon name="download" size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Share"
        component={HomeScreen}
        options={{
          title: 'Chia Sẻ Ứng Dụng',
          drawerIcon: ({color, size}) => (
            <Icon name="share" size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Logout"
        component={HomeScreen}
        options={{
          title: 'Thoát Ứng Dụng',
          drawerIcon: ({color, size}) => (
            <Icon name="log-out" size={size} color={color} />
          )
        }}
        listeners={{
          drawerItemPress: (e) => {
            e.preventDefault();
            handleLogout();
          }
        }}
      />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ headerShown: true ,title:''}}
      />
      <Stack.Screen 
        name="Question" 
        component={QuestionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="RedoTest" 
        component={RedoTestScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Result" 
        component={ResultScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ResultRedo" 
        component={ResultRedoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Lesson" 
        component={LessonScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="HistoryTest" 
        component={HistoryTestScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="DetailHistory" 
        component={DetailHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ReviewLesson" 
        component={ReviewLessonScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="QuizMenu" 
        component={QuizScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="DrawerHome"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
