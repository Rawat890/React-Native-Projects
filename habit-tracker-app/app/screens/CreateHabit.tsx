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
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <Ionicons name='arrow-back' size={24} color={COLORS.black} />
        <Text style={styles.normalText}>Create Habit</Text>

        <View style={styles.input}>
          <InputWithIcon
            label="Habit"
            placeholder="Enter your habit..."
            keyboardType="email-address"
          />
        </View>

        <View>
          <Text style={styles.normalText}>Color</Text>
          <View style={styles.colorContainer}>
            {
              habitColors.map((item, index) => (
                <TouchableOpacity key={index} style={{ marginTop: scale(4) }}>
                  <FontAwesome name='square' size={30} color={item} />
                </TouchableOpacity>
              ))
            }
          </View>
        </View>

        <View style={{ marginTop: scale(10) }}>
          <Text style={styles.normalText}>Repeat</Text>
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

        <View style={{ marginTop: scale(10) }}>
          <Text style={styles.normalText}>On These days</Text>
          <View style={styles.week}>
            {
              days.map((item, index) => (
                <TouchableOpacity key={index} style={styles.weekButton}>
                  <Text>{item}</Text>
                </TouchableOpacity>

              ))
            }
          </View>
        </View>

        <View style={{marginTop: scale(10)}}>
          <Text style={styles.normalText}>Reminder</Text>
        </View>

        <TextButton title='Save Habit' backgroundColor={COLORS.success} style={{marginTop: scale(20), marginHorizontal: scale(0)}}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginHorizontal: scale(10)
  },
  input: {
    marginHorizontal: scale(10),
  },
  colorContainer: {
    flexDirection: 'row',
    gap: scale(10)
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: scale(10),
  },
  button: {
    width: scale(150)
  },
  week: {
    flexDirection: 'row',
    gap: scale(10),
    marginTop: scale(10),
  },
  weekButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(8),
    backgroundColor: COLORS.gray200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  normalText: {
    fontSize: scale(14),
    fontWeight: '400',
  }
})