import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import TechniquesPage from './pages/TechniquesPage';
import TechniquePage from './pages/TechniquePage';
import ControllerPage from './pages/ControllerPage';
import MapsPage from './pages/MapsPage';
import ProfilePage from './pages/ProfilePage';
import { ProfileProvider } from './context/ProfileContext';

export default function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tecniche" element={<TechniquesPage />} />
          <Route path="/tecniche/:slug" element={<TechniquePage />} />
          <Route path="/controller" element={<ControllerPage />} />
          <Route path="/maps" element={<MapsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </ProfileProvider>
  );
}
