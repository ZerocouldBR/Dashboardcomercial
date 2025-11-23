import { useEffect } from 'react';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { useDashboardStore } from './store/useDashboardStore';

function App() {
  const { config, setTema } = useDashboardStore();

  useEffect(() => {
    // Aplicar tema inicial
    if (config.tema === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [config.tema]);

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}

export default App;
