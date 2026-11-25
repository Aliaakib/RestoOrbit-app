import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { BrandLogo } from '@/components/common/BrandLogo';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AUTH_ROUTES } from '@/navigation/routes';
import { getReadableErrorMessage } from '@/services/api/apiError';
import { authService } from '@/services/api/authService';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { validateEmail, validatePassword } from '@/utils/validators';

/**
 * Organization & owner sign-up screen mirroring resto-orbit-frontend Register view.
 */
export function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    const nextErrors = {};
    if (!firstName.trim()) nextErrors.firstName = 'First name is required.';
    if (!lastName.trim()) nextErrors.lastName = 'Last name is required.';
    if (!organizationName.trim()) nextErrors.organizationName = 'Organization name is required.';

    const emailErr = validateEmail(email);
    if (emailErr) nextErrors.email = emailErr;

    const passwordErr = validatePassword(password);
    if (passwordErr) nextErrors.password = passwordErr;

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await authService.register({
        firstName,
        lastName,
        organizationName,
        email,
        password,
      });

      Alert.alert('Account Created', response.message, [
        {
          text: 'Back to Login',
          onPress: () => navigation.navigate(AUTH_ROUTES.SIGN_IN),
        },
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', getReadableErrorMessage(error));
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
        <View style={styles.titleRow}>
          <Text style={styles.title}>Sign up</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate(AUTH_ROUTES.SIGN_IN)}
          >
            <Text style={styles.linkText}>Already have an account?</Text>
          </Pressable>
        </View>

        <View style={styles.rowInputs}>
          <AppInput
            label="First Name*"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Sarah"
            autoCapitalize="words"
            error={errors.firstName}
            style={styles.halfInput}
          />
          <AppInput
            label="Last Name*"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Jenkins"
            autoCapitalize="words"
            error={errors.lastName}
            style={styles.halfInput}
          />
        </View>

        <AppInput
          label="Organization Name*"
          value={organizationName}
          onChangeText={setOrganizationName}
          placeholder="RestoOrbit Hospitality Group"
          autoCapitalize="words"
          error={errors.organizationName}
        />

        <AppInput
          label="Email Address*"
          value={email}
          onChangeText={setEmail}
          placeholder="owner@restaurant.com"
          keyboardType="email-address"
          error={errors.email}
        />

        <AppInput
          label="Password*"
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleRegister}
          error={errors.password}
        />

        <AppButton label="Create Account" onPress={handleRegister} loading={isSubmitting} />
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
  rowInputs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfInput: {
    flex: 1,
  },
});
