import { NavLink } from 'react-router-dom';
import { Map, BarChart2, Cpu, Zap } from 'lucide-react';

const nav = [
  { to: '/',           icon: Map,      label: '3D Map' },
  { to: '/insights',   icon: BarChart2, label: 'Insights' },
  { to: '/models',     icon: Cpu,      label: 'Models' },
  { to: '/predict',    icon: Zap,      label: 'Predict' },
];

export default function Sidebar() {
  return (
    <aside style={{
      width: '220px', minWidth: '220px', height: '100vh',
      background: '#111118', borderRight: '1px solid #2a2a3e',
      display: 'flex', flexDirection: 'column', padding: '0',
      position: 'sticky', top: 0, zIndex: 50
    }}>
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #2a2a3e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 32, height: 32, background: '#6366f1',
            borderRadius: 8, display: 'flex', alignItems: 'center',
            justifyContent: 'center' }}>
            <Zap size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
              Noida Energy
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Analytics Dashboard</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8, textDecoration: 'none',
              fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
              background: isActive ? '#6366f1' : 'transparent',
              color: isActive ? '#fff' : '#94a3b8',
            })}>
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '12px 16px', borderTop: '1px solid #2a2a3e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%',
            background: '#10b981', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 11, color: '#64748b' }}>330 zones loaded</span>
        </div>
        <div style={{ fontSize: 10, color: '#334155' }}>v1.0 — March 2026</div>
      </div>
    </aside>
  );
}
