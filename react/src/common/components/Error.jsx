import { Typography } from "@material-tailwind/react";

function Error({error}) {
  return (
    <>
      {
        error ?
          <Typography variant="small" color="red">
            { error }
          </Typography>
          :
          null
      }
    </>
  );
}

export default Error;