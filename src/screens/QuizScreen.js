
import { View, StyleSheet } from 'react-native'
import React from 'react'
import QuizMenu from '../components/QuizMenu';


const QuizScreen = () => {
  return (
    <View style={styles.container}>
      <QuizMenu/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default QuizScreen