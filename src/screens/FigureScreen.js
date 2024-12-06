import { View, StyleSheet } from 'react-native'
import React from 'react'
import Figure from '../components/Figure';


const FigureScreen = () => {
  return (
    <View style={styles.container}>
      <Figure/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default FigureScreen