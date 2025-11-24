import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import TextButton from '../components/TextButton';
import { scale } from 'react-native-size-matters';

export default function Home() {
  const [option, setOption] = useState('Today');

  return (
    <ScrollView>
      <View style={styles.iconContainer}>
        <Ionicons name='logo-foursquare' size={24} color={COLORS.black} />
        <Text style={styles.text}>Habit Tracking App</Text>

        <AntDesign name='plus' size={24} color={COLORS.black} />
      </View>
      <View style={styles.buttonContainer}>
        <TextButton
          title='Today'
          backgroundColor={option === "Today" ? COLORS.primary : COLORS.gray300}
          style={styles.button}
          onPress={() => setOption('Today')}

        />
        <TextButton
          title='Weekly'
          backgroundColor={option === "Weekly" ? COLORS.secondary : COLORS.gray300}
          style={styles.button}
          onPress={() => setOption('Weekly')}
        />
        <TextButton
          title='Overall'
          backgroundColor={option === "Overall" ? COLORS.success : COLORS.gray300}
          style={styles.button}
          onPress={() => setOption('Overall')}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(10),
    marginHorizontal: scale(10)
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: scale(10)
  },
  button: {
    marginVertical: scale(5),
  },
  text: {
    fontSize: scale(20),
    fontWeight: 'bold',
    textAlign: 'center',
  }
})