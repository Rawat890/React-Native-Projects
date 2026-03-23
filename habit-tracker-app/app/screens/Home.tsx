import { AntDesign, Feather, FontAwesome, FontAwesome6, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';
import Loader from '../components/Loader'; // Import the Loader component
import TextButton from '../components/TextButton';
import WrapperWithGradient from '../components/WrapperWithGradient';
import { COLORS } from '../utils/colors';
import { navigate } from '../utils/navigationService';
import { longDays } from '../utils/others';
import { SCREENS } from '../utils/routes';

export default function Home() {
  const [option, setOption] = useState('Today');
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaderText, setLoaderText] = useState<string>('Loading...'); // For dynamic loader text

  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: 'short'
  }).slice(0, 3)

  useFocusEffect(
    useCallback(() => {
      fetchHabitsList();
    }, [])
  );

  const fetchHabitsList = async () => {
    try {
      setLoaderText('Fetching habits...');
      setLoading(true);
      const response = await axios.get(`http://10.12.178.201:3000/habitsList`);
      if (response.status === 200) {
        setHabits(Array.isArray(response.data) ? response.data : []);
      } else {
        setHabits([]);
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
      Alert.alert("Error", "Failed to fetch the habits list.");
      setHabits([]);
    } finally {
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
      setLoaderText('Marking habit as completed...');
      setLoading(true);
      
      const habitId = selectedHabit?._id;
      const updatedCompletion = {
        ...selectedHabit?.completed,
        [currentDay]: true,
      }

      await axios.put(`http://10.12.178.201:3000/habits/${habitId}/completed`, {
        completed: updatedCompletion,
      })
      
      bottomSheetRef.current?.close();
      await fetchHabitsList();
      
      Alert.alert("Success", "Habit marked as completed!");
    } catch (error) {
      console.error("Error completing habit:", error);
      Alert.alert("Error", "Failed to mark habit as completed. Please try again later.")
      bottomSheetRef.current?.close();
    } finally {
      setLoading(false);
    }
  };

  const handleSkipHabit = async () => {
    try {
      setLoaderText('Skipping habit...');
      setLoading(true);
      
      const habitId = selectedHabit?._id;
      const updatedCompletion = {
        ...selectedHabit?.completed,
        [currentDay]: false, // Mark as skipped/completed false
      }

      await axios.put(`http://10.12.178.201:3000/habits/${habitId}/completed`, {
        completed: updatedCompletion,
      })
      
      bottomSheetRef.current?.close();
      await fetchHabitsList();
      
      Alert.alert("Success", "Habit skipped for today");
    } catch (error) {
      console.error("Error skipping habit:", error);
      Alert.alert("Error", "Failed to skip habit. Please try again later.")
      bottomSheetRef.current?.close();
    } finally {
      setLoading(false);
    }
  };

  const handleEditHabit = () => {
    bottomSheetRef.current?.close();
    // Navigate to edit screen with habit data
    navigate(SCREENS.CreateHabit, { 
      habit: selectedHabit, 
      onHabitAdded: fetchHabitsList 
    });
  };

  const handleArchiveHabit = async () => {
    try {
      setLoaderText('Archiving habit...');
      setLoading(true);
      
      const habitId = selectedHabit?._id;
      const response = await axios.put(`http://10.12.178.201:3000/habits/${habitId}/archive`, {
        isArchived: true,
      })
      
      if (response.status === 200) {
        bottomSheetRef.current?.close();
        setSelectedHabit(null);
        await fetchHabitsList();
        Alert.alert("Success", "Habit archived successfully");
      }
    } catch (error) {
      console.error("Error archiving habit:", error);
      Alert.alert("Error", "Failed to archive habit. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const deletehabit = async () => {
    try {
      setLoaderText('Deleting habit...');
      setLoading(true);
      
      const habitId = selectedHabit?._id;
      console.log("deleted Habit id - ", habitId);
      
      const response = await axios.delete(`http://10.12.178.201:3000/habits/${habitId}`);

      if (response.status === 200) {
        console.log("Habit deleted successfully - ", response.data);
        
        bottomSheetRef.current?.close();
        setSelectedHabit(null);
        await fetchHabitsList();
        
        Alert.alert("Success", "Habit deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
      Alert.alert("Error", error.message || "Failed to delete habit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const filteredHabits = Array.isArray(habits) ? habits.filter((habit) => {
    const completedObj = habit.completed || {};
    return !completedObj[currentDay];
  }) : [];

  return (
    <GestureHandlerRootView>
      <WrapperWithGradient>
        {/* Loader Component */}
        <Loader 
          visible={loading} 
          text={loaderText}
          color={COLORS.primary}
          backgroundColor="rgba(0,0,0,0.5)"
        />
        
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
          {option === "Today" && <Text style={{ textAlign: 'center', fontSize: scale(14), marginTop: scale(10) }}>Today scheduled Habits</Text>}
          {option === "Weekly" && <Text style={{ textAlign: 'center', fontSize: scale(14), marginTop: scale(10) }}>Weekly scheduled Habits</Text>}

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
              {Array.isArray(habits) && habits.map((habit) => (
                <Pressable key={habit?._id} style={[styles.weeklyHabitStyle, { backgroundColor: habit.color ? habit.color : COLORS.secondary }]}>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.weeklyHabitTitle}>{habit.title}</Text>
                    <Text style={styles.weeklyHabitRepeat}>{habit.repeatMode}</Text>
                  </View>

                  <View style={styles.daysContainer}>
                    {longDays.map((day, index) => {
                      const isCompleted = habit.completed && habit.completed[day];
                      return (
                        <Pressable key={index} style={{ alignItems: 'center', flexDirection: 'column' }}>
                          <Text style={{ color: day === currentDay ? 'red' : "white", fontWeight: '800', fontSize: 12 }}>{day[0]}</Text> 
                          {isCompleted ? (
                            <FontAwesome name='circle' color={COLORS.white} size={24} style={{ marginTop: scale(10) }} />
                          ) : (
                            <Feather name='circle' color={COLORS.white} size={24} style={{ marginTop: scale(10) }} />
                          )}
                        </Pressable>
                      );
                    })}
                  </View>

                </Pressable>
              ))}
            </ScrollView>
          )}

        </View>
      </WrapperWithGradient>
      
      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={[scale(280)]}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={{ padding: scale(20) }}>
          {selectedHabit ? (
            <>
              <Text style={{ marginVertical: scale(5), fontWeight: '500', fontSize: scale(16) }}>Options for "{selectedHabit.title}"</Text>
              <View style={styles.divider} />

              <Pressable style={styles.bottomSheetOption} onPress={handleCompletionOfHabit}>
                <Octicons name="tracked-by-closed-completed" size={24} color={COLORS.success} />
                <Text style={styles.optionText}> Mark as Completed</Text>
              </Pressable>

              <Pressable style={styles.bottomSheetOption} onPress={handleSkipHabit}>
                <Ionicons name="play-skip-forward-circle-outline" size={24} color={COLORS.warning} />
                <Text style={styles.optionText}> Skip for Today</Text>
              </Pressable>

              <Pressable style={styles.bottomSheetOption} onPress={handleEditHabit}>
                <FontAwesome name="edit" size={24} color={COLORS.primary} />
                <Text style={styles.optionText}> Edit Habit</Text>
              </Pressable>

              <Pressable style={styles.bottomSheetOption} onPress={handleArchiveHabit}>
                <FontAwesome6 name="file-archive" size={24} color={COLORS.secondary} />
                <Text style={styles.optionText}> Archive Habit</Text>
              </Pressable>

              <Pressable style={styles.bottomSheetOption} onPress={deletehabit}>
                <MaterialIcons name="delete-outline" size={24} color={COLORS.danger} />
                <Text style={[styles.optionText, { color: COLORS.danger }]}> Delete Habit</Text>
              </Pressable>
            </>
          ) : null}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.success,
    marginVertical: scale(16),
    marginHorizontal: scale(16),
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
    fontSize: Platform.OS === 'android' ? scale(20) : scale(16),
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
    gap: scale(12),
    marginVertical: scale(8),
    alignItems: 'center',
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(10),
    backgroundColor: COLORS.gray100,
  },
  optionText: {
    fontSize: scale(14),
    fontWeight: '500',
    color: COLORS.black,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray300,
    marginVertical: scale(10),
  },
  weeklyHabitStyle: {
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
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: scale(10),
  }
});