import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import SafetyPredict from './pages/SafetyPredict';
import LiveMap from './pages/LiveMap';
import ReportsPage from './pages/ReportsPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import EmergencyDashboard from './pages/EmergencyDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="predict" element={<SafetyPredict />} />
          <Route path="map" element={<LiveMap />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="emergency" element={<EmergencyDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
