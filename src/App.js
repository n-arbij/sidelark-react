import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/dashboard/Dashboard';

function Page({ title }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>{title}</h1>
      <Link to="/">Back to dashboard</Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Page title="Tasks" />} />
        <Route path="/goals" element={<Page title="Goals" />} />
        <Route path="/calendar" element={<Page title="Calendar" />} />
        <Route path="/journals" element={<Page title="Journals" />} />
        <Route path="/habits" element={<Page title="Habits" />} />
        <Route path="/finance" element={<Page title="Finance" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
