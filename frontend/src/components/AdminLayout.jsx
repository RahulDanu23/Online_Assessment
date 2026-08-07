import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, BookOpen, Users, LogOut, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Categories', href: '/admin/categories', icon: FolderKanban },
    { name: 'Quizzes', href: '/admin/assessments', icon: BookOpen },
    { name: 'Student Results', href: '/admin/attempts', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100  flex font-sans">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-slate-50  shadow-md text-slate-600 "
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-50  border-r border-slate-300  transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col pt-16 lg:pt-0">
          <div className="p-6 flex items-center justify-center border-b border-slate-300 ">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600  ">
              Admin Panel
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700  '
                        : 'text-slate-600 hover:bg-slate-100  :bg-gray-700/50'
                    }`
                  }
                  end={item.href === '/admin/dashboard'}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-300 ">
            <div className="flex items-center px-4 py-3 mb-4 text-sm font-medium text-slate-800  bg-slate-100  rounded-xl">
              <div className="w-8 h-8 rounded-full bg-blue-100  text-blue-600  flex items-center justify-center font-bold mr-3">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="truncate flex-1">
                <p className="truncate font-semibold">{user?.name}</p>
                <p className="truncate text-xs text-slate-500 ">Admin</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600  hover:bg-red-50 :bg-red-900/20 rounded-xl transition-all duration-200"
            >
              <LogOut className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8 w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
