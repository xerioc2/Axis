import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';



const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl ?? "";
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? "";

console.log(`supabaseURL = ${supabaseUrl}`);
console.log(`supabaseANONKEY = ${supabaseAnonKey}`);

const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
export default supabase;

