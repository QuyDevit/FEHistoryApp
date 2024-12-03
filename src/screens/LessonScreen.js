
import { View, StyleSheet } from 'react-native'
import React from 'react'
import Lesson from '../components/Lesson';


const LessonScreen = () => {
  return (
    <View style={styles.container}>
      <Lesson/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default LessonScreen