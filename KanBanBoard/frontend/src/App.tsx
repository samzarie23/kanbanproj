import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login_Page from "./pages/Login_Page";
import Employee_Landing from "./pages/Employee/Employee_Landing";
import Admin_Landing from "./pages/Admin/Admin_Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import Admin_Board from "./pages/Admin/Admin_Board";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login_Page />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        {/*Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
          <Route path="/employee-landing" element={<Employee_Landing />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin-landing" element={<Admin_Landing />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin-board" element={<Admin_Board />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
