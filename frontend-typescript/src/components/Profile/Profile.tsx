import { PencilIcon } from "@heroicons/react/20/solid";
import {
  Avatar,
  Card,
  CardBody,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import authService from "../../services/authService";
import { UserDataType } from "../../Types";

const Profile = () => {
  const user: UserDataType = authService.getCurrentUser();

  return (
    <>
      <Card className="mt-12 mb-8">
        <CardBody className="overflow-x-scroll p-5">
          <div className="flex items-center gap-4 p-3">
            {user?.files?.length > 0 ? (
              <Avatar
                size="xl"
                alt="avatar"
                src={`http://127.0.0.1:8000/${user.files[0].path}`}
                className="border border-green-500 shadow-xl shadow-green-900/20 ring-4 ring-green-500/30"
              />
            ) : (
              <Typography
                variant="h5"
                className="rounded-[100%] p-[22px] w-[74px] h-[74px] border border-green-500 bg-gradient-to-tr from-yellow-500 to-blue-500 shadow-xl shadow-green-900/20 ring-4 ring-green-500/30 text-black"
              >
                {user?.first_name?.charAt(0).toUpperCase() +
                  user?.last_name?.charAt(0).toUpperCase()}
              </Typography>
            )}
            <div className="flex">
              <div>
                <Typography variant="h6">
                  {user.first_name + " " + user.last_name}
                </Typography>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-normal"
                >
                  {user.role_name}
                </Typography>
              </div>
              <div className="pl-3">
                <Tooltip
                  color="blue"
                  content="Edit Profile"
                  className="bg-blue-500 shadow-xl shadow-black/10"
                >
                  <Link to="edit-profile">
                    <PencilIcon
                      color="blue"
                      className="h-4 w-4 cursor-pointer"
                    />
                  </Link>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-2 p-5 mt-5">
            <div className="flex flex-col gap-1">
              <Typography variant="h6">Email</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {user.email}
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
                {user.date_of_birth}
              </Typography>
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="h6">Gender</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {user.gender}
              </Typography>
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="h6">Hobbies</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {user.hobbies}
              </Typography>
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="h6">Status</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {user.is_active}
              </Typography>
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="h6">Address</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {user.address}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default Profile;
