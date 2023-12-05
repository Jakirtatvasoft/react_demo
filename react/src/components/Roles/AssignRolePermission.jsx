import { useCallback, useEffect, useState } from "react";
import rolePermissionService from "../../services/rolePermissionService";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Typography,
} from "@material-tailwind/react";
import {
  ASSIGN_ROLE_PERMISSION,
  CREATE_ROLE,
  CREATE_USER,
  DELETE_ROLE,
  DELETE_USER,
  READ_ROLE,
  READ_USER,
  UPDATE_ROLE,
  UPDATE_USER,
} from "../../common/constant";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";

function AssignRolePermission() {
  const [hasPermission, setHasPermission] = useState(false);
  const [roles, setRoles] = useState([]);
  const rolesPermission = [
    CREATE_ROLE,
    READ_ROLE,
    UPDATE_ROLE,
    DELETE_ROLE,
    ASSIGN_ROLE_PERMISSION,
    CREATE_USER,
    READ_USER,
    UPDATE_USER,
    DELETE_USER,
  ];
  const [permissions, setPermissions] = useState([]);

  const navigate = useNavigate()

  const getRoles = useCallback(async () => {
    try {
      const { data } = await rolePermissionService.getRoles();

      if (data.flag) {
        setRoles(data.data.roles);

        let permissionData = [];
        data.data.roles.map((role, key) => {
          permissionData[key] = {
            role_id: role.id,
            permissions: role.role_permissions,
          };
        });
        setPermissions(permissionData);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log("error", err);
    }
  }, [setRoles, toast]);

  useEffect(() => {
    let isPermission = authService.checkUserPermission(ASSIGN_ROLE_PERMISSION);

    if (isPermission) {
      setHasPermission(isPermission);
      getRoles();
    } else {
      navigate("/dashboard");
    }
  }, [getRoles]);

  const checkRolePermission = (roleId, permissionName) => {
    let permissionData = permissions.filter(
      (permission) => permission.role_id === roleId
    );

    if (
      permissionData.length > 0 &&
      permissionData[0].permissions.includes(permissionName)
    ) {
      return true;
    }
  };

  const handleCheckBoxChange = (roleId, permissionName) => {
    let targetObject = permissions.find(
      (permission) => permission.role_id === roleId
    );

    const permission = targetObject.permissions;
    if (permission.includes(permissionName)) {
      targetObject.permissions = permission.filter(
        (perName) => perName !== permissionName
      );
    } else {
      targetObject.permissions = [...permission, permissionName];
    }

    addRolesPermissions();
  };

  const addRolesPermissions = async () => {
    try {
      const { data } = await rolePermissionService.addRolesPermissions({
        permissions: permissions,
      });

      if (data.flag) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <>
      {hasPermission && (
        <div className="mt-12 mb-8 flex flex-col gap-12">
          <Card>
            <CardHeader
              variant="gradient"
              color="blue"
              className="mb-8 p-6 text-center"
            >
              <Typography variant="h6" color="white">
                Assign Permissions to Role
              </Typography>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {roles && roles.length > 0 ? (
                      <th
                        key={0}
                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                          Permission
                        </Typography>
                      </th>
                    ) : null}
                    {roles && roles.length > 0
                      ? roles.map(({ id, role_name }, key) => (
                          <th
                            key={id}
                            className="border-b border-blue-gray-50 py-3 px-5 text-left"
                          >
                            <Typography
                              variant="small"
                              className="text-[11px] font-bold uppercase text-blue-gray-400"
                            >
                              {role_name}
                            </Typography>
                          </th>
                        ))
                      : null}
                  </tr>
                </thead>
                <tbody>
                  {roles && roles.length > 0 && rolesPermission.length > 0
                    ? rolesPermission.map((permission_name, key) => {
                        const className = `py-3 px-5 ${
                          key === rolesPermission.length - 1
                            ? ""
                            : "border-b border-blue-gray-50"
                        }`;

                        return (
                          <tr key={permission_name}>
                            <td className={className}>{permission_name}</td>

                            {roles.length > 0
                              ? roles.map(({ id }, key) => (
                                  <td key={id} className={className}>
                                    <Checkbox
                                      color="blue"
                                      defaultChecked={checkRolePermission(
                                        id,
                                        permission_name
                                      )}
                                      onChange={() =>
                                        handleCheckBoxChange(
                                          id,
                                          permission_name
                                        )
                                      }
                                    />
                                  </td>
                                ))
                              : null}
                          </tr>
                        );
                      })
                    : null}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
}

export default AssignRolePermission;
