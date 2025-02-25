
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lzyeyaibbjiibtjhijfc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6eWV5YWliYmppaWJ0amhpamZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMTc1NDksImV4cCI6MjA1NDc5MzU0OX0.9GgRgPMTQOkriukfCrCXr5oLK87WrSn3sgWiQMX-ABI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
