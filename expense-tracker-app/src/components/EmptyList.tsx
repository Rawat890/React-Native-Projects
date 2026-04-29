import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { scale } from 'react-native-size-matters'
import { fonts } from '../utils/fonts'

const EmptyList = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.noExpenseText}>No expenses added yet.</Text>
    </View>
  )
}

const styles= StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  noExpenseText:{
    fontSize: scale(16),
    fontFamily: fonts.balooSemi
  }
})

export default EmptyList