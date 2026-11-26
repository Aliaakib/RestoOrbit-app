import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BrandLogo } from '@/components/common/BrandLogo';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { env } from '@/config/env';
import { useAuth } from '@/hooks/useAuth';
import { AUTH_ROUTES } from '@/navigation/routes';
import { getReadableErrorMessage } from '@/services/api/apiError';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { validateSignInForm } from '@/utils/validators';

/**
 * Staff/Admin sign-in screen styled with Theme8 & official RestoOrbit brand marks.
 */
export function SignInScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('sarah.jenkins@restoorbit.com');
  const [password, setPassword] = useState('orbit1234');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn() {
    setFormError('');
    const errors = validateSignInForm({ email, password });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await signIn({ email, password });
    } catch (error) {
      setFormError(getReadableErrorMessage(error, 'Unable to sign in. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View style={styles.logoWrap}>
        <BrandLogo variant="horizontal" width={220} height={54} />
      </View>

      <AppCard style={styles.card}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Login</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate(AUTH_ROUTES.REGISTER)}
          >
            <Text style={styles.linkText}>Don&apos;t have an account?</Text>
          </Pressable>
        </View>


        {formError ? (
          <View accessibilityRole="alert" style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{formError}</Text>
          </View>
        ) : null}

        <AppInput
          label="Email Address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: null }));
          }}
          placeholder="Enter email address"
          keyboardType="email-address"
          autoComplete="email"
          error={fieldErrors.email}
        />

        <AppInput
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: null }));
          }}
          placeholder="Enter password"
          secureTextEntry
          autoComplete="password"
          returnKeyType="done"
          onSubmitEditing={handleSignIn}
          error={fieldErrors.password}
        />

        <View style={styles.forgotRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate(AUTH_ROUTES.FORGOT_PASSWORD)}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>
        </View>

        <AppButton label="Login" onPress={handleSignIn} loading={isSubmitting} />
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
    marginBottom: spacing.lg,
  },
  brandSubtitle: {
    marginTop: spacing.xs,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  card: {
    padding: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.md,
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
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.infoSoft,
    padding: spacing.sm,
    borderRadius: radii.sm,
    marginBottom: spacing.md,
  },
  demoNoticeText: {
    flex: 1,
    fontSize: typography.sizes.xs,
    color: colors.info,
    lineHeight: 18,
  },
  errorBanner: {
    backgroundColor: colors.dangerSoft,
    padding: spacing.sm,
    borderRadius: radii.sm,
    marginBottom: spacing.md,
  },
  errorBannerText: {
    fontSize: typography.sizes.sm,
    color: colors.dangerAccent,
    fontWeight: typography.weights.medium,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  forgotText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
});
