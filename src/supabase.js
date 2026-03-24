import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xrxyobjuuqghwagbjoit.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyeHlvYmp1dXFnaHdhZ2Jqb2l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDcyOTksImV4cCI6MjA4ODU4MzI5OX0.h1PP_Jr1cgHq3rjxzB_21hqV1Q0iwY6bZGN3rw_eFrk";

export const supabase = createClient(supabaseUrl, supabaseKey);
