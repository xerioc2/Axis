import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Safely get configuration values with fallbacks
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 
                   process.env.EXPO_PUBLIC_SUPABASE_URL || 
                   "";

const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 
                       process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                       "";

// Only log in development, not in production
if (__DEV__) {
  console.log(`Supabase URL: ${supabaseUrl.slice(0, 20)}...`);
  console.log(`Supabase key: ${supabaseAnonKey.slice(0, 5)}...`);
}

// Validate required configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please check your environment variables or app.config.js');
}

// Create and configure the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: Platform.OS === 'web' ? localStorage : AsyncStorage,
  }
});

export default supabase;
