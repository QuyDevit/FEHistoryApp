import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { login, checkAuthStatus } from '../redux/authSlice';
import { showMessage } from "react-native-flash-message";

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await dispatch(checkAuthStatus()).unwrap();
        if (result.status) {
          navigation.navigate('DrawerHome');
        }
      } catch (error) {
        console.log('Auth check failed:', error);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        showMessage({
          message: "Vui lòng nhập mật khẩu và tài khoản",
          type: "warning",
          duration: 2000,
        });
        return;
      }

      const result = await dispatch(login({ emailOrUsername: username, password })).unwrap();
      console.log('Login result:', result); 
      
      if (result) {
        showMessage({
          message: "Đăng nhập thành công!",
          type: "success",
          duration: 2000,
        });
        navigation.reset({
          index: 0,
          routes: [{ name: 'DrawerHome' }],
        });
      }
    } catch (error) {
      console.error('Login error:', error); 
      showMessage({
        message: error.toString(),
        type: "danger",
        duration: 2000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Chào Mừng Trở Lại</Text>
          <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>
        </View>

        <View style={styles.loginForm}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tài khoản</Text>
            <TextInput 
              style={styles.loginInput}
              placeholder="Nhập tài khoản của bạn"
              placeholderTextColor="#A0AEC0"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput 
              style={styles.loginInput}
              placeholder="Nhập mật khẩu của bạn"
              placeholderTextColor="#A0AEC0"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <TouchableOpacity 
            style={[styles.loginButton, loading === 'loading' && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading === 'loading'}
          >
            <Text style={styles.buttonText}>
              {loading === 'loading' ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Bạn chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>hoặc tiếp tục với</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.socialButton}>
            <Image 
              source={require('../assets/Images/gg-icon.png')} 
              style={styles.socialIcon} 
            />
            <Text style={styles.socialButtonText}>Đăng nhập với Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loginContainer: {
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
  loginForm: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
    marginLeft: 4,
  },
  loginInput: {
    padding: 16,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    fontSize: 16,
    color: '#1A202C',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: -8,
  },
  forgotPassword: {
    color: '#4C1D95',
    fontSize: 14,
    fontWeight: '500',
    width:'50%',
    textAlign:'right'
  },
  loginButton: {
    padding: 16,
    backgroundColor: '#4C1D95',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
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
    width:'50%',
    textAlign:'center'
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    color: '#718096',
    fontSize: 14,
    fontWeight: '500',
    width:'30%',
    textAlign:'center'
  },
  socialButton: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#1A202C',
    fontWeight: '500',
    width:'48%',
    textAlign:'center'
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  registerText: {
    color: '#718096',
    fontSize: 14,
  },
  registerLink: {
    color: '#4C1D95',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default Login;
