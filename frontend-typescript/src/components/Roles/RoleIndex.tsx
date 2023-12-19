import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { useEffect } from 'react';
import authService from '../../services/authService';
import { CREATE_ROLE, READ_ROLE, UPDATE_ROLE } from '../../common/constant';

const RoleIndex = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const { pathname } = useLocation();
  const pathNames = pathname.split("/").filter((path) => path !== "");

  const navigate = useNavigate();

  useEffect(() => {
    let isPermission: boolean = false

    if (pathNames.includes("add-role")) {
      isPermission = authService.checkUserPermission(CREATE_ROLE);
    } else if (pathNames.includes("edit-role")) {
      isPermission = authService.checkUserPermission(UPDATE_ROLE);
    } else if (pathNames.includes("roles")) {
      isPermission = authService.checkUserPermission(READ_ROLE);
    }

    if (isPermission) {
      setHasPermission(isPermission);
    } else {
      navigate("/dashboard");
    }
  }, []);

  return (
    <>{hasPermission && <Outlet />}</>
  )
}

export default RoleIndex
