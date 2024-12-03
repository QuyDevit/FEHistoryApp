
import { View, StyleSheet } from 'react-native'
import React from 'react'
import RedoTest from '../components/RedoTest';


const RedoTestScreen = () => {
  return (
    <View style={styles.container}>
      <RedoTest/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default RedoTestScreen