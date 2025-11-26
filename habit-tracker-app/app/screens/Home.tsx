import { View, Text, StyleSheet, Alert, Image, Pressable } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AntDesign, Ionicons, MaterialIcons, FontAwesome, Octicons, FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import TextButton from '../components/TextButton';
import { scale } from 'react-native-size-matters';
import { SCREENS } from '../utils/routes';
import { navigate } from '../utils/navigationService';
import axios from 'axios';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Home() {
  const [option, setOption] = useState('Today');
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    fetchHabitsList();
  }, []);

  const fetchHabitsList = async () => {
    try {
      const response = await axios.get('http://192.168.29.24:3000/habitsList');
      if (response.status === 200) {
        setHabits(response.data);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch the habits list.");
    }
  };

  // Handle BottomSheet changes
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) setSelectedHabit(null); // Reset habit when sheet is closed
  }, []);

  const createHabit = () => {
    navigate(SCREENS.CreateHabit);
  };

  // Handle habit press
  const handleHabitPress = (habit) => {
    if (selectedHabit?._id === habit._id) {
      // Pressing the same habit closes the sheet
      bottomSheetRef.current?.close();
    } else {
      // Pressing a different habit opens or switches the sheet
      setSelectedHabit(habit);
      bottomSheetRef.current?.expand();
    }
  };

  // Handle option press inside sheet
  const handleOptionPress = (action: string) => {
    console.log(`${action} clicked for`, selectedHabit?.title);
    bottomSheetRef.current?.close();
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        {/* Header */}
        <View style={styles.iconContainer}>
          <Ionicons name='logo-foursquare' size={24} color={COLORS.black} />
          <Text style={styles.text}>Habit Tracking App</Text>
          <AntDesign name='plus' size={24} color={COLORS.black} onPress={createHabit} />
        </View>

        {/* Option buttons */}
        <View style={styles.buttonContainer}>
          <TextButton
            title='Today'
            backgroundColor={option === "Today" ? COLORS.primary : COLORS.gray300}
            onPress={() => setOption('Today')}
            textStyle={styles.textButton}
          />
          <TextButton
            title='Weekly'
            backgroundColor={option === "Weekly" ? COLORS.secondary : COLORS.gray300}
            onPress={() => setOption('Weekly')}
            textStyle={styles.textButton}
          />
          <TextButton
            title='Overall'
            backgroundColor={option === "Overall" ? COLORS.success : COLORS.gray300}
            onPress={() => setOption('Overall')}
            textStyle={styles.textButton}
          />
        </View>

        {/* Habits list */}
        {option === "Today" && habits.length > 0 ? (
          <View style={styles.habitsContainer}>
            {habits.map((habit) => (
              <TextButton
                key={habit._id}
                title={habit.title}
                style={styles.habitStyle}
                backgroundColor={habit.color || COLORS.secondary}
                onPress={() => handleHabitPress(habit)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.noHabitContainer}>
            <Image
              style={{ width: 60, height: 60, resizeMode: 'contain' }}
              source={require('../../assets/icons/empty.png')}
            />
            <Text>No habits scheduled today</Text>
          </View>
        )}
      </View>

      {/* Bottom Sheet */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1} // initially hidden
          snapPoints={[scale(250)]}
          enablePanDownToClose={true}
          onChange={handleSheetChanges}
        >
          <BottomSheetView style={{ padding: scale(20) }}>
            {selectedHabit ? (
              <>
                <Text style={{ marginVertical: scale(5), fontWeight: '500' }}>Options</Text>

                <Pressable style={styles.bottomSheetOption} onPress={() => handleOptionPress('Completed')}>
                  <Octicons name="tracked-by-closed-completed" size={24} color="black" />
                  <Text> Completed</Text>
                </Pressable>

                <Pressable style={styles.bottomSheetOption} onPress={() => handleOptionPress('Skip')}>
                  <Ionicons name="play-skip-forward-circle-outline" size={24} color="black" />
                  <Text> Skip</Text>
                </Pressable>

                <Pressable style={styles.bottomSheetOption} onPress={() => handleOptionPress('Edit')}>
                  <FontAwesome name="edit" size={24} color="black" />
                  <Text> Edit</Text>
                </Pressable>

                <Pressable style={styles.bottomSheetOption} onPress={() => handleOptionPress('Archive')}>
                  <FontAwesome6 name="file-archive" size={24} color="black" />
                  <Text> Archive</Text>
                </Pressable>

                <Pressable style={styles.bottomSheetOption} onPress={() => handleOptionPress('Delete')}>
                  <MaterialIcons name="delete-outline" size={24} color="black" />
                  <Text> Delete</Text>
                </Pressable>
              </>
            ) : null}
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(10),
    marginHorizontal: scale(10),
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: scale(20),
  },
  text: {
    fontSize: scale(16),
    fontWeight: '600',
    textAlign: 'center',
  },
  textButton: {
    fontSize: scale(11),
  },
  habitStyle: {
    marginVertical: scale(5),
    marginHorizontal: scale(10),
    borderRadius: scale(25),
  },
  habitsContainer: {
    marginTop: scale(15),
  },
  noHabitContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(-50),
  },
  bottomSheetOption: {
    flexDirection: 'row',
    gap: scale(10),
    marginVertical: scale(5),
    alignItems: 'center',
  },
});
