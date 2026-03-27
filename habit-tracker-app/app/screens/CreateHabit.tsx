import { AntDesign, Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { scale } from 'react-native-size-matters'
import InputWithIcon from '../components/InputWithIcon'
import WrapperWithGradient from '../components/WrapperWithGradient'
import { COLORS, habitColors } from '../utils/colors'
import { goBack } from '../utils/navigationService'
import { days } from '../utils/others'

function FadeSlide({ delay = 0, children }) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(14)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start()
  }, [])

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  )
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ text }) {
  return <Text style={styles.sectionLabel}>{text}</Text>
}

export default function CreateHabit({ route }) {
  const [selectedColor, setSelectedColor] = useState("")
  const [title, setTitle] = useState("")
  const [selectedRepeat, setSelectedRepeat] = useState("daily")
  const [selectedDays, setSelectedDays] = useState([])
  const { onHabitAdded } = route.params || {}

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const addHabitToBackend = async () => {
    try {
      if (title === "") {
        Alert.alert("Please enter a habit!")
        return
      }
      const habitDetails = {
        title,
        color: selectedColor,
        repeatMode: selectedRepeat,
        reminder: true,
      }
      const response = await axios.post("http://10.12.178.201:3000/habits", habitDetails)
      if (response.status === 200) {
        setTitle("")
        Alert.alert("Success", "Habit added successfully")
      }
      console.log('Habit added - ', response.data)
    } catch (error) {
      console.log("Error adding a habit - ", error)
    }
  }

  const navigateBack = () => {
    onHabitAdded?.()
    goBack()
  }

  const saveScale = useRef(new Animated.Value(1)).current
  const onSavePressIn = () =>
    Animated.spring(saveScale, { toValue: 0.96, useNativeDriver: true, speed: 40 }).start()
  const onSavePressOut = () =>
    Animated.spring(saveScale, { toValue: 1, useNativeDriver: true, speed: 40 }).start()

  return (
    <WrapperWithGradient>
      <FadeSlide delay={0}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={navigateBack}>
            <Ionicons name="arrow-back" size={18} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Habit</Text>
          <View style={{ width: scale(36) }} />
        </View>
      </FadeSlide>

      <View style={styles.body}>

        {/* Title input */}
        <FadeSlide delay={60}>
          <View style={styles.section}>
            <SectionLabel text="Habit name" />
            <View style={styles.inputWrap}>
              <InputWithIcon
                label="Habit"
                placeholder="Enter your habit..."
                keyboardType="default"
                value={title}
                onChangeText={(text) => setTitle(text)}
              />
            </View>
          </View>
        </FadeSlide>

        {/* Color picker */}
        <FadeSlide delay={120}>
          <View style={styles.section}>
            <SectionLabel text="Choose colour" />
            <View style={styles.colorRow}>
              {habitColors.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedColor(item)}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: item },
                    selectedColor === item && styles.colorSwatchSelected,
                  ]}
                >
                  {selectedColor === item && (
                    <AntDesign name="check" size={14} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </FadeSlide>

        {/* Repeat mode */}
        <FadeSlide delay={180}>
          <View style={styles.section}>
            <SectionLabel text="Repeat" />
            <View style={styles.repeatRow}>
              {['Daily', 'Weekly'].map((mode) => {
                const active = selectedRepeat === mode.toLowerCase()
                return (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => setSelectedRepeat(mode.toLowerCase())}
                    style={[
                      styles.repeatPill,
                      active && {
                        backgroundColor: COLORS.accentSoft,
                        borderColor: COLORS.accent + '60',
                      },
                    ]}
                  >
                    <Text style={[styles.repeatPillText, active && { color: COLORS.accent }]}>
                      {mode}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </FadeSlide>

        {/* Days */}
        <FadeSlide delay={240}>
          <View style={styles.section}>
            <SectionLabel text="On these days" />
            <View style={styles.daysRow}>
              {days.map((item, index) => {
                const active = selectedDays.includes(item)
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => toggleDay(item)}
                    style={[
                      styles.dayBtn,
                      active && {
                        backgroundColor: selectedColor || COLORS.accent,
                        borderColor: 'transparent',
                      },
                    ]}
                  >
                    <Text style={[styles.dayBtnText, active && { color: '#fff' }]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </FadeSlide>

        {/* Reminder */}
        <FadeSlide delay={300}>
          <View style={[styles.section, styles.reminderRow]}>
            <View>
              <Text style={styles.reminderTitle}>Reminder</Text>
              <Text style={styles.reminderSub}>Get notified to stay on track</Text>
            </View>
            <View style={styles.reminderBadge}>
              <Ionicons name="notifications-outline" size={16} color={COLORS.accent} />
              <Text style={styles.reminderBadgeText}>On</Text>
            </View>
          </View>
        </FadeSlide>

        {/* Save button */}
        <FadeSlide delay={360}>
          <Animated.View style={{ transform: [{ scale: saveScale }], marginTop: scale(24) }}>
            <TouchableOpacity
              style={[
                styles.saveBtn,
                { shadowColor: selectedColor || COLORS.green },
              ]}
              onPress={addHabitToBackend}
              onPressIn={onSavePressIn}
              onPressOut={onSavePressOut}
              activeOpacity={1}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
              <Text style={styles.saveBtnText}>Save Habit</Text>
            </TouchableOpacity>
          </Animated.View>
        </FadeSlide>

      </View>
    </WrapperWithGradient>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingTop: scale(14),
    paddingBottom: scale(12),
  },
  backBtn: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  headerTitle: {
    fontSize: scale(17),
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.2,
  },
  body: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    paddingHorizontal: scale(18),
    paddingTop: scale(22),
    paddingBottom: scale(30),
  },
  section: {
    marginBottom: scale(22),
  },
  sectionLabel: {
    fontSize: scale(11),
    fontWeight: '700',
    color: COLORS.muted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: scale(10),
  },
  inputWrap: {
    backgroundColor: COLORS.surface,
    borderRadius: scale(14),
    borderWidth: 1.5,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
  },
  colorSwatch: {
    width: scale(34),
    height: scale(34),
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSwatchSelected: {
    borderWidth: 2.5,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  repeatRow: {
    flexDirection: 'row',
    gap: scale(10),
  },
  repeatPill: {
    flex: 1,
    paddingVertical: scale(11),
    borderRadius: scale(12),
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  repeatPillText: {
    fontSize: scale(13),
    fontWeight: '700',
    color: COLORS.muted,
  },
  daysRow: {
    flexDirection: 'row',
    gap: scale(8),
    flexWrap: 'wrap',
  },
  dayBtn: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  dayBtnText: {
    fontSize: scale(11),
    fontWeight: '700',
    color: COLORS.muted,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: scale(16),
    paddingVertical: scale(14),
  },
  reminderTitle: {
    fontSize: scale(14),
    fontWeight: '700',
    color: COLORS.text,
  },
  reminderSub: {
    fontSize: scale(11),
    color: COLORS.muted,
    marginTop: scale(2),
  },
  reminderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
    backgroundColor: COLORS.accentSoft,
    borderRadius: scale(20),
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderWidth: 1,
    borderColor: COLORS.accent + '40',
  },
  reminderBadgeText: {
    fontSize: scale(12),
    fontWeight: '700',
    color: COLORS.accent,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    backgroundColor: COLORS.green,
    borderRadius: scale(16),
    paddingVertical: scale(16),
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  saveBtnText: {
    fontSize: scale(15),
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
})