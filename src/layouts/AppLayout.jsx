import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';

const AppLayout = ({ children }) => (
  <div className="bg-background font-body-md text-body-md text-on-surface antialiased min-h-screen">
    <Header />
    <Sidebar />
    <div className="pl-60 min-h-screen flex flex-col">
      <main className="pt-16 flex-1 w-full bg-background">
        <div className="max-w-7xl mx-auto px-space-lg py-space-md">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  </div>
);

export default AppLayout;
