import { useState } from 'react';
import { GraduationCap, FileText, List } from 'lucide-react';
import ApplicationForm from './components/ApplicationForm';
import ApplicationsList from './components/ApplicationsList';

type View = 'form' | 'list';

function App() {
  const [currentView, setCurrentView] = useState<View>('form');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Student Application Portal</h1>
                <p className="text-xs text-gray-500">Manage Your Applications</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('form')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'form'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                New Application
              </button>
              <button
                onClick={() => setCurrentView('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
                View Applications
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'form' ? (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Submit Your Application</h2>
              <p className="text-gray-600">
                Fill out the form below to apply for your desired program. All fields marked with * are required.
              </p>
            </div>
            <ApplicationForm onSuccess={() => setCurrentView('list')} />
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">All Applications</h2>
              <p className="text-gray-600">
                View and manage all submitted applications. Click on any application to see full details.
              </p>
            </div>
            <ApplicationsList />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Student Application Portal - Secure and Easy Application Management
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
