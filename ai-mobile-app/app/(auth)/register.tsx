import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Container } from '@/src/components/ui/Container';
import { Typography } from '@/src/components/ui/Typography';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/context/AuthContext';
import { Link, router } from 'expo-router';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !passwordConfirmation) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await signUp({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="justify-center">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
          <View className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 my-8">
            <Typography variant="h1" className="text-primary mb-2">Create Account</Typography>
            <Typography variant="body" className="mb-8 text-gray-500">
              Join the elite engineering hub and start your AI-powered journey.
            </Typography>

            <View className="gap-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
              />

              <Input
                label="Email Address"
                placeholder="email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <Input
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <Input
                label="Confirm Password"
                placeholder="••••••••"
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                secureTextEntry
              />

              {error ? (
                <Typography variant="caption" className="text-error text-center">{error}</Typography>
              ) : null}

              <Button
                label={loading ? "Creating Account..." : "Sign Up"}
                onPress={handleRegister}
                className="mt-4"
              />
            </View>

            <View className="flex-row justify-center mt-8 gap-2">
              <Typography variant="body" className="text-gray-500">Already have an account?</Typography>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Typography variant="body" className="text-primary font-bold">Sign In</Typography>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
