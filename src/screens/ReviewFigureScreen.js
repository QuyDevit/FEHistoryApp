import { View, StyleSheet } from 'react-native'
import React from 'react'
import ReviewFigure from '../components/ReviewFigure';


const ReviewFigureScreen = () => {
  return (
    <View style={styles.container}>
      <ReviewFigure/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default ReviewFigureScreen