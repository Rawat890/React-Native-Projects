import { AntDesign, FontAwesome, FontAwesome6, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';
import Loader from '../components/Loader';
import WrapperWithGradient from '../components/WrapperWithGradient';
import { COLORS } from '../utils/colors';
import { navigate } from '../utils/navigationService';
import { longDays } from '../utils/others';
import { SCREENS } from '../utils/routes';

function HabitCard({ habit, onPress, index }) {
  const scale_anim = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.spring(scale_anim, {
        toValue: 1,
        delay: index * 60,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }),
    ]).start();
  }, []);

  const pressScale = useRef(new Animated.Value(1)).current;
  const onPressIn = () =>
    Animated.spring(pressScale, { toValue: 0.96, useNativeDriver: true, speed: 40 }).start();
  const onPressOut = () =>
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, speed: 40 }).start();

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ scale: scale_anim }, { scale: pressScale }],
      }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.habitCard, { borderLeftColor: habit.color || COLORS.accent }]}
      >
        <View style={[styles.habitDot, { backgroundColor: habit.color || COLORS.accent }]} />
        <Text style={styles.habitCardTitle} numberOfLines={1}>{habit.title}</Text>
        <View style={[styles.habitArrow]}>
          <AntDesign name="right" size={12} color={COLORS.muted} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

function WeeklyHabitCard({ habit, currentDay, index }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay: index * 70, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, delay: index * 70, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Pressable style={[styles.weeklyCard, { borderLeftColor: habit.color || COLORS.accent }]}>
        <View style={styles.weeklyCardHeader}>
          <Text style={styles.weeklyHabitTitle} numberOfLines={1}>{habit.title}</Text>
          <View style={[styles.repeatBadge, { backgroundColor: (habit.color || COLORS.accent) + '25' }]}>
            <Text style={[styles.weeklyHabitRepeat, { color: habit.color || COLORS.accent }]}>
              {habit.repeatMode}
            </Text>
          </View>
        </View>

        <View style={styles.daysContainer}>
          {longDays.map((day, i) => {
            const isCompleted = habit.completed && habit.completed[day];
            const isToday = day === currentDay;
            return (
              <View key={i} style={styles.dayCell}>
                <Text style={[
                  styles.dayLetter,
                  isToday && styles.dayLetterToday,
                ]}>
                  {day[0]}
                </Text>
                {isCompleted ? (
                  <View style={[styles.dayCircleFilled, { backgroundColor: habit.color || COLORS.accent }]}>
                    <AntDesign name="check" size={10} color="#fff" />
                  </View>
                ) : (
                  <View style={[styles.dayCircleEmpty, isToday && { borderColor: COLORS.orange }]} />
                )}
              </View>
            );
          })}
        </View>
      </Pressable>
    </Animated.View>
  );
}

function TabPill({ title, active, color, onPress }) {
  const scale_anim = useRef(new Animated.Value(1)).current;
  const press = () => {
    Animated.sequence([
      Animated.timing(scale_anim, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.timing(scale_anim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    onPress();
  };
  return (
    <Animated.View style={{ transform: [{ scale: scale_anim }] }}>
      <Pressable
        onPress={press}
        style={[
          styles.tabPill,
          active
            ? { backgroundColor: color, shadowColor: color, shadowOpacity: 0.35, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4 }
            : { backgroundColor: COLORS.surface, borderColor: COLORS.border },
        ]}
      >
        <Text style={[styles.tabPillText, active ? { color: COLORS.white } : { color: COLORS.muted }]}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function SheetOption({ icon, label, color = COLORS.text, onPress, danger = false }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.sheetOption, danger && { backgroundColor: COLORS.dangerSoft }]}
    >
      {icon}
      <Text style={[styles.sheetOptionText, { color }]}>{label}</Text>
    </Pressable>
  );
}

export default function Home() {
  const [option, setOption] = useState('Today');
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaderText, setLoaderText] = useState<string>('Loading...');

  const headerOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
  const todayFull = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  useFocusEffect(
    useCallback(() => { fetchHabitsList(); }, [])
  );

  const fetchHabitsList = async () => {
    try {
      setLoaderText('Fetching habits...');
      setLoading(true);
      const response = await axios.get(`http://10.12.178.201:3000/habitsList`);
      setHabits(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch the habits list.');
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) setSelectedHabit(null);
  }, []);

  const createHabit = () => navigate(SCREENS.CreateHabit, { onHabitAdded: fetchHabitsList });

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
      const updatedCompletion = { ...selectedHabit?.completed, [currentDay]: true };
      await axios.put(`http://10.12.178.201:3000/habits/${habitId}/completed`, { completed: updatedCompletion });
      bottomSheetRef.current?.close();
      await fetchHabitsList();
      Alert.alert('Success', 'Habit marked as completed!');
    } catch {
      Alert.alert('Error', 'Failed to mark habit as completed.');
      bottomSheetRef.current?.close();
    } finally { setLoading(false); }
  };

  const handleSkipHabit = async () => {
    try {
      setLoaderText('Skipping habit...');
      setLoading(true);
      const habitId = selectedHabit?._id;
      const updatedCompletion = { ...selectedHabit?.completed, [currentDay]: false };
      await axios.put(`http://10.12.178.201:3000/habits/${habitId}/completed`, { completed: updatedCompletion });
      bottomSheetRef.current?.close();
      await fetchHabitsList();
      Alert.alert('Success', 'Habit skipped for today');
    } catch {
      Alert.alert('Error', 'Failed to skip habit.');
      bottomSheetRef.current?.close();
    } finally { setLoading(false); }
  };

  const handleEditHabit = () => {
    bottomSheetRef.current?.close();
    navigate(SCREENS.CreateHabit, { habit: selectedHabit, onHabitAdded: fetchHabitsList });
  };

  const handleArchiveHabit = async () => {
    try {
      setLoaderText('Archiving habit...');
      setLoading(true);
      const habitId = selectedHabit?._id;
      const response = await axios.put(`http://10.12.178.201:3000/habits/${habitId}/archive`, { isArchived: true });
      if (response.status === 200) {
        bottomSheetRef.current?.close();
        setSelectedHabit(null);
        await fetchHabitsList();
        Alert.alert('Success', 'Habit archived successfully');
      }
    } catch {
      Alert.alert('Error', 'Failed to archive habit.');
    } finally { setLoading(false); }
  };

  const deletehabit = async () => {
    try {
      setLoaderText('Deleting habit...');
      setLoading(true);
      const habitId = selectedHabit?._id;
      const response = await axios.delete(`http://10.12.178.201:3000/habits/${habitId}`);
      if (response.status === 200) {
        bottomSheetRef.current?.close();
        setSelectedHabit(null);
        await fetchHabitsList();
        Alert.alert('Success', 'Habit deleted successfully');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to delete habit.');
    } finally { setLoading(false); }
  };

  const filteredHabits = Array.isArray(habits) ? habits.filter(h => !h.completed?.[currentDay]) : [];
  const completedToday = Array.isArray(habits) ? habits.filter(h => h.completed?.[currentDay]).length : 0;
  const totalHabits = habits.length;
  const progressPct = totalHabits > 0 ? completedToday / totalHabits : 0;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <WrapperWithGradient>
        <Loader
          visible={loading}
          text={loaderText}
          color={COLORS.primary}
          backgroundColor="rgba(0,0,0,0.6)"
        />

        {/* ── Header ── */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <View>
            <Text style={styles.headerTitle}>Habit Tracker</Text>
            <Text style={styles.headerDate}>{todayFull}</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={createHabit}>
            <AntDesign name="plus" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </Animated.View>

        {totalHabits > 0 && (
          <Animated.View style={[styles.progressCard, { opacity: headerOpacity }]}>
            <View style={styles.progressTop}>
              <Text style={styles.progressLabel}>
                {completedToday}/{totalHabits} completed today
              </Text>
              <Text style={styles.progressPct}>{Math.round(progressPct * 100)}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPct * 100}%` }]} />
            </View>
          </Animated.View>
        )}

        <View style={styles.body}>

          <View style={styles.tabRow}>
            <TabPill title="Today" active={option === 'Today'} color={COLORS.accent} onPress={() => setOption('Today')} />
            <TabPill title="Weekly" active={option === 'Weekly'} color={COLORS.green} onPress={() => setOption('Weekly')} />
            <TabPill title="Overall" active={option === 'Overall'} color={COLORS.orange} onPress={() => setOption('Overall')} />
          </View>

          {(option === 'Today' || option === 'Weekly') && (
            <Text style={styles.sectionLabel}>
              {option === 'Today' ? '📅  Today\'s habits' : '📆  This week\'s habits'}
            </Text>
          )}

          {option === 'Today' && (
            filteredHabits.length > 0 ? (
              <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                {filteredHabits.map((habit, i) => (
                  <HabitCard
                    key={habit._id}
                    habit={habit}
                    index={i}
                    onPress={() => handleHabitPress(habit)}
                  />
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🎉</Text>
                <Text style={styles.emptyTitle}>All done for today!</Text>
                <Text style={styles.emptySub}>No pending habits. Great work.</Text>
              </View>
            )
          )}

          {option === 'Weekly' && (
            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
              {Array.isArray(habits) && habits.map((habit, i) => (
                <WeeklyHabitCard key={habit._id} habit={habit} currentDay={currentDay} index={i} />
              ))}
            </ScrollView>
          )}

          {option === 'Overall' && (
            <View style={styles.overallCard}>
              <Text style={styles.overallTitle}>Overall Stats</Text>
              <View style={styles.overallRow}>
                <View style={[styles.overallStat, { borderColor: COLORS.accent + '40' }]}>
                  <Text style={[styles.overallStatVal, { color: COLORS.accent }]}>{totalHabits}</Text>
                  <Text style={styles.overallStatLabel}>Total habits</Text>
                </View>
                <View style={[styles.overallStat, { borderColor: COLORS.green + '40' }]}>
                  <Text style={[styles.overallStatVal, { color: COLORS.green }]}>{completedToday}</Text>
                  <Text style={styles.overallStatLabel}>Done today</Text>
                </View>
                <View style={[styles.overallStat, { borderColor: COLORS.orange + '40' }]}>
                  <Text style={[styles.overallStatVal, { color: COLORS.orange }]}>{totalHabits - completedToday}</Text>
                  <Text style={styles.overallStatLabel}>Remaining</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </WrapperWithGradient>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={[scale(310)]}
        enablePanDownToClose
        onChange={handleSheetChanges}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.sheetHandle}
      >
        <BottomSheetView style={styles.sheetContent}>
          {selectedHabit && (
            <>
              <View style={styles.sheetTitleRow}>
                <View style={[styles.sheetDot, { backgroundColor: selectedHabit.color || COLORS.accent }]} />
                <Text style={styles.sheetTitle} numberOfLines={1}>
                  {selectedHabit.title}
                </Text>
              </View>
              <View style={styles.sheetDivider} />

              <SheetOption
                icon={<Octicons name="tracked-by-closed-completed" size={20} color={COLORS.green} />}
                label="Mark as Completed"
                color={COLORS.green}
                onPress={handleCompletionOfHabit}
              />
              <SheetOption
                icon={<Ionicons name="play-skip-forward-circle-outline" size={20} color={COLORS.orange} />}
                label="Skip for Today"
                color={COLORS.orange}
                onPress={handleSkipHabit}
              />
              <SheetOption
                icon={<FontAwesome name="edit" size={20} color={COLORS.accent} />}
                label="Edit Habit"
                color={COLORS.accent}
                onPress={handleEditHabit}
              />
              <SheetOption
                icon={<FontAwesome6 name="file-archive" size={18} color={COLORS.muted} />}
                label="Archive Habit"
                color={COLORS.muted}
                onPress={handleArchiveHabit}
              />
              <SheetOption
                icon={<MaterialIcons name="delete-outline" size={20} color={COLORS.danger} />}
                label="Delete Habit"
                color={COLORS.danger}
                onPress={deletehabit}
                danger
              />
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingTop: scale(14),
    paddingBottom: scale(10),
  },
  headerTitle: {
    fontSize: scale(22),
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  headerDate: {
    fontSize: scale(11),
    color: 'rgba(255,255,255,0.55)',
    marginTop: scale(2),
  },
  addBtn: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  // Progress
  progressCard: {
    marginHorizontal: scale(16),
    marginBottom: scale(12),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: scale(14),
    padding: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(8),
  },
  progressLabel: { fontSize: scale(12), color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  progressPct: { fontSize: scale(12), color: COLORS.white, fontWeight: '700' },
  progressTrack: {
    height: scale(5),
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: scale(3),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.green,
    borderRadius: scale(3),
  },

  body: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    paddingTop: scale(20),
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(10),
    marginBottom: scale(16),
    paddingHorizontal: scale(16),
  },
  tabPill: {
    flex: 1,
    paddingVertical: scale(10),
    borderRadius: scale(22),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabPillText: {
    fontSize: scale(12),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sectionLabel: {
    fontSize: scale(12),
    color: COLORS.muted,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: scale(12),
    paddingHorizontal: scale(20),
  },
  listContent: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(40),
    gap: scale(10),
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    paddingHorizontal: scale(14),
    paddingVertical: scale(14),
    gap: scale(10),
  },
  habitDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
  habitCardTitle: {
    flex: 1,
    fontSize: scale(14),
    fontWeight: '600',
    color: COLORS.text,
  },
  habitArrow: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weeklyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    paddingHorizontal: scale(16),
    paddingVertical: scale(14),
    marginBottom: scale(10),
  },
  weeklyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  weeklyHabitTitle: {
    fontSize: scale(14),
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  repeatBadge: {
    borderRadius: scale(10),
    paddingHorizontal: scale(8),
    paddingVertical: scale(3),
  },
  weeklyHabitRepeat: {
    fontSize: scale(11),
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCell: { alignItems: 'center', gap: scale(6) },
  dayLetter: {
    fontSize: scale(11),
    fontWeight: '700',
    color: COLORS.muted,
  },
  dayLetterToday: { color: COLORS.orange },
  dayCircleFilled: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleEmpty: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    borderWidth: 1.5,
    borderColor: COLORS.dim,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(8),
    paddingBottom: scale(80),
  },
  emptyEmoji: { fontSize: scale(48) },
  emptyTitle: { fontSize: scale(17), fontWeight: '700', color: COLORS.text },
  emptySub: { fontSize: scale(13), color: COLORS.muted },
  overallCard: {
    margin: scale(16),
    backgroundColor: COLORS.surface,
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: scale(20),
  },
  overallTitle: {
    fontSize: scale(14),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: scale(16),
    letterSpacing: 0.3,
  },
  overallRow: { flexDirection: 'row', gap: scale(10) },
  overallStat: {
    flex: 1,
    alignItems: 'center',
    borderRadius: scale(14),
    borderWidth: 1,
    padding: scale(14),
    backgroundColor: COLORS.bg,
  },
  overallStatVal: { fontSize: scale(26), fontWeight: '800' },
  overallStatLabel: { fontSize: scale(11), color: COLORS.muted, marginTop: scale(4), textAlign: 'center' },
  sheetBg: { backgroundColor: '#18181c', borderTopLeftRadius: scale(24), borderTopRightRadius: scale(24) },
  sheetHandle: { backgroundColor: COLORS.dim, width: scale(40) },
  sheetContent: { paddingHorizontal: scale(20), paddingTop: scale(8), paddingBottom: scale(20) },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    marginBottom: scale(10),
  },
  sheetDot: { width: scale(10), height: scale(10), borderRadius: scale(5) },
  sheetTitle: {
    fontSize: scale(16),
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  sheetDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: scale(10),
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingVertical: scale(11),
    paddingHorizontal: scale(12),
    borderRadius: scale(12),
    marginBottom: scale(4),
    backgroundColor: COLORS.surface,
  },
  sheetOptionText: {
    fontSize: scale(14),
    fontWeight: '500',
  },
});