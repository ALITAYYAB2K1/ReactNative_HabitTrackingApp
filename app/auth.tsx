import { useAuth } from "@/lib/auth-context";
import { Stack, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  HelperText,
  SegmentedButtons,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
export default function AuthScreen() {
  const theme = useTheme();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const title = useMemo(
    () => (isSignUp ? "Create Account" : "Welcome Back"),
    [isSignUp]
  );

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError(null);
    setIsLoading(true);
    if (isSignUp) {
      const err = await signUp(email, password);
      if (err) setError(err);
    } else {
      const err = await signIn(email, password);
      if (err) setError(err);
      else router.replace("/");
    }
    setIsLoading(false);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen
        options={{
          title,
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerTransparent: true,
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerArea}>
          <Text variant="displaySmall" style={styles.brand}>
            <Text style={[styles.brandAccent, { color: theme.colors.primary }]}>
              Track
            </Text>
            Habit
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Build streaks, one day at a time.
          </Text>
        </View>

        <Surface style={styles.card} elevation={3}>
          <SegmentedButtons
            value={isSignUp ? "signup" : "signin"}
            onValueChange={(v) => setIsSignUp(v === "signup")}
            buttons={[
              { value: "signin", label: "Sign In", icon: "login-variant" },
              {
                value: "signup",
                label: "Sign Up",
                icon: "account-plus-outline",
              },
            ]}
            style={styles.segmented}
          />

          <TextInput
            style={styles.input}
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            left={<TextInput.Icon icon="email-outline" />}
            error={!!error && (!email || !validateEmail(email))}
          />
          <HelperText
            type={(!email || !validateEmail(email)) && error ? "error" : "info"}
            visible={!!email && !error}
          >
            Use a valid email address
          </HelperText>

          <TextInput
            style={styles.input}
            label="Password"
            placeholder="••••••••"
            keyboardType="default"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off-outline" : "eye-outline"}
                onPress={() => setShowPassword((p) => !p)}
                forceTextInputFocus={false}
              />
            }
            error={!!error && password.length < 6}
          />
          {error ? (
            <HelperText type="error" visible>
              {error}
            </HelperText>
          ) : null}

          <Button
            mode="contained"
            style={styles.cta}
            onPress={handleAuth}
            loading={isLoading}
            disabled={isLoading}
            icon={isSignUp ? "account-plus" : "login"}
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </Button>

          <Button
            mode="text"
            onPress={() => setIsSignUp((s) => !s)}
            style={styles.switchModeButton}
            icon={isSignUp ? "login-variant" : "account-plus-outline"}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "New here? Sign Up"}
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
    justifyContent: "center",
  },
  headerArea: {
    alignItems: "center",
    marginBottom: 8,
  },
  brand: {
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  brandAccent: {
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  segmented: {
    marginBottom: 12,
  },
  input: {
    marginBottom: 6,
  },
  cta: { marginTop: 8 },
  switchModeButton: {
    marginTop: 16,
  },
});
