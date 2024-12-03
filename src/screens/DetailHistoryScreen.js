import { View, StyleSheet } from 'react-native'
import React from 'react'
import DetailHistory from '../components/DetailHistory';



const DetailHistoryScreen = () => {
  return (
    <View style={styles.container}>
      <DetailHistory/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default DetailHistoryScreen