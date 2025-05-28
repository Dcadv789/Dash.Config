import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DatabasePage from './pages/DatabasePage';
import DashboardConfigPage from './pages/DashboardConfigPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/cadastros" element={<RegisterPage />} />
          <Route path="/banco-dados" element={<DatabasePage />} />
          <Route path="/config-dashboards" element={<DashboardConfigPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App