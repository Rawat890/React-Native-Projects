import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { COLORS, habitColors } from '../utils/colors'
import InputWithIcon from '../components/InputWithIcon'
import { scale } from 'react-native-size-matters'
import TextButton from '../components/TextButton'
import { days } from '../utils/others'

export default function CreateHabit() {
  return (
    <View style={styles.container}>
      <Ionicons name='arrow-back' size={24} color={COLORS.black} />
      <Text>Create Habit</Text>

      <View style={styles.input}>
        <InputWithIcon
          label="Habit"
          placeholder="Enter your habit..."
          keyboardType="email-address"
        />
      </View>

      <View>
        <Text>Color</Text>
        <View style={styles.colorContainer}>
          {
            habitColors.map((item, index) => (
              <TouchableOpacity key={index}>
                <FontAwesome name='square' size={30} color={item} />
              </TouchableOpacity>
            ))
          }
        </View>
      </View>

      <View>
        <Text>Repeat</Text>
        <View style={styles.btnContainer}>
          <TextButton
            title='Daily'
            style={styles.button}
          />
          <TextButton
            title='Weekly'
            style={styles.button}
          />
        </View>
      </View>

      <View style={styles.week}>
        {
          days.map((item, index) => (
            <TextButton
              key={index}
              title={item}
              backgroundColor={COLORS.gray300}
              textStyle={{ color: COLORS.black }}
              style={styles.weekButton}
            />

          ))
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  input: {
    marginHorizontal: scale(10),
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: scale(10),
  },
  button: {
    width: scale(160)
  },
  week: {
    flexDirection: 'row',
    gap: scale(5),
    marginTop: scale(10),
  },
  weekButton: {
    width: scale(106),
    height: scale(36),
    borderRadius: scale(8),
  }
})