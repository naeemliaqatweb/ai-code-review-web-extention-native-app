import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Container } from '@/src/components/ui/Container';
import { Typography } from '@/src/components/ui/Typography';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/context/AuthContext';
import { Link, router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Login failed. Please try again.');
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
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <Typography variant="h1" className="text-primary mb-2">Welcome Back</Typography>
            <Typography variant="body" className="mb-8 text-gray-500">
              Enter your credentials to access your AI engineering hub.
            </Typography>

            <View className="gap-4">
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

              {error ? (
                <Typography variant="caption" className="text-error text-center">{error}</Typography>
              ) : null}

              <Button
                label={loading ? "Signing in..." : "Sign In"}
                onPress={handleLogin}
                className="mt-4"
              />
            </View>

            <View className="flex-row justify-center mt-8 gap-2">
              <Typography variant="body" className="text-gray-500">Don't have an account?</Typography>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Typography variant="body" className="text-primary font-bold">Sign Up</Typography>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
