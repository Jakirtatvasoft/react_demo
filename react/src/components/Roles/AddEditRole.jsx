import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useCallback, useEffect, useState } from "react";
import Error from "../../common/components/Error";
import { setValidationErrors, validator } from "../../common/validator";
import roleService from "../../services/roleService";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

function AddEditRole() {
  const [formTitle, setFormTitle] = useState("Add Role")
  const [formFields, setFormFields] = useState({
    role_name: "",
  });
  const [formErrors, setFormErrors] = useState({
    role_name: "",
  });

  const navigate = useNavigate()
  const { roleId } = useParams()

  const handleInputChange = ({ name, value }) => {
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  const getRoles = useCallback(async () => {
    try {
      const { data } = await roleService.getRole(roleId)

      if (data.flag) {
        setFormFields({
          role_name: data.data.role.role_name,
        });
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.log("error", err);
    }
  }, [setFormFields, toast])

  useEffect(() => {
    if (roleId) {
      setFormTitle('Edit Role')

      getRoles()
    }
  }, [getRoles])

  const handleSubmit = async () => {
    let rules = {
      role_name: "required"
    };

    let errors = validator(formFields, rules);

    setValidationErrors(formErrors, setFormErrors, errors);

    if (Object.keys(errors).length == 0) {
      try {
        const formData = new FormData();
        formData.append("role_name", formFields.role_name)

        if (roleId) {
          var { data } = await roleService.updateRole(roleId, formData);
        } else {
          var { data } = await roleService.addRole(formData);
        }

        if (data.flag) {
          toast.success(data.message)
          navigate('/roles')
        } else if (data.code === 422) {
          setValidationErrors(formErrors, setFormErrors, data.data.errors);
        } else {
          toast.error(data.message)
        }
      } catch (err) {
        console.log("error", err);
      }
    }
  };

  return (
    <>
      <div className="container flex justify-center mx-auto p-4 mt-5">
        <Card className="w-full max-w-[24rem]">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-20 place-items-center"
          >
            <Typography variant="h4" color="white">
              {formTitle}
            </Typography>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-1">
              <Input
                type="text"
                name="role_name"
                label="Role Name"
                size="lg"
                color="blue"
                value={formFields.role_name}
                onChange={(event) => handleInputChange(event.target)}
              />

              <Error error={formErrors.role_name} />
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
              Submit
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default AddEditRole;
