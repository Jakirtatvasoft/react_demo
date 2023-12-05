import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Typography,
} from "@material-tailwind/react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import roleService from "../../services/roleService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import authService from "../../services/authService";
import {
  CREATE_ROLE,
  DELETE_ROLE,
  READ_ROLE,
  UPDATE_ROLE,
} from "../../common/constant";

function Roles() {
  const [roles, setRoles] = useState([]);

  const getRoles = useCallback(async () => {
    try {
      const { data } = await roleService.getRoles();

      if (data.flag) {
        setRoles(data.data.roles);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log("error", err);
    }
  }, [setRoles, toast]);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  const handleIsActive = async (roleId, isActive) => {
    let status = isActive == "Active" ? "In Active" : "Active";

    const isConfirm = await Swal.fire({
      title: "Are you sure?",
      text: `You want to change status to ${status}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then((result) => {
      return result.isConfirmed;
    });

    if (!isConfirm) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("status", status);

      const { data } = await roleService.changeRoleStatus(roleId, formData);
      if (data.flag) {
        let rolesData = [...roles];
        const targetObject = rolesData.find((role) => role.id === roleId);
        if (targetObject) {
          targetObject.is_active = status;
        }

        setRoles(rolesData);

        toast.success(data.message);
      } else {
        toast.error(data.messsage);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleDelete = async (roleId) => {
    const isConfirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      return result.isConfirmed;
    });

    if (!isConfirm) {
      return;
    }

    try {
      const { data } = await roleService.deleteRole(roleId);

      if (data.flag) {
        const rolesData = roles.filter((role) => role.id !== roleId);

        setRoles(rolesData);

        toast.success(data.message);
      } else {
        toast.error(data.messsage);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <>
      {authService.checkUserPermission(CREATE_ROLE) && (
        <div className="flex justify-end mt-3">
          <Link to="add-role">
            <Button className="flex items-center gap-1" color="blue" size="lg">
              <PlusIcon className="w-6 h-6" />
              New Role
            </Button>
          </Link>
        </div>
      )}

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Roles Table
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["#", "Role Name", "Status", "Action"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles && roles.length > 0 ? (
                  roles.map(({ id, role_name, is_active }, key) => {
                    const className = `py-3 px-5 ${
                      key === roles.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={id}>
                        <td className={className}>
                          <Typography variant="small" className="font-semibold">
                            {key + 1}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography variant="small" className="font-semibold">
                            {role_name}
                          </Typography>
                        </td>
                        <td className={className}>
                          {authService.checkUserPermission(UPDATE_ROLE) && (
                            <Button
                              variant="gradient"
                              color={is_active == "Active" ? "green" : "red"}
                              className="py-1 px-2 text-[11px] font-medium"
                              onClick={() => handleIsActive(id, is_active)}
                            >
                              {is_active}
                            </Button>
                          )}

                          {!authService.checkUserPermission(UPDATE_ROLE) && (
                            <Chip
                              variant="gradient"
                              color={is_active == "Active" ? "green" : "red"}
                              value={is_active}
                              className="py-1 px-2 text-[11px] font-medium"
                              style={{ width: "fit-content" }}
                            />
                          )}
                        </td>
                        <td className={className + " flex gap-0"}>
                          {authService.checkUserPermission(UPDATE_ROLE) && (
                            <Link to={`edit-role/${id}`}>
                              <PencilSquareIcon className="w-5 h-5 text-blue-600" />
                            </Link>
                          )}
                          &nbsp;&nbsp;
                          {authService.checkUserPermission(DELETE_ROLE) && (
                            <Link onClick={() => handleDelete(id)}>
                              <TrashIcon className="w-5 h-5 text-red-600" />
                            </Link>
                          )}
                          {!authService.checkUserPermission(UPDATE_ROLE) &&
                            !authService.checkUserPermission(DELETE_ROLE) && (
                              <div>-</div>
                            )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="p-5 text-center" colSpan={4}>
                      No Roles Found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default Roles;
