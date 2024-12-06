import { View, StyleSheet } from 'react-native'
import React from 'react'
import HistoryMenu from '../components/HistoryMenu';


const HistoryMenuScreen = () => {
  return (
    <View style={styles.container}>
      <HistoryMenu/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default HistoryMenuScreen