import { View, StyleSheet } from 'react-native'
import React from 'react'
import GuessFigure from '../components/GuessFigure';


const GuessFigureScreen = () => {
  return (
    <View style={styles.container}>
      <GuessFigure/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default GuessFigureScreen