const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface StudentApplication {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  program_of_interest: string;
  previous_education: string;
  gpa?: number;
  test_scores?: string;
  extracurricular_activities?: string;
  personal_statement: string;
  application_status?: string;
  submitted_at?: string;
  created_at?: string;
}

export const submitApplication = async (
  data: Omit<StudentApplication, 'id' | 'created_at' | 'submitted_at' | 'application_status'>
) => {
  const response = await fetch(`${API_URL}/api/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit application');
  }

  return response.json();
};

export const getApplications = async (): Promise<StudentApplication[]> => {
  const response = await fetch(`${API_URL}/api/applications`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch applications');
  }

  return response.json();
};

export const getApplication = async (id: number): Promise<StudentApplication> => {
  const response = await fetch(`${API_URL}/api/applications/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch application');
  }

  return response.json();
};
