import { View, StyleSheet } from 'react-native'
import React from 'react'
import HistoryTest from '../components/HistoryTest';


const HistoryTestScreen = () => {
  return (
    <View style={styles.container}>
      <HistoryTest/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default HistoryTestScreen