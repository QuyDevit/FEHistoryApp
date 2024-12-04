
import { View, StyleSheet } from 'react-native'
import React from 'react'
import ResultRedo from '../components/ResultRedo';


const ResultRedoScreen = () => {
  return (
    <View style={styles.container}>
      <ResultRedo/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default ResultRedoScreen