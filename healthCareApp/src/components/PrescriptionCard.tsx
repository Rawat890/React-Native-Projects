import { Image, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { COLORS } from "../utils/colors";
import { scale } from "react-native-size-matters";

const formatDate = (ms: number) => {
  const d = new Date(ms);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const FileTypeIcon: React.FC<{ format: string }> = ({ format }) => {
  const isPdf = format?.toLowerCase() === 'pdf';
  return (
    <View style={[styles.fileIcon, isPdf ? styles.pdfIcon : styles.imgIcon]}>
      <Text style={styles.fileIconText}>{isPdf ? 'PDF' : 'IMG'}</Text>
    </View>
  );
};

export const PrescriptionCard: React.FC<{ item: Prescription; index: number }> = ({ item, index }) => (
  <Animated.View entering={FadeInRight.delay(index * 80).duration(400)} style={styles.card}>
    <View style={styles.cardLeft}>
      <FileTypeIcon format={item.format} />
    </View>
    <View style={styles.cardBody}>
      <Text style={styles.cardName} numberOfLines={1}>{item.fileName}</Text>
      <Text style={styles.cardMeta}>{formatDate(item.uploadedAt)}</Text>
      <View style={styles.tagRow}>
        <View style={[styles.tag, item.type === 'link' ? styles.tagLink : styles.tagFile]}>
          <Text style={styles.tagText}>{item.type === 'link' ? '🔗 Link' : '📎 File'}</Text>
        </View>
        <View style={[styles.tag, styles.tagFormat]}>
          <Text style={styles.tagText}>{item.format.toUpperCase()}</Text>
        </View>
      </View>
    </View>
    <Animated.View>
      <Image
        source={{ uri: '' }}
        style={styles.previewThumb}
      />
    </Animated.View>
  </Animated.View>
);

const styles = StyleSheet.create({
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

  cardBody: {
    flex: 1,
  },

  cardName: {
    fontSize: scale(14),
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: scale(3),
  },

  cardMeta: {
    fontSize: scale(11),
    color: COLORS.mutedLight,
    marginBottom: scale(6),
  },

  tagRow: {
    flexDirection: 'row',
    gap: scale(6),
  },

  tag: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(3),
    borderRadius: scale(20),
  },

  tagLink: {
    backgroundColor: COLORS.accentSoft,
  },

  tagFile: {
    backgroundColor: COLORS.greenSoft,
  },

  tagFormat: {
    backgroundColor: COLORS.borderLight,
  },

  tagText: {
    fontSize: scale(10),
    fontWeight: '600',
    color: COLORS.dim,
  },

  previewThumb: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(8),
    backgroundColor: COLORS.borderLight,
    marginLeft: scale(10),
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