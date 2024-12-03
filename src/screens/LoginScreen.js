
import { View, StyleSheet } from 'react-native'
import React from 'react'
import Login from '../components/Login';


const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Login/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default LoginScreen