import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { getInfoUser, updateInfo ,saveUserInfo} from '../redux/authSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from "react-native-flash-message";

const InfoUser = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const [formData, setFormData] = useState({
    id: '',
    school: '',
    fullName: '',
    email: '',
    gradeId: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(getInfoUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        school: user.school || '',
        fullName: user.fullName || '',
        email: user.email || '',
        gradeId: user.gradeId?.toString() || '',
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    if (isEditing) {
      try {
        const result = await dispatch(saveUserInfo(formData)).unwrap();
        if (result) {
          setIsEditing(false);
          showMessage({
            message: "Thành công",
            description: "Cập nhật thông tin thành công",
            type: "success",
            icon: "success",
            duration: 2000,
          });
        }
      } catch (error) {
        console.error('Update failed:', error);
        showMessage({
          message: "Thất bại",
          description: error?.toString() || "Có lỗi xảy ra khi cập nhật thông tin",
          type: "danger",
          icon: "danger",
          duration: 2000,
        });
      }
    } else {
      setIsEditing(true);
    }
  };

  const grades = [
    { label: "Lớp 10", value: "1" },
    { label: "Lớp 11", value: "2" },
    { label: "Lớp 12", value: "3" }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Entypo name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.appBarText}>THÔNG TIN CÁ NHÂN</Text>
        
      
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Thông tin người dùng</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Icon 
              name={isEditing ? "close" : "edit"} 
              size={24} 
              color="#2196F3"
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Trường học</Text>
            <TextInput
              style={[
                styles.input,
                !isEditing && styles.disabledInput,
                { textAlignVertical: 'top' }
              ]}
              value={formData.school}
              onChangeText={(text) => setFormData({...formData, school: text})}
              placeholder="Nhập tên trường"
              placeholderTextColor="#A0A0A0"
              editable={isEditing}
              multiline={true}
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
              style={[
                styles.input,
                !isEditing && styles.disabledInput
              ]}
              value={formData.fullName}
              onChangeText={(text) => setFormData({...formData, fullName: text})}
              placeholder="Nhập họ và tên"
              placeholderTextColor="#A0A0A0"
              editable={isEditing}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                !isEditing && styles.disabledInput
              ]}
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              keyboardType="email-address"
              placeholder="Nhập email"
              placeholderTextColor="#A0A0A0"
              autoCapitalize="none"
              editable={isEditing}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Khối lớp</Text>
            <Dropdown
              style={[
                styles.dropdown,
                !isEditing && styles.disabledInput
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={grades}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Chọn khối lớp"
              value={formData.gradeId}
              onChange={item => {
                setFormData({...formData, gradeId: item.value});
              }}
              disable={!isEditing}
            />
          </View>

          {isEditing && (
            <TouchableOpacity 
              style={[styles.button, loading === 'loading' && styles.buttonDisabled]}
              onPress={handleUpdate}
              disabled={loading === 'loading'}
            >
              <Text style={styles.buttonText}>
                {loading === 'loading' ? 'Đang cập nhật...' : 'Lưu thông tin'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    padding: 8,
    backgroundColor: '#F5F8FF',
    borderRadius: 12,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
    paddingLeft: 4,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    color: '#1A1A1A',
  },
  dropdown: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  placeholderStyle: {
    fontSize: 15,
    color: '#A0A0A0',
  },
  selectedTextStyle: {
    fontSize: 15,
    color: '#1A1A1A',
  },
  button: {
    height: 48,
    backgroundColor: '#2196F3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#90CAF9',
    opacity: 0.8,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  disabledInput: {
    backgroundColor: '#FAFAFA',
    borderColor: '#EEEEEE',
    color: '#757575',
  },
  appBar: {
    height: Platform.OS === 'ios' ? 96 : 56,
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
});

export default InfoUser;
