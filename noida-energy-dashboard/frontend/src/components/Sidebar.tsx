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
    <aside className="glass-sidebar" style={{
      width: '240px', minWidth: '240px', height: '100vh',
      display: 'flex', flexDirection: 'column', padding: '0',
      position: 'sticky', top: 0, zIndex: 50
    }}>
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)' }}>
            <Zap size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
              Noida Energy
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Digital Twin v1.0</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink 
            key={to} 
            to={to} 
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 10, textDecoration: 'none',
              fontSize: 13, fontWeight: 600, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: isActive ? '#fff' : '#64748b',
              border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
              boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} color={isActive ? '#818cf8' : 'currentColor'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%',
            background: '#10b981', boxShadow: '0 0 10px #10b981', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>System Live</span>
        </div>
        <div style={{ fontSize: 10, color: '#475569', letterSpacing: '0.05em', fontWeight: 600 }}>NOIDA ANALYTICS HUB</div>
      </div>
    </aside>
  );
}
