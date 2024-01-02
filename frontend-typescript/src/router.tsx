import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import App from "./App";
import Login from "./components/auth/Login";
import Protected from "./common/components/Protected";
import Dashboard from "./components/Dashboard/Dashboard";
import RoleIndex from "./components/Roles/RoleIndex";
import Roles from "./components/Roles/Roles";
import AddEditRole from "./components/Roles/AddEditRole";
import AssignRolePermission from "./components/Roles/AssignRolePermission";
import UserIndex from "./components/Users/UserIndex";
import Users from "./components/Users/Users";
import AddEditUser from "./components/Users/AddEditUser";
import ProfileIndex from "./components/Profile/ProfileIndex";
import Profile from "./components/Profile/Profile";
import EditProfile from "./components/Profile/EditProfile";
import EventIndex from "./components/Events/EventIndex";
import Events from "./components/Events/Events";
import KanbanIndex from "./components/Kanban/KanbanIndex";
import Kanban from "./components/Kanban/Kanban";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="" element={<Login />} />
        <Route path='dashboard' element={<Protected Component={Dashboard} />} />
        <Route path='roles' element={<Protected Component={RoleIndex} />}>
          <Route path='' element={<Roles />} />
          <Route path='add-role' element={<AddEditRole />} />
          <Route path='edit-role/:roleId' element={<AddEditRole />} />
        </Route>
        <Route path='assign-role-permission' element={<Protected Component={AssignRolePermission} />} />
        <Route path="users" element={<Protected Component={UserIndex} />}>
          <Route path='' element={<Users />} />
          <Route path='add-user' element={<AddEditUser />} />
          <Route path='edit-user/:userId' element={<AddEditUser />} />
        </Route>
        <Route path='profile' element={<Protected Component={ProfileIndex} />}>
          <Route path='' element={<Profile />} />
          <Route path='edit-profile' element={<EditProfile />} />
        </Route>
        <Route path='events' element={<Protected Component={EventIndex} />}>
          <Route path='' element={<Events />} />
        </Route>
        <Route path='kanban' element={<Protected Component={KanbanIndex} />}>
          <Route path='' element={<Kanban />} />
        </Route>
      </Route>
      <Route path='/*' element={<h4>404 Not found.</h4>} />
    </>
  )
);
