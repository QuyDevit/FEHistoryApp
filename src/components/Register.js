import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/authSlice';
import { showMessage } from 'react-native-flash-message';

const Register = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [school, setSchool] = useState('');
  const [gradeId, setGradeId] = useState(1);

  const grades = [
    { id: 1, name: "Lớp 10" },
    { id: 2, name: "Lớp 11" },
    { id: 3, name: "Lớp 12" }
  ];

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      showMessage({
        message: 'Mật khẩu xác nhận không khớp',
        type: "danger",
        duration: 2000,
      });
      return;
    }

    const userData = {
      fullName,
      userName,
      email,
      password,
      school,
      gradeId,
    };

    try {
      const result = await dispatch(register(userData)).unwrap();
      if (result.status) {
        showMessage({
          message: "Đăng ký thành công",
          type: "success",
          duration: 2000,
        });
        navigation.navigate('Login');
      }
    } catch (error) {
      showMessage({
        message: typeof error === 'string' ? error : 'Có lỗi xảy ra',
        type: "danger",
        duration: 2000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.registerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Tạo Tài Khoản</Text>
          <Text style={styles.subtitle}>Đăng ký để tiếp tục</Text>
        </View>

        <ScrollView style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập họ và tên"
              placeholderTextColor="#A0AEC0"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tên đăng nhập</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên đăng nhập"
              placeholderTextColor="#A0AEC0"
              value={userName}
              onChangeText={setUserName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập email"
              placeholderTextColor="#A0AEC0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              placeholderTextColor="#A0AEC0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập xác nhận mật khẩu"
              placeholderTextColor="#A0AEC0"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Trường học</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập trường học (Không bắt buộc)"
              placeholderTextColor="#A0AEC0"
              value={school}
              onChangeText={setSchool}
            />
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.buttonText}>Đăng Ký</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  registerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    letterSpacing: 0.3,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
    marginLeft: 4,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gradeOption: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#F7FAFC',
  },
  gradeOptionSelected: {
    backgroundColor: '#4C1D95',
  },
  gradeOptionText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
    width: '100%',
    textAlign: 'center',
  },
  gradeOptionTextSelected: {
    color: '#FFFFFF',
  },
  registerButton: {
    padding: 16,
    backgroundColor: '#4C1D95',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#4C1D95',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  loginText: {
    color: '#718096',
    fontSize: 14,
  },
  loginLink: {
    color: '#4C1D95',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Register;
