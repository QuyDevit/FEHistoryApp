
import { View, StyleSheet } from 'react-native'
import React from 'react'
import Result from '../components/Result';


const ResultScreen = () => {
  return (
    <View style={styles.container}>
      <Result/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default ResultScreen