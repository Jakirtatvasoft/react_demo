import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from 'react-apexcharts'
import { ChartType } from "../../../Types";

type DashboardChartProps = {
  color: color,
  chart: ChartType
  title: string,
  description: string,
  footer: string | React.ReactNode
}

function DashboardChart({ color, chart, title, description, footer }: DashboardChartProps) {
  return (
    <Card>
      <CardHeader variant="gradient" color={color}>
        <Chart {...chart} />
      </CardHeader>
      <CardBody className="p-6">
        <Typography variant="h6" color="blue-gray">
          {title}
        </Typography>
        <Typography variant="small" className="font-normal text-blue-gray-600">
          {description}
        </Typography>
      </CardBody>
      {footer && (
        <CardFooter className="border-t border-blue-gray-50 px-6 py-5">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

export default DashboardChart;
