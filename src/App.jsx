// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import OperatorDashboard from './pages/OperatorDashboard/OperatorDashboard';
import OfficerDashboard from './pages/OfficerDashboard/OfficerDashboard';
import IncidentDetail from './pages/IncidentDetail/IncidentDetail';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />

              {/* RUTAS PROTEGIDAS */}
              <Route 
                path="/operator" 
                element={
                  <ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}>
                    <OperatorDashboard />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/officer" 
                element={
                  <ProtectedRoute allowedRoles={['OFFICER']}>
                    <OfficerDashboard />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/operator/incidents/:id" 
                element={
                  <ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}>
                    <IncidentDetail />
                  </ProtectedRoute>
                } 
              />

            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
