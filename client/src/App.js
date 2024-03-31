import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import NavBar from './components/NavBar';
import './App.css';
import HostedZones from './components/HostedZones';
import HostedZoneDetails from './components/HostedZoneDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hosted-zones" element={<ProtectedRoute element={<HostedZones />} />} />
        <Route path="/hosted-zones/:id" element={<ProtectedRoute element={<HostedZoneDetails />} />} />
      </Routes>
    </div>
  );
}

export default App;
