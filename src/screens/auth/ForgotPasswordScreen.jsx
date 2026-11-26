import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BrandLogo } from '@/components/common/BrandLogo';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AUTH_ROUTES } from '@/navigation/routes';
import { getReadableErrorMessage } from '@/services/api/apiError';
import { authService } from '@/services/api/authService';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { validateEmail } from '@/utils/validators';

/**
 * Forgot Password screen mirroring resto-orbit-frontend ForgotPassword view.
 */
export function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit() {
    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }

    setEmailError('');
    setIsSubmitting(true);

    try {
      await authService.requestPasswordReset({ email });
      setEmailSent(true);
    } catch (error) {
      setEmailError(getReadableErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View style={styles.logoWrap}>
        <BrandLogo variant="horizontal" width={200} height={48} />
      </View>

      <AppCard style={styles.card}>
        {emailSent ? (
          <View style={styles.successBox}>
            <View style={styles.successIcon}>
              <Ionicons name="mail-open-outline" size={32} color={colors.primary} />
            </View>
            <Text style={styles.successTitle}>Check Your Mail</Text>
            <Text style={styles.successSubtitle}>
              We sent password recovery instructions to {email.trim().toLowerCase()}.
            </Text>
            <AppButton
              label="Back to Login"
              onPress={() => navigation.navigate(AUTH_ROUTES.SIGN_IN)}
              style={styles.fullBtn}
            />
          </View>
        ) : (
          <>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Forgot Password</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate(AUTH_ROUTES.SIGN_IN)}
              >
                <Text style={styles.linkText}>Back to Login</Text>
              </Pressable>
            </View>

            <Text style={styles.helperText}>
              Enter the email associated with your RestoOrbit account and we will send reset
              link.
            </Text>

            <AppInput
              label="Email Address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              placeholder="Enter email address"
              keyboardType="email-address"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              error={emailError}
            />

            <AppButton label="Send Reset Link" onPress={handleSubmit} loading={isSubmitting} />
          </>
        )}
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  card: {
    padding: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  linkText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  },
  helperText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: radii.full,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  successTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  successSubtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  fullBtn: {
    width: '100%',
  },
});
