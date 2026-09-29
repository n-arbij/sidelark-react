import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/Navbar';
import Calendar from './pages/calendar/Calendar';
import Dashboard from './pages/dashboard/Dashboard';

function Page({ title }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>{title}</h1>
      <Link to="/">Back to dashboard</Link>
    </div>
  );
}

function Layout({ children }) {
  const location = useLocation();
  const showNav = location.pathname !== '/';
  return (
    <>
      {showNav && <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/tasks"     element={<Page title="Tasks" />} />
          <Route path="/goals"     element={<Page title="Goals" />} />
          <Route path="/calendar"  element={<Calendar />} />
          <Route path="/journals"  element={<Page title="Journals" />} />
          <Route path="/habits"    element={<Page title="Habits" />} />
          <Route path="/finance"   element={<Page title="Finance" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
