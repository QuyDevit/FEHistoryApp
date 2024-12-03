
import { View, StyleSheet } from 'react-native'
import React from 'react'
import Register from '../components/Register';


const RegisterScreen = () => {
  return (
    <View style={styles.container}>
      <Register/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default RegisterScreen