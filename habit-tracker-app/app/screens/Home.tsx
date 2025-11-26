import { View, Text, StyleSheet, Alert, Image, Pressable, ScrollView, Platform } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { AntDesign, Ionicons, MaterialIcons, FontAwesome, Octicons, FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import TextButton from '../components/TextButton';
import { scale } from 'react-native-size-matters';
import { SCREENS } from '../utils/routes';
import { navigate } from '../utils/navigationService';
import axios from 'axios';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import WrapperWithGradient from '../components/WrapperWithGradient';

export default function Home() {
  const [option, setOption] = useState('Today');
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: 'short'
  }).slice(0, 3)

  console.log(currentDay)

  useFocusEffect(
    useCallback(() => {
      fetchHabitsList();
    }, [])
  );

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchHabitsList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://192.168.29.24:3000/habitsList`);
      await wait(1000);
      if (response.status === 200) {
        setHabits(response.data);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch the habits list.");
    }
    finally {
      setLoading(false);
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) setSelectedHabit(null);
  }, []);

  const createHabit = () => {
    navigate(SCREENS.CreateHabit, { onHabitAdded: fetchHabitsList });
  };

  const handleHabitPress = (habit) => {
    if (selectedHabit?._id === habit._id) {
      bottomSheetRef.current?.close();
    } else {
      setSelectedHabit(habit);
      bottomSheetRef.current?.expand();
    }
  };

  const handleCompletionOfHabit = async () => {
    try {
      const habitId = selectedHabit?._id;
      const updatedCompletion = {
        ...selectedHabit?.completed,
        [currentDay]: true,
      }

      await axios.put(`http://192.168.29.24:3000/create-habit/${habitId}/completed`, {
        completed: updatedCompletion,
      })
      bottomSheetRef.current?.close();
      await fetchHabitsList();

    } catch (error) {
      Alert.alert("Failed to mark habit as completed, Please try again later.")
      bottomSheetRef.current?.close();
    }
  }

  //fetch habits that are not completed for today
  const filteredHabits = habits?.filter((habit) => {
    const completedObj = habit.completed || {};
    return !completedObj[currentDay];
  });

  console.log('Filtered Habits - ', filteredHabits)
  return (
    <GestureHandlerRootView>
      <WrapperWithGradient>
      <View style={styles.iconContainer}>
        <Ionicons name='logo-foursquare' size={24} color={COLORS.white} />
        <Text style={styles.text}>Habit Tracking App</Text>
        <AntDesign name='plus' size={24} color={COLORS.white} onPress={createHabit} />
      </View>
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>

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
        {option === "Today" && <Text style={{textAlign:'center', fontSize: scale(14), marginTop: scale(10)}}>Today scheduled Habits</Text>}
        {option === "Weekly" && <Text style={{textAlign:'center', fontSize: scale(14), marginTop: scale(10)}}>Weekly scheduled Habits</Text>}

        {option === "Today" && (filteredHabits.length > 0 ? (
          <ScrollView contentContainerStyle={styles.habitsContainer} showsVerticalScrollIndicator={false}>
            {filteredHabits.map((habit) => (
              <TextButton
                key={habit._id}
                title={habit.title}
                style={styles.habitStyle}
                backgroundColor={habit.color || COLORS.secondary}
                onPress={() => handleHabitPress(habit)}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noHabitContainer}>
            <Image
              style={{ width: 60, height: 60, resizeMode: 'contain' }}
              source={require('../../assets/icons/empty.png')}
            />
            <Text style={styles.noHabitsText}>No habits scheduled today</Text>
          </View>
        ))}

        {option === "Weekly" && (
          <ScrollView contentContainerStyle={styles.habitsContainer} showsVerticalScrollIndicator={false}>
            {habits.map((habit) => (
              <Pressable key={habit?._id} style={[styles.weeklyHabitStyle, { backgroundColor: habit.color ? habit.color : COLORS.secondary }]}>
                <Text style={styles.weeklyHabitTitle}>{habit.title}</Text>
                <Text style={styles.weeklyHabitRepeat}>{habit.repeatMode}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

      </View>
      </WrapperWithGradient>
      {/* Bottom Sheet */}
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

              <Pressable style={styles.bottomSheetOption} onPress={handleCompletionOfHabit}>
                <Octicons name="tracked-by-closed-completed" size={24} color="black" />
                <Text> Completed</Text>
              </Pressable>

              <Pressable style={styles.bottomSheetOption} onPress={handleCompletionOfHabit}>
                <Ionicons name="play-skip-forward-circle-outline" size={24} color="black" />
                <Text> Skip</Text>
              </Pressable>

              <Pressable style={styles.bottomSheetOption} onPress={handleCompletionOfHabit}>
                <FontAwesome name="edit" size={24} color="black" />
                <Text> Edit</Text>
              </Pressable>

              <Pressable style={styles.bottomSheetOption} onPress={handleCompletionOfHabit}>
                <FontAwesome6 name="file-archive" size={24} color="black" />
                <Text> Archive</Text>
              </Pressable>

              <Pressable style={styles.bottomSheetOption} onPress={handleCompletionOfHabit}>
                <MaterialIcons name="delete-outline" size={24} color="black" />
                <Text> Delete</Text>
              </Pressable>
            </>
          ) : null}
        </BottomSheetView>
      </BottomSheet>

      {/* {loading && <Loader visible={loading} />} */}
    </GestureHandlerRootView>

  );
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.success,
    padding: scale(10),
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: scale(20),
  },
  noHabitsText: {
    fontSize: scale(14),
    fontWeight: '400',
    textAlign: 'center',
    marginVertical: scale(10),
  },
  text: {
    fontSize: Platform.OS ==='android' ? scale(20) : scale(16),
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.white
  },
  textButton: {
    fontSize: scale(11),
  },
  habitStyle: {
    marginVertical: scale(5),
    marginHorizontal: scale(20),
    borderRadius: scale(25),
  },
  habitsContainer: {
    marginTop: scale(5),
    paddingBottom: scale(28)
  },
  noHabitContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(210)
  },
  bottomSheetOption: {
    flexDirection: 'row',
    gap: scale(10),
    marginVertical: scale(5),
    alignItems: 'center',
  },
  weeklyHabitStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: scale(5),
    marginHorizontal: scale(15),
    borderRadius: scale(25),
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
  },
  weeklyHabitTitle: {
    fontSize: scale(14),
    fontWeight: '500',
    color: COLORS.white
  },
  weeklyHabitRepeat: {
    fontSize: scale(12),
    fontWeight: '500',
    color: COLORS.white
  }

});
