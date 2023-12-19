import { Card, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";

type DashboarCardProps = {
  title: string,
  color: string,
  icon: React.ReactNode,
  value: string | number,
  footer: string | React.ReactNode
}

function DashboardCard({ color, icon, title, value, footer }: DashboarCardProps) {
  return (
    <Card>
      <CardHeader
        variant="gradient"
        color={color}
        className="absolute -mt-4 grid h-16 w-16 place-items-center"
      >
        {icon}
      </CardHeader>
      <CardBody className="p-4 text-right">
        <Typography variant="paragraph" className="font-normal text-blue-gray-600">
          {title}
        </Typography>
        <Typography variant="h4" color="blue-gray">
          {value}
        </Typography>
      </CardBody>
      {footer && (
        <CardFooter className="border-t border-blue-gray-50 p-4">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

export default DashboardCard;