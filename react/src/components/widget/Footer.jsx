import { HeartIcon } from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";
import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <Typography variant="small" className="font-normal text-inherit">
          &copy; {year}, made with{" "}
          <HeartIcon className="-mt-0.5 inline-block h-3.5 w-3.5" /> by{" "}
          <Link to="/dashboard" className="transition-colors hover:text-blue-500">
              React Demo
          </Link>{" "}
          for a better web.
        </Typography>
      </div>
    </footer>
  );
}

export default Footer;