/*
  # Student Application Management System

  ## Overview
  Creates a comprehensive system for managing student application forms with complete data tracking and security.

  ## 1. New Tables
  
  ### `student_applications`
  Stores all student application form submissions with complete applicant information.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for each application
  - `first_name` (text) - Student's first name
  - `last_name` (text) - Student's last name
  - `email` (text) - Contact email address
  - `phone` (text) - Contact phone number
  - `date_of_birth` (date) - Student's date of birth
  - `address` (text) - Residential address
  - `city` (text) - City of residence
  - `state` (text) - State/province
  - `zip_code` (text) - Postal/ZIP code
  - `country` (text) - Country of residence
  - `program_of_interest` (text) - Desired program/course
  - `previous_education` (text) - Educational background
  - `gpa` (numeric) - Grade point average
  - `test_scores` (text) - Standardized test scores (SAT/ACT/etc)
  - `extracurricular_activities` (text) - Activities and achievements
  - `personal_statement` (text) - Application essay/personal statement
  - `application_status` (text) - Current status (pending/reviewing/accepted/rejected)
  - `submitted_at` (timestamptz) - Timestamp of form submission
  - `updated_at` (timestamptz) - Last update timestamp
  - `created_at` (timestamptz) - Record creation timestamp

  ## 2. Security
  
  ### Row Level Security (RLS)
  - RLS enabled on `student_applications` table
  - Public can insert new applications (for form submission)
  - Public can view all applications (for dashboard access)
  - Future: Can be restricted to authenticated admin users only

  ## 3. Notes
  - Application status defaults to 'pending' for new submissions
  - All timestamps automatically managed
  - Email field should be validated on the frontend
  - GPA stored as numeric for potential filtering/sorting
*/

-- Create student_applications table
CREATE TABLE IF NOT EXISTS student_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  date_of_birth date NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  country text NOT NULL DEFAULT 'United States',
  program_of_interest text NOT NULL,
  previous_education text NOT NULL,
  gpa numeric(3,2),
  test_scores text,
  extracurricular_activities text,
  personal_statement text NOT NULL,
  application_status text NOT NULL DEFAULT 'pending',
  submitted_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE student_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to submit applications (insert)
CREATE POLICY "Anyone can submit applications"
  ON student_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow anyone to view applications
CREATE POLICY "Anyone can view applications"
  ON student_applications
  FOR SELECT
  TO anon
  USING (true);

-- Create index for faster queries on status and submission date
CREATE INDEX IF NOT EXISTS idx_student_applications_status 
  ON student_applications(application_status);

CREATE INDEX IF NOT EXISTS idx_student_applications_submitted_at 
  ON student_applications(submitted_at DESC);