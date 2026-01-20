import {
  LayoutDashboard,
  TrendingUp,
  Users,
  UserCircle,
  FileText,
  DollarSign,
  AlertCircle,
  Package,
  MapPin
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  href?: string;
}

export const Sidebar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Visão Geral', icon: <LayoutDashboard className="w-5 h-5" />, href: '/' },
    { id: 'restaurantes', label: 'Localizador', icon: <MapPin className="w-5 h-5" />, href: '/restaurantes' },
    { id: 'vendas', label: 'Vendas', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'vendedores', label: 'Vendedores', icon: <UserCircle className="w-5 h-5" /> },
    { id: 'clientes', label: 'Clientes', icon: <Users className="w-5 h-5" /> },
    { id: 'pedidos', label: 'Pedidos', icon: <Package className="w-5 h-5" /> },
    { id: 'notas', label: 'Notas Fiscais', icon: <FileText className="w-5 h-5" /> },
    { id: 'comissoes', label: 'Comissões', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'inadimplencia', label: 'Inadimplência', icon: <AlertCircle className="w-5 h-5" />, badge: 45 },
  ];

  const isActive = (item: MenuItem) => {
    if (item.href) {
      return location.pathname === item.href;
    }
    return activeItem === item.id;
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          if (item.href) {
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item)
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="badge badge-danger">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          } else {
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item)
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="badge badge-danger">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          }
        })}
      </nav>

      {/* Resumo rápido */}
      <div className="p-4 mt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
          Resumo Rápido
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Mês Atual</span>
            <span className="font-semibold text-green-600 dark:text-green-400">85.9%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Comissões</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">R$ 54.3k</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Inadimplência</span>
            <span className="font-semibold text-red-600 dark:text-red-400">5.67%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
