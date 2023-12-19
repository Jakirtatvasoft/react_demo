import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import authService from '../../services/authService';
import { CREATE_USER, READ_USER, UPDATE_USER } from '../../common/constant';

const UserIndex = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const { pathname } = useLocation();
  const pathNames = pathname.split("/").filter((path) => path !== "");

  const navigate = useNavigate();

  useEffect(() => {
    let isPermission = false

    if (pathNames.includes("add-user")) {
      isPermission = authService.checkUserPermission(CREATE_USER);
    } else if (pathNames.includes("edit-user")) {
      isPermission = authService.checkUserPermission(UPDATE_USER);
    } else if (pathNames.includes("users")) {
      isPermission = authService.checkUserPermission(READ_USER);
    }

    if (isPermission) {
      setHasPermission(isPermission);
    } else {
      navigate("/dashboard");
    }
  }, []);

  return <>{hasPermission && <Outlet />}</>;
}

export default UserIndex
