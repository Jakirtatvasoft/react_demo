import { UsersIcon } from "@heroicons/react/20/solid"
import { CREATE_ROLE, CREATE_USER, READ_ROLE, READ_USER } from "../../common/constant"
import authService from "../../services/authService"
import { Typography } from "@material-tailwind/react"
import { useCallback, useEffect, useState } from "react"
import dashboardService from "../../services/dashboardService"
import { toast } from "react-toastify"
import { chartsConfig } from './../../charts-config';
import DashboardCard from "../widget/Cards/DashboardCard"
import DashboardChart from "../widget/Charts/DashboardChart"
import { ChartType } from "../../Types"

type dailyTotalUsersChartDataType = number[]
type dailyTotalUsersChartCategories = string[]
type DailyUserType = {
  count: number,
  day: string
}

const Dashboard = () => {
  const [dashboardCardData, setDashboardCardData] = useState({
    totalUsers: 0,
    totalActiveUsers: 0,
    totalInactiveUsers: 0,
    totalUsersCreatedBy: 0,
    totalActiveUsersCreatedBy: 0,
    totalInactiveUsersCreatedBy: 0,
    totalRoles: 0,
    totalActiveRoles: 0,
    totalInactiveRoles: 0,
    totalRolesCreatedBy: 0,
    totalActiveRolesCreatedBy: 0,
    totalInactiveRolesCreatedBy: 0,
  });
  const [dailyTotalUsersChart, setDailyTotalUsersChart] = useState<ChartType>({
    type: "bar",
    height: 270,
    series: [
      {
        name: "Users",
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#fff"],
      plotOptions: {
        bar: {
          columnWidth: "20%",
          borderRadius: 0,
        },
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
    },
  });

  const getDashboardData = useCallback(async () => {
    const { data } = await dashboardService.getDashboardData();

    if (data.flag) {
      setDashboardCardData({
        ...dashboardCardData,
        totalUsers: data.data.totalUsers,
        totalActiveUsers: data.data.totalActiveUsers,
        totalInactiveUsers: data.data.totalInactiveUsers,
        totalUsersCreatedBy: data.data.totalUsersCreatedBy,
        totalActiveUsersCreatedBy: data.data.totalActiveUsersCreatedBy,
        totalInactiveUsersCreatedBy: data.data.totalInactiveUsersCreatedBy,
        totalRoles: data.data.totalRoles,
        totalActiveRoles: data.data.totalActiveRoles,
        totalInactiveRoles: data.data.totalInactiveRoles,
        totalRolesCreatedBy: data.data.totalRolesCreatedBy,
        totalActiveRolesCreatedBy: data.data.totalActiveRolesCreatedBy,
        totalInactiveRolesCreatedBy: data.data.totalInactiveRolesCreatedBy,
      });

      var dailyTotalUsersChartData: dailyTotalUsersChartDataType = [];
      var dailyTotalUsersChartCategories: dailyTotalUsersChartCategories = [];
      data.data.dailyTotalUsers.map((dailyUser: DailyUserType, key: number) => {
        dailyTotalUsersChartData[key] = dailyUser.count;
        dailyTotalUsersChartCategories[key] = dailyUser.day;
      });

      setDailyTotalUsersChart({
        ...dailyTotalUsersChart,
        series: [
          {
            ...dailyTotalUsersChart.series,
            data: dailyTotalUsersChartData,
          },
        ],
        options: {
          ...dailyTotalUsersChart.options,
          xaxis: {
            ...dailyTotalUsersChart.options.xaxis,
            categories: dailyTotalUsersChartCategories,
          },
        },
      });
    } else {
      toast.error(data.message);
    }
  }, []);

  useEffect(() => {
    getDashboardData();
  }, [getDashboardData]);

  return (
    <>
      <div className="mt-12">
        {(authService.checkUserPermission(READ_USER) ||
          authService.checkUserPermission(CREATE_USER) ||
          authService.checkUserPermission(READ_ROLE) ||
          authService.checkUserPermission(CREATE_ROLE)) && (
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            {authService.checkUserPermission(READ_USER) && (
              <DashboardCard
                title="Users"
                color="blue"
                value={dashboardCardData.totalUsers}
                icon={<UsersIcon className="w-6 h-6 text-white" />}
                footer={
                  <div className="flex justify-between">
                    <div className="flex">
                      <Typography className="font-normal text-green-600">
                        Active :
                      </Typography>
                      <Typography className="font-normal text-blue-gray-600 ml-1">
                        {dashboardCardData.totalActiveUsers}
                      </Typography>
                    </div>
                    <div className="flex">
                      <Typography className="font-normal text-red-600">
                        Inactive :
                      </Typography>
                      <Typography className="font-normal text-blue-gray-600 ml-1">
                        {dashboardCardData.totalInactiveUsers}
                      </Typography>
                    </div>
                  </div>
                }
              />
            )}

            {authService.checkUserPermission(CREATE_USER) && (
              <DashboardCard
                title="Users Created By You"
                color="pink"
                value={dashboardCardData.totalUsersCreatedBy}
                icon={<UsersIcon className="w-6 h-6 text-white" />}
                footer={
                  <div className="flex justify-between">
                    <div className="flex">
                      <Typography className="font-normal text-green-600">
                        Active :
                      </Typography>
                      <Typography className="font-normal text-blue-gray-600 ml-1">
                        {dashboardCardData.totalActiveUsersCreatedBy}
                      </Typography>
                    </div>
                    <div className="flex">
                      <Typography className="font-normal text-red-600">
                        Inactive :
                      </Typography>
                      <Typography className="font-normal text-blue-gray-600 ml-1">
                        {dashboardCardData.totalInactiveUsersCreatedBy}
                      </Typography>
                    </div>
                  </div>
                }
              />
            )}

            {authService.checkUserPermission(READ_ROLE) && (
              <DashboardCard
                title="Roles"
                color="green"
                value={dashboardCardData.totalRoles}
                icon={<UsersIcon className="w-6 h-6 text-white" />}
                footer={
                  <div className="flex justify-between">
                    <div className="flex">
                      <Typography className="font-normal text-green-600">
                        Active :
                      </Typography>
                      <Typography className="font-normal text-blue-gray-600 ml-1">
                        {dashboardCardData.totalActiveRoles}
                      </Typography>
                    </div>
                    <div className="flex">
                      <Typography className="font-normal text-red-600">
                        Inactive :
                      </Typography>
                      <Typography className="font-normal text-blue-gray-600 ml-1">
                        {dashboardCardData.totalInactiveRoles}
                      </Typography>
                    </div>
                  </div>
                }
              />
            )}

            {authService.checkUserPermission(CREATE_ROLE) && (
              <DashboardCard
                title="Roles Created By You"
                color="orange"
                value={dashboardCardData.totalRolesCreatedBy}
                icon={<UsersIcon className="w-6 h-6 text-white" />}
                footer={
                  <div className="flex justify-between">
                    <div className="flex">
                      <Typography className="font-normal text-green-600">
                        Active :
                      </Typography>
                      <Typography className="font-normal text-blue-gray-600 ml-1">
                        {dashboardCardData.totalActiveRolesCreatedBy}
                      </Typography>
                    </div>
                    <div className="flex">
                      <Typography className="font-normal text-red-600">
                        Inactive :
                      </Typography>
                      <Typography className="font-normal text-blue-gray-600 ml-1">
                        {dashboardCardData.totalInactiveRolesCreatedBy}
                      </Typography>
                    </div>
                  </div>
                }
              />
            )}
          </div>
        )}

        {authService.checkUserPermission(CREATE_USER) && (
          <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-2">
            {authService.checkUserPermission(CREATE_USER) && (
              <DashboardChart
                color="blue"
                title="Daily Total Number Of User Created"
                description="Day wise total created users in last 7 days"
                chart={dailyTotalUsersChart}
                footer=''
              />
            )}
          </div>
        )}

        {(!authService.checkUserPermission(CREATE_ROLE) &&
          !authService.checkUserPermission(READ_ROLE) &&
          !authService.checkUserPermission(CREATE_USER) &&
          !authService.checkUserPermission(READ_USER)) && (
            <div className="text-center">
              <Typography variant="h4">Welcome To Your Dashboard</Typography>
            </div>
          )}
      </div>
    </>
  )
}

export default Dashboard
