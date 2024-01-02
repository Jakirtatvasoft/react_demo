import { useState, useEffect, useCallback } from 'react';
import { Button, Input, Dialog, DialogBody, DialogHeader, IconButton } from "@material-tailwind/react";
import Error from "../../common/components/Error";
import { KanbanColumnDataType, ValidationErrorType } from '../../Types';
import { setValidationErrors, validator } from "../../common/validator";
import taskColumnService from '../../services/taskColumnService';
import { toast } from 'react-toastify';

const AddEditColumn = (props:any) => {
 const [formTitle, setFormTitle] = useState<string>("Add Column");
 const [formFields, setFormFields] = useState<KanbanColumnDataType>({
    column_name: "",
 });
 const [formErrors, setFormErrors] = useState<ValidationErrorType>({
    column_name: "",
  });
 const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.MouseEvent<HTMLInputElement | HTMLLIElement | HTMLButtonElement>
  ) => {
    const {
      name,
      value,
    } = event.target as { name: string; value: string };
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };
  const handleNewColumn = async () => {
    setFormTitle("Add Column");
    props.setColumnPopup(false);
    props.setColumnid(0);
    setFormFields({
      column_name: "",
    });
  };
  const handleSubmit = async () => {
    let rules = {
      column_name: "required",
    };

    let messages = {};
    let errors = validator(formFields, rules, messages);

    setValidationErrors(formErrors, setFormErrors, errors);

    if (Object.keys(errors).length == 0) {
      try {
        const formData = new FormData();
        formData.append("column_name", formFields.column_name);

        if (props.columnid) {
          var { data } = await taskColumnService.updateColumn(props.columnid, formData);
        } else {
          var { data } = await taskColumnService.addTaskColumn(formData);
        }

        if (data.flag) {
          handleNewColumn();
          props.setcolumnnavigate(!props.columnnavigate);
          toast.success(data.message);
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

  const getColumn = useCallback(async (columnid: number) => {
    try {
      const { data } = await taskColumnService.editColumn(columnid);
      if (data.flag) {
        setFormTitle("Edit Column");
        setFormFields({
          column_name: data.data.column.column_name,
        });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log("error", err);
    }
  }, [setFormFields, toast]);

  useEffect(() => {
    if (props.columnid) {
      getColumn(props.columnid);
    }
  }, [props.columnid, props.columnpopup]);

 return (
    <>
    <Dialog open={props.columnpopup} handler={() => handleNewColumn()}>
        <DialogHeader className="items-center justify-between">
          <div>{formTitle}</div>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={() => handleNewColumn()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-1">
            <Input
              type="text"
              name="column_name"
              label="Column Name"
              size="lg"
              color="blue"
              value={formFields.column_name}
              onChange={(event) => handleInputChange(event)}
              crossOrigin={undefined}
            />
            <Error error={formErrors.column_name} />
          </div>
          <br />
          <Button
            variant="gradient"
            color="blue"
            fullWidth
            size="lg"
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </DialogBody>
    </Dialog>
    </>
 )
}

export default AddEditColumn