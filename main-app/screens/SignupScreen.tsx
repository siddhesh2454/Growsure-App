import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>GrowSure</Text>
        <Text style={styles.signupTitle}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#43A047',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#43A047',
    marginBottom: 10,
    textAlign: 'center',
  },
  signupTitle: {
    fontSize: 20,
    color: '#2E7D32',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginText: {
    color: '#2E7D32',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
});
