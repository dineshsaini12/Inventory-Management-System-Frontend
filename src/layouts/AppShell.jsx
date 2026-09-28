import { useState } from 'react';
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Boxes, ClipboardList, LayoutDashboard, LogOut, Menu, Package, ShoppingBag, ShoppingCart, Truck, Warehouse } from 'lucide-react';
import { Dashboard } from '../pages/Dashboard';
import { Products } from '../pages/Products';
import { Stock } from '../pages/Stock';
import { Suppliers } from '../pages/Suppliers';
import { Orders } from '../pages/Orders';
import { Purchases } from '../pages/Purchases';
import { Inventory } from '../pages/Inventory';
import { Reports } from '../pages/Reports';
import '../App.css';
const navGroups = [['WORKSPACE', [['Dashboard', '/dashboard', LayoutDashboard]]], ['OPERATIONS', [['Products', '/products', Package], ['Stock', '/stock', Warehouse], ['Suppliers', '/suppliers', Truck]]], ['TRANSACTIONS', [['Customer Orders', '/customers', ShoppingCart], ['Purchases', '/purchases', ShoppingBag]]], ['RECORDS', [['Inventory Record', '/inventory', ClipboardList], ['Reports', '/reports', BarChart3]]]];
export function AppShell({
  data,
  setData,
  onLogout,
  notify
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const active = navGroups.flatMap(group => group[1]).find(item => item[1] === location.pathname)?.[0];
  const title = active || 'Dashboard';
  return <div className="app-shell min-h-screen">
      <aside className={`sidebar transition-transform duration-300 ease-in-out ${drawer ? 'open' : ''}`}>
        <button className="logo-button transition-colors duration-200 hover:text-white" onClick={() => {
        navigate('/dashboard');
        setDrawer(false);
      }}>
          <span className="brand-mark"><Boxes /></span>
          <span className="logo-name">Stockroom<span className="brand-dot">.</span><small>INVENTORY SUITE</small></span>
        </button>

        <div className="nav-scroll">
          {navGroups.map(([group, items]) => <div className="nav-group" key={group}>
              <div className="nav-label">{group}</div>
              {items.map(([label, path, Icon]) => <NavLink key={path} to={path} onClick={() => setDrawer(false)} className={({
            isActive
          }) => `nav-item transition-all duration-200 ease-out hover:translate-x-1 ${isActive ? 'active' : ''}`}>
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>)}
            </div>)}
        </div>

        <div className="sidebar-bottom">
          <div className="system-status"><i />System online <span>DEMO</span></div>
          <button className="profile transition-colors duration-200 hover:bg-white/5" onClick={onLogout}>
            <span className="avatar">AM</span>
            <span className="profile-meta"><b>Alex Morgan</b><small>Workspace manager</small></span>
            <LogOut size={16} className="logout-icon" />
          </button>
        </div>
      </aside>

      {drawer && <button className="drawer-scrim" aria-label="Close menu" onClick={() => setDrawer(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setDrawer(!drawer)}><Menu size={20} /></button>
          <div className="breadcrumbs">Workspace <span>/</span> <b>{title}</b></div>
          <div className="top-actions">
            <span className="top-demo"><i /> DEMO MODE</span>
            <span className="top-date">{new Date().toLocaleDateString('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short'
            })}</span>
            <button className="top-avatar" title="Sign out" onClick={onLogout}>AM</button>
          </div>
        </header>

        <div className="page-wrap mx-auto w-full max-w-[1450px]">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard data={data} navigate={navigate} />} />
            <Route path="/products" element={<Products data={data} setData={setData} notify={notify} />} />
            <Route path="/stock" element={<Stock data={data} />} />
            <Route path="/suppliers" element={<Suppliers data={data} setData={setData} notify={notify} />} />
            <Route path="/customers" element={<Orders data={data} setData={setData} notify={notify} />} />
            <Route path="/purchases" element={<Purchases data={data} setData={setData} notify={notify} />} />
            <Route path="/inventory" element={<Inventory data={data} />} />
            <Route path="/reports" element={<Reports data={data} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <footer className="page-footer">
            <span>Stockroom <b>·</b> Inventory management demo</span>
            <span>All changes saved automatically</span>
          </footer>
        </div>
      </main>
    </div>;
}
