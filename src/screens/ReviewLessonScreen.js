
import { View, StyleSheet } from 'react-native'
import React from 'react'
import ReviewLesson from '../components/ReviewLesson';


const ReviewLessonScreen = () => {
  return (
    <View style={styles.container}>
      <ReviewLesson/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default ReviewLessonScreen