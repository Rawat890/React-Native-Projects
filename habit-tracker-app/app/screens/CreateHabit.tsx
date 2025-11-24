import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../utils/colors'

export default function CreateHabit() {
  return (
    <View>
      <Ionicons name='arrow-back' size={24} color={COLORS.black}/>
      <Text>Create Habit</Text>
    </View>
  )
}