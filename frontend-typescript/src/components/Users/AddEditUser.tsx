import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Option,
  Radio,
  Select,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import Error from "../../common/components/Error";
import { RoleDataType, UserDataType, ValidationErrorType } from "../../Types";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userService from "../../services/userService";
import { toast } from "react-toastify";
import { setValidationErrors, validator } from "../../common/validator";
import code from "country-calling-code";

const AddEditUser = () => {
  const [roles, setRoles] = useState<RoleDataType[]>([]);
  const [formTitle, setFormTitle] = useState<string>("Add User");
  const [formFields, setFormFields] = useState<UserDataType>({
    role_id: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    country_code: "+91",
    mobile_number: "",
    date_of_birth: "",
    image: "",
    files: [],
    address: "",
    gender: "Male",
    hobbies: [],
  });
  const [formErrors, setFormErrors] = useState<ValidationErrorType>({
    role_id: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    mobile_number: "",
    date_of_birth: "",
    image: "",
    files: "",
    address: "",
    gender: "",
    hobbies: "",
  });

  const genders: string[] = ["Male", "Female", "Other"];
  const hobbies: string[] = [
    "Cricket",
    "Dancing",
    "Reading",
    "Riding",
    "Swimming",
  ];

  const navigate = useNavigate();
  const { userId } = useParams();

  const getRoles = useCallback(async () => {
    try {
      const { data } = await userService.getRoles();

      if (data.flag) {
        setRoles(data.data.roles);
      } else {
        toast(data.message);
      }
    } catch (err) {
      console.log("error", err);
    }
  }, []);

  const getUser = useCallback(async () => {
    try {
      const { data } = await userService.editUser(userId ?? 0);

      if (data.flag) {
        setFormFields({
          role_id: data.data.user.role.id.toString(),
          first_name: data.data.user.first_name,
          last_name: data.data.user.last_name,
          email: data.data.user.email,
          password: "",
          country_code: data.data.user.country_code,
          mobile_number: data.data.user.mobile_number,
          date_of_birth: data.data.user.date_of_birth,
          image: "",
          files: [],
          address: data.data.user.address,
          gender: data.data.user.gender,
          hobbies: data.data.user.hobbies.split(","),
        });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log("error", err);
    }
  }, [setFormFields, toast]);

  useEffect(() => {
    getRoles();

    if (userId) {
      setFormTitle("Edit user");

      getUser();
    }
  }, [getRoles]);

  const checkGender = (gender: string) => {
    if (formFields.gender == gender) {
      return true;
    }
  };

  const checkHobby = (hobby: string) => {
    if (formFields.hobbies.includes(hobby)) {
      return true;
    }
  };

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.MouseEvent<HTMLInputElement | HTMLLIElement | HTMLButtonElement>
  ) => {
    const {
      name,
      value,
      files = {} as FileList,
    } = event.target as { name: string; value: string; files?: FileList };

    if (name == "image" || name == "files") {
      setFormFields({
        ...formFields,
        [name]: files,
      });
      return;
    } else if (name == "hobbies") {
      if (formFields[name].includes(value)) {
        let hobbies = formFields[name].filter((hobby) => hobby !== value);
        setFormFields({
          ...formFields,
          [name]: hobbies,
        });
      } else {
        setFormFields({
          ...formFields,
          [name]: [...formFields[name], value],
        });
      }
      return;
    }
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  const handleRoleChange = (value: string) => {
    setFormFields({
      ...formFields,
      role_id: value,
    });
  };

  const handleSubmit = async () => {
    let rules = {
      role_id: "required",
      first_name: "required",
      last_name: "required",
      email: "required|email",
      password: "",
      mobile_number: `required|numbers|with_country_call_code:${formFields.country_code}`,
      date_of_birth: "required",
      image: "max_size:3",
      files: "max_file:5|max_size:5",
      address: "required",
      gender: "required",
      hobbies: "required",
    };

    if (!userId) {
      rules["password"] = "required|min:8";
    }

    let messages = {
      role_id: "The role field is required.",
    };

    let errors = validator(formFields, rules, messages);

    setValidationErrors(formErrors, setFormErrors, errors);

    if (Object.keys(errors).length == 0) {
      try {
        const formData = new FormData();
        formData.append("role_id", formFields.role_id);
        formData.append("first_name", formFields.first_name);
        formData.append("last_name", formFields.last_name);
        formData.append("email", formFields.email);
        formData.append("password", formFields.password || "");
        formData.append("country_code", formFields.country_code);
        formData.append("mobile_number", formFields.mobile_number);
        formData.append("date_of_birth", formFields.date_of_birth);
        if (formFields.image !== undefined) {
          formData.append("image", formFields.image[0]);
        }
        formData.append("address", formFields.address);
        formData.append("gender", formFields.gender);

        formFields.hobbies.forEach((hobby: string) => {
          formData.append("hobbies[]", hobby);
        })

        Object.keys(formFields.files).forEach((value, key) => {
          formData.append("files[]", formFields.files[key]);
        });

        if (userId) {
          var { data } = await userService.updateUser(userId, formData);
        } else {
          var { data } = await userService.addUser(formData);
        }

        if (data.flag) {
          toast.success(data.message);
          navigate("/users");
        } else if (data.code === 422) {
          setValidationErrors(formErrors, setFormErrors, data.data.errors);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        console.log("error", err);
      }
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-4 grid h-20 place-items-center"
        >
          <Typography variant="h4" color="white">
            {formTitle}
          </Typography>
        </CardHeader>
        <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col gap-1">
            <Select
              label="Select Role"
              name="role_id"
              color="blue"
              size="lg"
              value={formFields.role_id.toString()}
              onChange={(value) => handleRoleChange(value ?? "0")}
            >
              {roles.length > 0 ? (
                roles.map(({ id, role_name }, key) => (
                  <Option key={id} value={id?.toString()}>
                    {role_name}
                  </Option>
                ))
              ) : (
                <Option disabled>No Roles</Option>
              )}
            </Select>

            <Error error={formErrors.role_id} />
          </div>
          <div className="flex flex-col gap-1">
            <Input
              type="text"
              name="first_name"
              label="First Name"
              size="lg"
              color="blue"
              value={formFields.first_name}
              onChange={(event) => handleInputChange(event)}
              crossOrigin={undefined}
            />

            <Error error={formErrors.first_name} />
          </div>
          <div className="flex flex-col gap-1">
            <Input
              type="text"
              name="last_name"
              label="Last Name"
              size="lg"
              color="blue"
              value={formFields.last_name}
              onChange={(event) => handleInputChange(event)}
              crossOrigin={undefined}
            />

            <Error error={formErrors.last_name} />
          </div>
          <div className="flex flex-col gap-1">
            <Input
              type="email"
              name="email"
              label="Email"
              size="lg"
              color="blue"
              value={formFields.email}
              onChange={(event) => handleInputChange(event)}
              crossOrigin={undefined}
            />

            <Error error={formErrors.email} />
          </div>

          {!userId ? (
            <div className="flex flex-col gap-1">
              <Input
                type="password"
                name="password"
                label="Password"
                size="lg"
                color="blue"
                value={formFields.password}
                onChange={(event) => handleInputChange(event)}
                crossOrigin={undefined}
              />

              <Error error={formErrors.password} />
            </div>
          ) : null}
          <div className="flex flex-col gap-1">
            <div className="relative flex w-full">
              <Menu placement="bottom-start">
                <MenuHandler>
                  <Button
                    ripple={false}
                    variant="text"
                    color="blue-gray"
                    className="flex h-[44px] items-center gap-2 rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3"
                  >
                    {formFields.country_code}
                  </Button>
                </MenuHandler>
                <MenuList className="max-h-[20rem] max-w-[18rem]">
                  {code.map(({ countryCodes, isoCode2 }, index) => {
                    return (
                      <MenuItem
                        key={isoCode2}
                        value={"+" + countryCodes}
                        name="country_code"
                        className="flex items-center gap-2"
                        onClick={(event) => handleInputChange(event)}
                      >
                        {"+" + countryCodes} ({isoCode2})
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
              <Input
                type="text"
                name="mobile_number"
                label="Mobile Number"
                size="lg"
                color="blue"
                className="rounded-l-none"
                value={formFields.mobile_number}
                onChange={(event) => handleInputChange(event)}
                crossOrigin={undefined}
              />
            </div>

            <Error error={formErrors.mobile_number} />
          </div>
          <div className="flex flex-col gap-1">
            <Input
              type="date"
              name="date_of_birth"
              label="Date Of Birth"
              size="lg"
              color="blue"
              value={formFields.date_of_birth}
              onChange={(event) => handleInputChange(event)}
              crossOrigin={undefined}
            />

            <Error error={formErrors.date_of_birth} />
          </div>
          <div className="flex flex-col gap-1">
            <Input
              type="file"
              name="image"
              label="Image"
              size="lg"
              color="blue"
              accept=".jpg,.jpeg,.png"
              onChange={(event) => handleInputChange(event)}
              crossOrigin={undefined}
            />

            <Error error={formErrors.image} />
          </div>
          <div className="flex flex-col gap-1">
            <Input
              type="file"
              name="files"
              label="Files"
              size="lg"
              color="blue"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={(event) => handleInputChange(event)}
              crossOrigin={undefined}
            />

            <Error error={formErrors.files} />
          </div>
          <div className="flex flex-col gap-0">
            <label htmlFor="">Gender</label>
            <div className="grid grid-cols-3 gap-0 md:grid-cols-2 xl:grid-cols-3">
              {genders.map((gender) => (
                <Radio
                  key={gender}
                  name="gender"
                  color="blue"
                  label={gender}
                  value={gender}
                  defaultChecked={checkGender(gender)}
                  onClick={(event) => handleInputChange(event)}
                  crossOrigin={undefined}
                />
              ))}
            </div>

            <Error error={formErrors.gender} />
          </div>
          <div className="flex flex-col gap-0">
            <label htmlFor="">Hobbies</label>
            <div className="grid grid-cols-3 gap-0 md:grid-cols-2 xl:grid-cols-3">
              {hobbies.map((hobby) => (
                <Checkbox
                  key={hobby}
                  name="hobbies"
                  color="blue"
                  label={hobby}
                  value={hobby}
                  defaultChecked={checkHobby(hobby)}
                  onClick={(event) => handleInputChange(event)}
                  crossOrigin={undefined}
                />
              ))}
            </div>

            <Error error={formErrors.hobbies} />
          </div>
          <div className="flex flex-col gap-1">
            <Textarea
              name="address"
              label="Address"
              color="blue"
              value={formFields.address}
              onChange={(event) => handleInputChange(event)}
            />

            <Error error={formErrors.address} />
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
  );
};

export default AddEditUser;
