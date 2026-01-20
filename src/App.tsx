import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import LocalizadorRestaurantes from './pages/LocalizadorRestaurantes';
import { useDashboardStore } from './store/useDashboardStore';

function App() {
  const { config } = useDashboardStore();

  useEffect(() => {
    // Aplicar tema inicial
    if (config.tema === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [config.tema]);

  return (
    <Router>
      <Routes>
        {/* Dashboard principal com Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        {/* Localizador de Restaurantes (sem Layout - tem seu próprio layout) */}
        <Route path="/restaurantes" element={<LocalizadorRestaurantes />} />
      </Routes>
    </Router>
  );
}

export default App;
