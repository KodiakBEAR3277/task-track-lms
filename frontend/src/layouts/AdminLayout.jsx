import { Outlet } from 'react-router-dom';

function AdminLayout() {
  return (
    <div>
      {/* Add your admin layout components here */}
      <Outlet />
    </div>
  );
}

export default AdminLayout;