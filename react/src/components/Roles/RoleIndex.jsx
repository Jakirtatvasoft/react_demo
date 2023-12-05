import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { CREATE_ROLE, READ_ROLE, UPDATE_ROLE } from "../../common/constant";

function RoleIndex() {
  const [hasPermission, setHasPermission] = useState(false);
  const { pathname } = useLocation();
  const pathNames = pathname.split("/").filter((path) => path !== "");

  const navigate = useNavigate();

  useEffect(() => {
    let isPermission = false

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

  return <>{hasPermission && <Outlet />}</>;
}

export default RoleIndex;
