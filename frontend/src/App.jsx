import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import VerifyOTP from './pages/VerifyOTP';
// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// HR Pages
import HRDashboard from './components/hr/HRDashboard';
import JobForm from './components/hr/JobForm';
import InterviewScheduler from './components/hr/InterviewScheduler';
import ApplicationsManager from './components/hr/ApplicationsManager';

// Interviewer Pages
import InterviewerDashboard from './components/interviewer/InterviewerDashboard';

// Student Pages
import StudentDashboard from './components/student/StudentDashboard';
import Home from "./pages/Home";


function DashboardRouter() {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (user.role === 'HR') return <HRDashboard />;
  if (user.role === 'Interviewer') return <InterviewerDashboard />;
  if (user.role === 'Student') return <StudentDashboard />;
  
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />

            {/* Dashboard - Auto routes based on role */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />

            {/* HR Routes */}
            <Route
              path="/jobs/create"
              element={
                <ProtectedRoute allowedRoles={['HR']}>
                  <JobForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interviews/schedule"
              element={
                <ProtectedRoute allowedRoles={['HR']}>
                  <InterviewScheduler />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute allowedRoles={['HR']}>
                  <ApplicationsManager />
                </ProtectedRoute>
              }
            />

            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

const Unauthorized = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-xl text-gray-600 mb-4">Access Denied</p>
      <p className="text-gray-500">You don't have permission to access this resource</p>
    </div>
  </div>
);

const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-4">Page Not Found</p>
      <p className="text-gray-500">The page you're looking for doesn't exist</p>
    </div>
  </div>
);

export default App;