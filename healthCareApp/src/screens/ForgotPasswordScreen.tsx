import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Text,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { authService } from '../firebase/authService';
import InputWithLabel from '../components/InputWithLabel';
import ButtonWithLabel from '../components/ButtonWithLabel';
import { forgotPasswordSchema } from '../utils/schemas/forgotPasswordSchema';
import { scale } from 'react-native-size-matters';
import { COLORS } from '../utils/colors';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setError('');
      setLoading(true);
      await authService.forgotPassword(data.email);
      setLoading(false);
      setSent(true);
    } catch (e: any) {
      setLoading(false);
      setError(e?.message ?? 'Failed to send reset email');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <Text style={styles.subLabel}>RESET PASSWORD</Text>
          <Text style={styles.title}>Healthcare</Text>
          <Text style={styles.desc}>Enter your email and we'll send{'\n'}a reset link to your inbox.</Text>
        </Animated.View>

        {sent ? (
          <Animated.View entering={FadeInUp.duration(400)} style={styles.successCard}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Email Sent!</Text>
            <Text style={styles.successDesc}>Check your inbox for a password reset link.</Text>
            <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backBtnText}>Back to Login</Text>
            </Pressable>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.card}>
            <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
              <InputWithLabel label="Email Address" placeholder="Enter your email" value={value} onChangeText={onChange} secureTextEntry={false} error={errors.email?.message} keyboardType="email-address" />
            )} />

            {error ? <Text style={styles.fbError}>{error}</Text> : null}

            <ButtonWithLabel title="SEND RESET LINK" onPress={handleSubmit(onSubmit)} loading={loading} backgroundColor={COLORS.splash}/>

            <Pressable onPress={() => navigation.goBack()} style={styles.cancelRow}>
              <Text style={styles.cancelText}>← Back to Login</Text>
            </Pressable>
          </Animated.View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: scale(24),
    paddingTop: scale(70),
    paddingBottom: scale(40),
  },

  header: {
    alignItems: 'center',
    marginBottom: scale(32),
  },

  subLabel: {
    fontSize: scale(16),
    fontWeight: '600',
    color: COLORS.black,
    letterSpacing: scale(2.5),
    marginBottom: scale(6),
  },

  title: {
    fontSize: scale(36),
    fontWeight: '800',
    color: COLORS.black,
    letterSpacing: scale(0.3),
    marginBottom: scale(10),
  },

  desc: {
    fontSize: scale(13),
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: scale(20),
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: scale(16),
    padding: scale(20),
    borderWidth: 1,
    borderColor: COLORS.white,
  },

  fbError: {
    color: COLORS.danger,
    fontSize: scale(12),
    marginBottom: scale(12),
    textAlign: 'center',
  },

  cancelRow: {
    alignItems: 'center',
    marginTop: scale(16),
  },

  cancelText: {
    color: COLORS.black,
    fontSize: scale(13),
  },

  successCard: {
    backgroundColor: COLORS.white,
    borderRadius: scale(16),
    padding: scale(28),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
  },

  successIcon: {
    fontSize: scale(40),
    marginBottom: scale(14),
  },

  successTitle: {
    fontSize: scale(22),
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: scale(8),
  },

  successDesc: {
    fontSize: scale(14),
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: scale(22),
    marginBottom: scale(24),
  },

  backBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: scale(12),
    paddingHorizontal: scale(32),
    borderRadius: scale(10),
  },

  backBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: scale(14),
  },
});

export default ForgotPasswordScreen;