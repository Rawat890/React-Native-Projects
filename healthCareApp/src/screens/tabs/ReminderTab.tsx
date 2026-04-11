import React, { useEffect, useState } from 'react';
import {
  Image, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { prescriptionService, Prescription } from '../../services/prescriptionService';
import { authService } from '../../firebase/authService';
import { COLORS } from '../../utils/colors';
import { scale } from 'react-native-size-matters';
import { PrescriptionCard } from '../../components/PrescriptionCard';

const ReminderTab: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    const user = authService.currentUser();
    const userEmail = user?.email ?? '';
    if (!userEmail) { setLoading(false); return; }

    const unsub = prescriptionService.subscribeByEmail(userEmail, items => {
      setPrescriptions(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <View style={styles.root}>
      <Animated.View entering={FadeInDown.delay(50).duration(400)} style={styles.headerBanner}>
        <View>
          <Text style={styles.bannerTitle}>My Prescriptions</Text>
          <Text style={styles.bannerSub}>{prescriptions.length} file{prescriptions.length !== 1 ? 's' : ''} uploaded</Text>
        </View>
        <Image source={{ uri: '' }} style={styles.bannerIcon} />
      </Animated.View>

      {loading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Loading…</Text>
        </View>
      ) : prescriptions.length === 0 ? (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No prescriptions yet</Text>
          <Text style={styles.emptyText}>Upload a prescription from the Nearby Pharmacy tab</Text>
        </Animated.View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.statsRow}>
            {[
              { label: 'Total',  value: prescriptions.length.toString() },
              { label: 'Images', value: prescriptions.filter(p => p.format !== 'pdf').length.toString() },
              { label: 'PDFs',   value: prescriptions.filter(p => p.format === 'pdf').length.toString() },
            ].map((s, i) => (
              <View key={i} style={styles.statCard}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </Animated.View>

          <Text style={styles.sectionLabel}>Recent Uploads</Text>

          {prescriptions.map((item, i) => (
            <PrescriptionCard key={item.id} item={item} index={i} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.screenLight,
  },

  list: {
    padding: scale(16),
    paddingBottom: scale(32),
  },

  headerBanner: {
    backgroundColor: COLORS.screenBg,
    paddingHorizontal: scale(20),
    paddingTop: scale(20),
    paddingBottom: scale(22),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  bannerTitle: {
    fontSize: scale(20),
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: scale(2),
  },

  bannerSub: {
    fontSize: scale(13),
    color: COLORS.white
  },

  bannerIcon: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: COLORS.white
  },

  statsRow: {
    flexDirection: 'row',
    gap: scale(10),
    marginBottom: scale(20),
  },

  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    paddingVertical: scale(14),
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOpacity: 0.05,
    shadowRadius: scale(5),
    shadowOffset: { width: 0, height: scale(2) },
    elevation: 2,
  },

  statValue: {
    fontSize: scale(22),
    fontWeight: '800',
    color: COLORS.screenBg,
    marginBottom: scale(2),
  },

  statLabel: {
    fontSize: scale(11),
    color: COLORS.mutedLight,
    fontWeight: '600',
  },

  sectionLabel: {
    fontSize: scale(13),
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: scale(1),
    textTransform: 'uppercase',
    marginBottom: scale(12),
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: scale(14),
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(14),
    marginBottom: scale(10),
    shadowColor: COLORS.black,
    shadowOpacity: 0.05,
    shadowRadius: scale(6),
    shadowOffset: { width: 0, height: scale(2) },
    elevation: 2,
  },

  cardLeft: {
    marginRight: scale(12),
  },

  fileIcon: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },

  pdfIcon: {
    backgroundColor: COLORS.dangerSoft,
  },

  imgIcon: {
    backgroundColor: COLORS.blueTint,
  },

  fileIconText: {
    fontSize: scale(10),
    fontWeight: '800',
    color: COLORS.heading,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(40),
  },

  emptyIcon: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: COLORS.blueTint,
    marginBottom: scale(18),
  },

  emptyTitle: {
    fontSize: scale(18),
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: scale(8),
  },

  emptyText: {
    fontSize: scale(13),
    color: COLORS.mutedLight,
    textAlign: 'center',
    lineHeight: scale(20),
  },
});

export default ReminderTab;