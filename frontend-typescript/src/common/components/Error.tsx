import { Typography } from '@material-tailwind/react';

type ErrorProps = {
  error: string
}

const Error = ({ error }: ErrorProps) => {
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
  )
}

export default Error
