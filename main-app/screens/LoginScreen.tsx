import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  Image 
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Logo */}
      <Image source={require('../assets/images/logo.jpeg')} style={styles.logo} />

      {/* App Title */}
      <Text style={styles.appTitle}>GrowSure</Text>

      {/* Login Card */}
      <View style={styles.card}>
        <Text style={styles.login}>Login</Text>

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

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.loginButtonText}>LOG IN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>Create an Account</Text>
        </TouchableOpacity>
      </View>

      {/* Continue without login */}
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.guestText}>Continue towards the Main page</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#43A047', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  appTitle: { 
    fontSize: 32,  
    color: '#fff', 
    marginBottom: 20, 
    textAlign: 'center', 
    fontWeight: 'bold'
  },
  card: { 
    width: '94%',   // ⬅️ Increased width
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 25, 
    elevation: 5 
  },
  login: { 
    fontSize: 20, 
    color: '#2E7D32', 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 15 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#A5D6A7', 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 15 
  },
  loginButton: { 
    backgroundColor: '#2E7D32', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 10 
  },
  loginButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  signupText: { 
    color: '#2E7D32', 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 5 
  },
  guestText: { 
    color: '#fff', 
    fontSize: 14, 
    marginTop: 20, 
    textDecorationLine: 'underline' 
  },
});
