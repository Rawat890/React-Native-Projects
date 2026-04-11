import React, { useState } from 'react';
import {
  ActivityIndicator, Image, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { pick, types } from '@react-native-documents/picker';
import { uploadFile, uploadByUrl } from '../../services/cloudinaryService';
import { prescriptionService } from '../../services/prescriptionService';
import { COLORS } from '../../utils/colors';
import { scale } from 'react-native-size-matters';
import { fileIcon, uploadIcon, locationIcon, starIcon, arrowRightIcon } from '../../utils/images';
import { goBack } from '../../utils/navigationService';
import { fonts } from '../../utils/fonts';
import { authService } from '../../firebase/authService';

const PHARMACIES = [
  { id: '1', name: 'Path lab pharmacy', distance: '5km Away', rating: 4.5, reviews: 120, image: { uri: '' } },
  { id: '2', name: '24 pharmacy', distance: '5km Away', rating: 4.5, reviews: 120, image: { uri: '' } },
];

const NearbyPharmacyTab: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'link' | null>(null); const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePickFile = async () => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      const [file] = await pick({
        allowMultiSelection: false,
        type: [types.images, types.pdf]
      });
      if (!file?.uri) return;
      setUploading(true);
      const result = await uploadFile(file.uri, file.name ?? 'prescription', file.type ?? 'image/jpeg');
      console.log("File data - ", result)
      const userEmail = authService.currentUser()?.email ?? '';
      await prescriptionService.save({
        url: result.url,
        format: result.format,
        fileName: file.name ?? 'prescription',
        type: 'file',
        email: userEmail
      });
      setUploading(false);
      setSuccessMsg('Prescription uploaded successfully!');
    } catch (e: any) {
      setUploading(false);
      if (e?.code !== 'DOCUMENT_PICKER_CANCELED') setErrorMsg(e?.message ?? 'Upload failed');
      console.log("error while uploading - ", e)
    }
  };

  const handleUploadLink = async () => {
    if (!linkInput.trim()) { setErrorMsg('Please enter a valid URL'); return; }
    try {
      setErrorMsg('');
      setSuccessMsg('');
      setUploading(true);
      const result = await uploadByUrl(linkInput.trim());
      const userEmail = authService.currentUser()?.email ?? '';
      await prescriptionService.save({
        url: result.url,
        format: result.format,
        fileName: result.originalFilename,
        type: 'link',
        email: userEmail
      });
      setUploading(false);
      setSuccessMsg('Prescription uploaded successfully!');
      setLinkInput('');
    } catch (e: any) {
      console.log("link- ", e)
      setUploading(false);
      setErrorMsg(e?.message ?? 'Upload failed');
    }
  };

  const handleContinue = () => {
    if (!uploadMode) {
      setErrorMsg('Please select an upload option first');
      return;
    }
    if (uploadMode === 'link') {
      handleUploadLink();
    } else {
      handlePickFile();
    }
  };

  return (
    <View style={styles.root}>

      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => { goBack(); }}>
          <Image source={arrowRightIcon} style={styles.back} />
        </Pressable>
        <View style={styles.locationRow}>
          <Image source={locationIcon} style={styles.locationIcon} resizeMode="contain" />
          <Text style={styles.locationText}>Mohali</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        <Animated.Text entering={FadeInDown.duration(400)} style={styles.sectionTitle}>
          Pharmacy Nearby
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.pharmacyGrid}>
          {PHARMACIES.map((p, i) => (
            <View key={p.id} style={styles.pharmacyCard}>
              <Image
                source={p.image}
                style={styles.pharmacyImg}
                resizeMode="cover"
              />
              <View style={styles.pharmacyInfo}>
                <Text style={styles.pharmacyName} numberOfLines={1}>{p.name}</Text>
                <Text style={styles.pharmacyDist}>{p.distance}</Text>
                <View style={styles.ratingRow}>
                  <Image source={starIcon} style={styles.starIcon} resizeMode="contain" />
                  <Text style={styles.ratingText}>
                    {p.rating} ({p.reviews} review)
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.uploadSection}>

          <Text style={styles.uploadTitle}>Upload Prescription</Text>
          <Text style={styles.uploadSub}>
            We will show the pharmacy that fits as per{'\n'}your prescription.
          </Text>

          <View style={styles.optionsBox}>
            <Pressable
              style={styles.optionItem}
              onPress={() => setUploadMode('link')}
            >
              <Image source={fileIcon} style={styles.optionIcon} resizeMode="contain" />
              <Text style={[styles.optionLabel, uploadMode === 'link' && styles.optionLabelActive]}>
                Upload Link
              </Text>
            </Pressable>

            <Pressable
              style={styles.optionItem}
              onPress={() => setUploadMode('file')}
            >
              <Image source={uploadIcon} style={styles.optionIcon} resizeMode="contain" />
              <Text style={[styles.optionLabel, uploadMode === 'file' && styles.optionLabelActive]}>
                Upload File
              </Text>
            </Pressable>
          </View>

          {uploadMode === 'link' && (
            <View style={styles.linkInputContainer}>
              <TextInput
                style={styles.linkInput}
                placeholder="Paste document URL here..."
                placeholderTextColor={COLORS.grey}
                value={linkInput}
                onChangeText={setLinkInput}
                autoCapitalize="none"
                keyboardType="url"
                autoFocus
              />
            </View>
          )}

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          {successMsg ? <Text style={styles.successText}>{successMsg}</Text> : null}

        </Animated.View>

      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable
          style={[styles.continueBtn, uploading && { opacity: 0.7 }]}
          onPress={handleContinue}
          disabled={uploading}
        >
          {uploading
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={styles.continueBtnText}>Continue</Text>
          }
        </Pressable>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.light2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light2,
    paddingHorizontal: scale(16),
    paddingTop: scale(16),
    paddingBottom: scale(12),
    gap: scale(12),
  },
  backBtn: {
    padding: scale(4),
  },
  backArrow: {
    fontSize: scale(30),
    color: COLORS.heading,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  locationIcon: {
    width: scale(22),
    height: scale(22),
  },
  locationText: {
    fontSize: scale(16),
    fontWeight: '600',
    color: COLORS.heading,
  },
  scroll: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(120),
  },
  sectionTitle: {
    fontSize: scale(20),
    fontWeight: '800',
    color: COLORS.heading,
    marginBottom: scale(16),
    marginTop: scale(4),
  },
  pharmacyGrid: {
    flexDirection: 'row',
    gap: scale(12),
    marginBottom: scale(28),
  },
  pharmacyCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: scale(14),
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOpacity: 0.07,
    shadowRadius: scale(8),
    shadowOffset: { width: 0, height: scale(2) },
    elevation: 3,
  },
  pharmacyImg: {
    width: '100%',
    height: scale(120),
    backgroundColor: COLORS.light,
  },
  pharmacyInfo: {
    padding: scale(10),
  },
  pharmacyName: {
    fontSize: scale(13),
    fontFamily: fonts.balooBold,
    color: COLORS.heading,
    marginBottom: scale(2),
  },
  pharmacyDist: {
    fontSize: scale(11),
    color: COLORS.textSecondary,
    marginBottom: scale(4),
    fontFamily: fonts.balooBold,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    fontFamily: fonts.balooBold,
  },
  starIcon: {
    width: scale(12),
    height: scale(12),
    tintColor: COLORS.yellow,
  },
  back: {
    width: scale(22),
    height: scale(22),
  },
  ratingText: {
    fontSize: scale(11),
    color: COLORS.textSecondary,
    fontFamily: fonts.balooBold
  },
  uploadSection: {
    alignItems: 'center',
    marginBottom: scale(20),
  },
  uploadTitle: {
    fontSize: scale(24),
    color: COLORS.heading,
    marginBottom: scale(10),
    textAlign: 'center',
    fontFamily: fonts.balooBold
  },
  uploadSub: {
    fontSize: scale(13),
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: scale(20),
    marginBottom: scale(24),
  },
  optionsBox: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: scale(16),
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  optionItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(28),
    gap: scale(12),
  },
  optionIcon: {
    width: scale(40),
    height: scale(40),
  },
  optionLabel: {
    fontSize: scale(14),
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  optionLabelActive: {
    color: COLORS.primary,
  },
  linkInput: {
    width: '100%',
    marginTop: scale(16),
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: scale(10),
    paddingHorizontal: scale(14),
    height: scale(48),
    fontSize: scale(14),
    color: COLORS.heading,
    backgroundColor: COLORS.white,
  },
  linkInputContainer: {
    width: '100%',
    marginTop: scale(16)
  },
  errorText: {
    color: COLORS.danger,
    fontSize: scale(12),
    marginTop: scale(10),
    textAlign: 'center',
  },
  successText: {
    color: COLORS.green,
    fontSize: scale(12),
    marginTop: scale(10),
    textAlign: 'center',
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.light2,
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    paddingBottom: scale(24),
  },
  continueBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: scale(16),
    height: scale(54),
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: scale(16),
  },
});

export default NearbyPharmacyTab;