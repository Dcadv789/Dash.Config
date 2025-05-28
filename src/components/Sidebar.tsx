import React from 'react';
import { NavLink } from 'react-router-dom';
import { ClipboardList, Database, LayoutDashboard } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Cadastros', path: '/cadastros', icon: <ClipboardList size={20} /> },
    { name: 'Banco de Dados', path: '/banco-dados', icon: <Database size={20} /> },
    { name: 'Config. Dashboards', path: '/config-dashboards', icon: <LayoutDashboard size={20} /> },
  ];

  return (
    <div className="w-64 h-[calc(100vh-2rem)] my-4">
      <div className="h-full bg-dark-900/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-dark-800">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center flex-shrink-0 h-20">
            <span className="text-primary-400 text-2xl font-bold">Dashboard</span>
          </div>
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-dark-300 hover:bg-primary-600/10 hover:text-white'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;