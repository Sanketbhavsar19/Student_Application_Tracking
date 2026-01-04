import { useState, useEffect } from 'react';
import { getApplications, StudentApplication } from '../lib/api';
import { User, Calendar, Mail, Phone, BookOpen, Clock } from 'lucide-react';

export default function ApplicationsList() {
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<StudentApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-20">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Applications Yet</h3>
        <p className="text-gray-500">Applications will appear here once submitted.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {applications.map((app) => (
          <div
            key={app.id}
            onClick={() => setSelectedApp(app)}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {app.first_name} {app.last_name}
                  </h3>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                      app.application_status || 'pending'
                    )}`}
                  >
                    {app.application_status?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="truncate">{app.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{app.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span className="truncate">{app.program_of_interest}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatDate(app.created_at || '')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedApp && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Application Details</h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <p className="font-medium text-gray-800">
                      {selectedApp.first_name} {selectedApp.last_name}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium text-gray-800">{selectedApp.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <p className="font-medium text-gray-800">{selectedApp.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date of Birth:</span>
                    <p className="font-medium text-gray-800">{selectedApp.date_of_birth}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Address</h3>
                <p className="text-gray-700 text-sm">
                  {selectedApp.address}
                  <br />
                  {selectedApp.city}, {selectedApp.state} {selectedApp.zip_code}
                  <br />
                  {selectedApp.country}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Academic Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Program of Interest:</span>
                    <p className="font-medium text-gray-800">{selectedApp.program_of_interest}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Previous Education:</span>
                    <p className="text-gray-700 mt-1">{selectedApp.previous_education}</p>
                  </div>
                  {selectedApp.gpa && (
                    <div>
                      <span className="text-gray-500">GPA:</span>
                      <p className="font-medium text-gray-800">{selectedApp.gpa}</p>
                    </div>
                  )}
                  {selectedApp.test_scores && (
                    <div>
                      <span className="text-gray-500">Test Scores:</span>
                      <p className="font-medium text-gray-800">{selectedApp.test_scores}</p>
                    </div>
                  )}
                  {selectedApp.extracurricular_activities && (
                    <div>
                      <span className="text-gray-500">Extracurricular Activities:</span>
                      <p className="text-gray-700 mt-1">{selectedApp.extracurricular_activities}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Statement</h3>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedApp.personal_statement}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div className="text-sm">
                  <span className="text-gray-500">Submitted:</span>
                  <span className="ml-2 font-medium text-gray-800">
                    {formatDate(selectedApp.created_at || '')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
