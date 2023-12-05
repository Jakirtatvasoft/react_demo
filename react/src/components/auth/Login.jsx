import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { setValidationErrors, validator } from "../../common/validator";
import Error from "../../common/components/Error";
import authService, { getCurrentUser } from "../../services/authService";
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { setCurrentUserState } from './../../store/action/userActions';

function Login() {
  const [isUser, setIsUser] = useState(true)
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    let userInfo = getCurrentUser()

    if (userInfo) {
      navigate('/dashboard')
    }

    setIsUser(false)
  }, [])

  const handleInputChange = ({ name, value }) => {
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    let rules = {
      email: "required|email",
      password: "required|min:8",
    };

    let errors = validator(formFields, rules);

    setValidationErrors(formErrors, setFormErrors, errors);

    if (Object.keys(errors).length == 0) {
      try {
        const formData = new FormData();

        formData.append("email", formFields.email);
        formData.append("password", formFields.password);

        const { data } = await authService.login(formData);

        if (data.flag) {
          authService.setCurrentUser(data.data)

          dispatch(setCurrentUserState(data.data.user))

          toast.success(data.message)
          
          navigate('/dashboard')
        } else if (data.code === 422) {
          setValidationErrors(formErrors, setFormErrors, data.data.errors);
        } else {
        }
      } catch (err) {
        console.log("error", err);
      }
    }
  };

  return (
    <>
      {
        !isUser && 
        <>
          <img
            src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
            className="absolute inset-0 z-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
          <div className="container mx-auto p-4">
            <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
              <CardHeader
                variant="gradient"
                color="blue"
                className="mb-4 grid h-28 place-items-center"
              >
                <Typography variant="h3" color="white">
                  Login
                </Typography>
              </CardHeader>
              <CardBody>
                <div className="flex flex-col gap-1">
                  <Input
                    type="email"
                    name="email"
                    label="Email"
                    size="lg"
                    color="blue"
                    value={formFields.email}
                    onChange={(event) => handleInputChange(event.target)}
                  />

                  <Error error={formErrors.email} />
                </div>

                <div className="flex flex-col gap-1 pt-4">
                  <Input
                    type="password"
                    name="password"
                    label="Password"
                    size="lg"
                    color="blue"
                    value={formFields.password}
                    onChange={(event) => handleInputChange(event.target)}
                  />

                  <Error error={formErrors.password} />
                </div>
              </CardBody>
              <CardFooter className="pt-0">
                <Button
                  variant="gradient"
                  color="blue"
                  fullWidth
                  size="lg"
                  onClick={() => handleSubmit()}
                >
                  Sign In
                </Button>
              </CardFooter>
            </Card>
          </div>
        </>
      }
    </>
  );
}

export default Login;
