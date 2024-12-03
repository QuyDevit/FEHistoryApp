
import { View, StyleSheet } from 'react-native'
import React from 'react'
import InfoUser from '../components/InfoUser'


const InfoUserScreen = () => {
  return (
    <View style={styles.container}>
      <InfoUser/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default InfoUserScreen