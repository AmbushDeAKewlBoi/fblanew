import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://runtqztwcgrekdphwzbs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1bnRxenR3Y2dyZWtkcGh3emJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MzAwNDksImV4cCI6MjA5MjIwNjA0OX0.3xzL-Y9wdcSvTl4LeWHyQmoVdN5ibUTrOsjDAhBdWp4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket name for uploaded resources
export const STORAGE_BUCKET = 'resources';
