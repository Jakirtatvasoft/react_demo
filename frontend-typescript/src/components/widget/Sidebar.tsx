import { Link, NavLink } from "react-router-dom";
import { setOpenSidenav, useMaterialTailwindController } from "../../context";
import { Avatar } from "@material-tailwind/react";
import { Typography } from "@material-tailwind/react";
import { IconButton } from "@material-tailwind/react";
import { UserPlusIcon, UsersIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Button } from "@material-tailwind/react";
import { HomeIcon } from "@heroicons/react/24/solid";
import authService from "../../services/authService";
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
import { UserCircleIcon } from "@heroicons/react/24/solid";

const Sidebar = () => {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-blue-gray-800 to-blue-gray-900",
    white: "bg-white shadow-lg",
    transparent: "bg-transparent",
  };

  return (
    <>
      <aside
        className={`${sidenavTypes[sidenavType]} ${
          openSidenav ? "translate-x-0" : "-translate-x-80"
        } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0`}
      >
        <div
          className={`relative border-b ${
            sidenavType === "dark" ? "border-white/20" : "border-blue-gray-50"
          }`}
        >
          <Link to="/dashboard" className="flex items-center gap-4 py-6 px-8">
            <Avatar src="" size="sm" />
            <Typography
              variant="h6"
              color={sidenavType === "dark" ? "white" : "blue-gray"}
            >
              React Demo
            </Typography>
          </Link>
          <IconButton
            variant="text"
            color="white"
            size="sm"
            ripple={false}
            className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
            onClick={() => setOpenSidenav(dispatch, false)}
          >
            <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
          </IconButton>
        </div>
        <div className="m-4">
          <ul className="mb-4 flex flex-col gap-1">
            <li>
              <NavLink to="/dashboard">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "gradient" : "text"}
                    color={
                      isActive
                        ? sidenavColor
                        : sidenavType === "dark"
                        ? "white"
                        : "blue-gray"
                    }
                    className="flex items-center gap-4 px-4 capitalize"
                    fullWidth
                  >
                    <HomeIcon className="w-5 h-5 text-inherit" />
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Dashboard
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>
            {(authService.checkUserPermission(CREATE_ROLE) ||
              authService.checkUserPermission(READ_ROLE) ||
              authService.checkUserPermission(UPDATE_ROLE) ||
              authService.checkUserPermission(DELETE_ROLE)) && (
              <li>
                <NavLink to="/roles">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color={
                        isActive
                          ? sidenavColor
                          : sidenavType === "dark"
                          ? "white"
                          : "blue-gray"
                      }
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <UserCircleIcon className="w-5 h-5 text-inherit" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        Roles
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            )}

            {authService.checkUserPermission(ASSIGN_ROLE_PERMISSION) && (
              <li>
                <NavLink to="/assign-role-permission">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color={
                        isActive
                          ? sidenavColor
                          : sidenavType === "dark"
                          ? "white"
                          : "blue-gray"
                      }
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <UserPlusIcon className="w-5 h-5 text-inherit" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        Assign Role Permissions
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            )}

            {(authService.checkUserPermission(CREATE_USER) ||
              authService.checkUserPermission(READ_USER) ||
              authService.checkUserPermission(UPDATE_USER) ||
              authService.checkUserPermission(DELETE_USER)) && (
              <li>
                <NavLink to="/users">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color={
                        isActive
                          ? sidenavColor
                          : sidenavType === "dark"
                          ? "white"
                          : "blue-gray"
                      }
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <UsersIcon className="w-5 h-5 text-inherit" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        Users
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            )}

            <li>
              <NavLink to="/events">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "gradient" : "text"}
                    color={
                      isActive
                        ? sidenavColor
                        : sidenavType === "dark"
                        ? "white"
                        : "blue-gray"
                    }
                    className="flex items-center gap-4 px-4 capitalize"
                    fullWidth
                  >
                    <UsersIcon className="w-5 h-5 text-inherit" />
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Event Management
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink to="/kanban">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "gradient" : "text"}
                    color={
                      isActive
                        ? sidenavColor
                        : sidenavType === "dark"
                        ? "white"
                        : "blue-gray"
                    }
                    className="flex items-center gap-4 px-4 capitalize"
                    fullWidth
                  >
                    <UsersIcon className="w-5 h-5 text-inherit" />
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Kanban Board
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>

          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
