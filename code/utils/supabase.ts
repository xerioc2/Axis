
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types'

const supabaseUrl = 'https://lzyeyaibbjiibtjhijfc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6eWV5YWliYmppaWJ0amhpamZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMTc1NDksImV4cCI6MjA1NDc5MzU0OX0.9GgRgPMTQOkriukfCrCXr5oLK87WrSn3sgWiQMX-ABI';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: async (key) => {
          return await AsyncStorage.getItem(key);
        },
        setItem: async (key, value) => {
          await AsyncStorage.setItem(key, value);
        },
        removeItem: async (key) => {
          await AsyncStorage.removeItem(key);
        },
      },
      persistSession: true,
    },
  });
  
  export default supabase;


  /* 
  SUPABASE Documentation Notes

  User Sign Uep Docs: https://supabase.com/docs/reference/javascript/auth-signup

  const { data, error } = await supabase.auth.signUp({
   email: 'example@email.com',
   password: 'example-password',
   options: {
    emailRedirectTo: 'LANDING PAGE'
    data: {
        first_name:  'John',
        age: 27
    }
   }
   }
   ) 
   
  ^^-- data here can be either user and session (if conf email disabled), or just user and a null session (if conf email is enabled).
  If conf email is enabled, when the user confirms their email, they are redirected to SITE_URL and the response is 
  

  Auth events that can be listened for:
  - INITIAL_SESSION: emitted right after the supabase client is constructed and the initial session from storage is loaded.
  - SIGNED_IN: emitted each time a user session is confirmed ie on sign in
  - SIGNED_OUT: emitted when a user signs out ie after call to supabase.auth.signOut(), or after a session has expired due to inactivity
        ^^--should be used to clean up any local storage your app has associated with that user.
  - TOKEN_REFRESHED: emitted when a new access and refresh token are issued for a user. 
        ^^--Best practice is to extract access token and store it in memory for Authorization header of later requests
  

  User Session Docs: https://supabase.com/docs/guides/auth/sessions


  
  
  */
