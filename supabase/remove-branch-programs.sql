-- Run this once in Supabase SQL Editor for an existing copied database.
-- The app no longer uses branch filtering or branch fields.

alter table if exists public.admin_users
  drop column if exists branch;

alter table if exists public.students
  drop column if exists branch;

alter table if exists public."approved-exams"
  drop column if exists branch;

alter table if exists public.placement_test_results
  drop column if exists branch;

-- IELTS/TOEFL and Kids were UI-only choices stored in the existing level field.
-- No schema change is required for those options after removing them from the app.
