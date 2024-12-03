
import { View, StyleSheet } from 'react-native'
import React from 'react'
import Question from '../components/Question';


const QuestionScreen = () => {
  return (
    <View style={styles.container}>
      <Question/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default QuestionScreen