import { View, StyleSheet } from 'react-native'
import React from 'react'
import FigureMenu from '../components/FigureMenu';


const FigureMenuScreen = () => {
  return (
    <View style={styles.container}>
      <FigureMenu/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default FigureMenuScreen