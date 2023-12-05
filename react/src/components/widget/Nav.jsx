import { setOpenSidenav, useMaterialTailwindController } from "../../context";
import { Avatar, IconButton, Menu, MenuHandler, MenuItem, MenuList, Navbar, Typography } from "@material-tailwind/react";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  Cog6ToothIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import authService from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from 'react-redux';

function Nav() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const user = useSelector((state) => state.user.user);
  const userImage = authService.getImage(user)

  const navigate = useNavigate()

  const logOut = async () => {
    try {
      let { data } = await authService.logout()

      if (data.flag) {
        localStorage.clear();
  
        toast.success(data.message)
        
        navigate("/")
      } else {
          console.log('Erros', data)
      }
    } catch (err) {
      console.log("error", err);
    }
  }

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-end gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3 justify-end">
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

          {
            userImage ?
              <Avatar
                size="sm"
                alt="avatar"
                src={`http://127.0.0.1:8000/${userImage}`}
                className="border border-green-500 shadow-xl shadow-green-900/20 ring-4 ring-green-500/30"
              />
            :
              <Typography
                variant="h6"
                className="rounded-[100%] p-[8px] w-9 h-9 border text-sm border-green-500 bg-yellow-300 shadow-xl shadow-green-900/20 ring-4 ring-green-500/30 text-black cursor-pointer"
              >
                {user?.first_name?.charAt(0).toUpperCase() + user?.last_name?.charAt(0).toUpperCase()}
              </Typography>
          }

          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              <Link to="/profile">
                <MenuItem className="flex items-center gap-3">
                  <UserIcon className="h-5 w-5 text-blue-gray-500" />
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    Profile
                  </Typography>
                </MenuItem>
              </Link>
              <MenuItem className="flex items-center gap-4" onClick={() => logOut()}>
                <ArrowRightOnRectangleIcon className="h-5 w-5 text-blue-gray-500" />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    Logout
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </Navbar>
  );
}

export default Nav;
