import authService from '../../services/authService';
import { CREATE_USER, DELETE_USER, READ_USER, UPDATE_USER } from '../../common/constant';
import { Link } from 'react-router-dom';
import { Avatar, Button, Card, CardBody, CardHeader, Chip, Dialog, DialogBody, DialogHeader, IconButton, Typography } from '@material-tailwind/react';
import { EyeIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { UserDataType } from '../../Types';
import { useEffect, useState } from 'react';
import { useCallback } from 'react';
import userService from '../../services/userService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Users = () => {
  const [users, setUsers] = useState<UserDataType[]>([]);
  const [user, setUser] = useState<UserDataType>({} as UserDataType);
  const [showUser, setShowUser] = useState<boolean>(false);

  const getUsers = useCallback(async () => {
    try {
      const { data } = await userService.getUsers();

      if (data.flag) {
        setUsers(data.data.users);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log("error", err);
    }
  }, [setUsers, toast]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleIsActive = async (userId: number | string, isActive: string) => {
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

      const { data } = await userService.changeUserStatus(userId, formData);
      if (data.flag) {
        let usersData = [...users];
        const targetObject = usersData.find((user) => user.id === userId);
        if (targetObject) {
          targetObject.is_active = status;
        }

        setUsers(usersData);

        toast.success(data.message);
      } else {
        toast.error(data.messsage);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleShowUser = async (userId: string | number = "") => {
    if (userId) {
      const { data } = await userService.getUser(userId);

      if (data.flag) {
        setUser(data.data.user);

        setShowUser(true);
      } else {
        toast.error(data.message);
      }
    } else {
      setShowUser(false);
    }
  };

  const handleDelete = async (userId: string | number) => {
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
      const { data } = await userService.deleteUser(userId);

      if (data.flag) {
        const usersData = users.filter((user) => user.id !== userId);

        setUsers(usersData);

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
      {authService.checkUserPermission(CREATE_USER) && (
        <div className="flex justify-end mt-3">
          <Link to="add-user">
            <Button className="flex items-center gap-1" color="blue" size="lg">
              <PlusIcon className="w-6 h-6" />
              New User
            </Button>
          </Link>
        </div>
      )}

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Users Table
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[
                    "#",
                    "Role",
                    "Name",
                    "Email",
                    "Mobile Number",
                    "Status",
                    "Action",
                  ].map((el) => (
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
                {users && users.length > 0 ? (
                  users.map(
                    (
                      {
                        id,
                        role_name,
                        first_name,
                        last_name,
                        email,
                        country_code,
                        mobile_number,
                        is_active,
                      },
                      key
                    ) => {
                      const className = `py-3 px-5 ${
                        key === users.length - 1
                          ? ""
                          : "border-b border-blue-gray-50"
                      }`;

                      return (
                        <tr key={id}>
                          <td className={className}>
                            <Typography
                              variant="small"
                              className="font-semibold"
                            >
                              {key + 1}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              className="font-semibold"
                            >
                              {role_name}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              className="font-semibold"
                            >
                              {first_name + " " + last_name}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              className="font-semibold"
                            >
                              {email}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              className="font-semibold"
                            >
                              {country_code + mobile_number}
                            </Typography>
                          </td>
                          <td className={className}>
                            {authService.checkUserPermission(UPDATE_USER) && (
                              <Button
                                variant="gradient"
                                color={
                                  is_active == "Active" ? "green" : "red"
                                }
                                className="py-1 px-2 text-[11px] font-medium"
                                onClick={() => handleIsActive(id ?? 0, is_active ?? '')}
                              >
                                {is_active}
                              </Button>
                            )}

                            {!authService.checkUserPermission(
                              UPDATE_USER
                            ) && (
                              <Chip
                                variant="gradient"
                                color={
                                  is_active == "Active" ? "green" : "red"
                                }
                                value={is_active}
                                className="py-1 px-2 text-[11px] font-medium"
                                style={{ width: "fit-content" }}
                              />
                            )}
                          </td>
                          <td className={className + " flex gap-0"}>
                            {authService.checkUserPermission(UPDATE_USER) && (
                              <Link to={`edit-user/${id}`}>
                                <PencilSquareIcon className="w-5 h-5 text-blue-700" />
                              </Link>
                            )}
                            &nbsp;&nbsp;
                            {authService.checkUserPermission(READ_USER) && (
                              <Link to="" onClick={() => handleShowUser(id)}>
                                <EyeIcon className="w-5 h-5 text-blue-400" />
                              </Link>
                            )}
                            &nbsp;&nbsp;
                            {authService.checkUserPermission(DELETE_USER) && (
                              <Link to="" onClick={() => handleDelete(id ?? 0)}>
                                <TrashIcon className="w-5 h-5 text-red-600" />
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td className="p-5 text-center" colSpan={7}>
                      No Users Found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>

      <Dialog open={showUser} handler={() => handleShowUser()}>
        <DialogHeader className="items-center justify-between">
          <div>User Detail</div>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={() => handleShowUser()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>
        <DialogBody>
          <div className="flex items-center gap-4">
            {user?.files?.length > 0 ? (
              <Avatar
                size="xl"
                alt="avatar"
                src={`http://127.0.0.1:8000/${user.files[0].path}`}
                className="border border-green-500 shadow-xl shadow-green-900/20 ring-4 ring-green-500/30"
              />
            ) : (
              <Typography
                variant="h6"
                className="rounded-[100%] p-[25px] w-[74px] h-[74px] border border-green-500 bg-yellow-300 shadow-xl shadow-green-900/20 ring-4 ring-green-500/30 text-black"
              >
                {user?.first_name?.charAt(0).toUpperCase() +
                  user?.last_name?.charAt(0).toUpperCase()}
              </Typography>
            )}
            <div>
              <Typography variant="h6">
                {user?.first_name + " " + user?.last_name}
              </Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {user.role_name || "-"}
              </Typography>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2 p-5 mt-5">
            <div className="flex flex-col gap-1">
              <Typography variant="h6">Email</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {user.email || "-"}
              </Typography>
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="h6">Mobile Number</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {user.country_code + user.mobile_number}
              </Typography>
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="h6">Date of Birth</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {user.date_of_birth || "-"}
              </Typography>
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="h6">Gender</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {user.gender || "-"}
              </Typography>
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="h6">Hobbies</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {user.hobbies || "-"}
              </Typography>
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="h6">Status</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {user.is_active || "-"}
              </Typography>
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="h6">Address</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {user.address || "-"}
              </Typography>
            </div>
          </div>
        </DialogBody>
      </Dialog>
    </>
  )
}

export default Users
