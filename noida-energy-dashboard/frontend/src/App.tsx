import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MapView from './pages/MapView';
import Insights from './pages/Insights';
import ModelComparison from './pages/ModelComparison';
import Prediction from './pages/Prediction';
import { CursorFX } from './components/CursorFX';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        background: '#0a0a0f',
        color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'hidden'
      }}>
        <CursorFX />
        <Sidebar />
        <main style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
          <Routes>
            <Route path="/"         element={<MapView />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/models"   element={<ModelComparison />} />
            <Route path="/predict"  element={<Prediction />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
