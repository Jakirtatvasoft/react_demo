import { useState, useEffect, useCallback } from 'react';
import { Button, Input, Dialog, DialogBody, DialogHeader, IconButton, Select, Option} from "@material-tailwind/react";
import Error from "../../common/components/Error";
import { TaskDataType, KanbanColumnDataType, ValidationErrorType } from '../../Types';
import { setValidationErrors, validator } from "../../common/validator";
import taskService from '../../services/taskService';
import { toast } from 'react-toastify';

const AddEditTask = (props:any) => {
 const [formTitle, setFormTitle] = useState<string>("Add Task");
 const [columns, setColumns] = useState<KanbanColumnDataType[]>([]);
 const status_list: string[] = ["Lowest", "Meduim", "Highest"];
 const [formFields, setFormFields] = useState<TaskDataType>({
    column_id: "",
    title: "",
    due_date: "",
    status: ""
 });
 const [formErrors, setFormErrors] = useState<ValidationErrorType>({
    column_id: "",
    title: "",
    due_date: "",
    status: ""
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
  const handleNewTask = async () => {
    setFormTitle("Add Task");
    props.setTaskPopup(false);
    props.setTaskid(0);
    setFormFields({
      column_id: "",
      title: "",
      due_date: "",
      status: ""
    });
  };
  const handleColumnChange = (value: string) => {
    setFormFields({
      ...formFields,
      column_id: value,
    });
  };
  const handleStatusChange = (value: string) => {
    setFormFields({
      ...formFields,
      status: value,
    });
  };
  const handleSubmit = async () => {
    let rules = {
      column_id: "required",
      title: "required",
      due_date: "required",
      status: "required",
    };

    let messages = {};
    let errors = validator(formFields, rules, messages);

    setValidationErrors(formErrors, setFormErrors, errors);

    if (Object.keys(errors).length == 0) {
      try {
        const formData = new FormData();
        formData.append("column_id", formFields.column_id);
        formData.append("title", formFields.title);
        formData.append("due_date", formFields.due_date);
        formData.append("status", formFields.status);

        if (props.taskid) {
          var { data } = await taskService.updateTask(props.taskid, formData);
        } else {
          var { data } = await taskService.addTask(formData);
        }

        if (data.flag) {
          handleNewTask();
          props.settasknavigate(!props.taskavigate);
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

  const getColumns = useCallback(async () => {
    try {
      const { data } = await taskService.getColumns();

      if (data.flag) {
        setColumns(data.data.columns);
      }
    } catch (err) {
      console.log("error", err);
    }
  }, []);

  const getTask = useCallback(async (taskid: number) => {
    try {
      const { data } = await taskService.editTask(taskid);
      if (data.flag) {
        setFormTitle("Edit Task");
        setFormFields({
          column_id: data.data.task.column_id,
          title: data.data.task.title,
          due_date: data.data.task.due_date,
          status: data.data.task.status,
        });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log("error", err);
    }
  }, [setFormFields, toast]);

  useEffect(() => {
    getColumns();
  }, [getColumns, props.taskpopup]);

  useEffect(() => {
    if (props.taskid) {
      getTask(props.taskid);
    }
  }, [props.taskid, props.taskpopup]);

 return (
    <>
    <Dialog open={props.taskpopup} handler={() => handleNewTask()}>
        <DialogHeader className="items-center justify-between">
          <div>{formTitle}</div>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={() => handleNewTask()}
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
            <Select
              label="Select Column"
              name="column_id"
              color="blue"
              size="lg"
              value={formFields.column_id.toString()}
              onChange={(value) => handleColumnChange(value ?? "")}
            >
              {columns.length > 0 ? (
                columns.map(({ id, column_name }) => (
                  <Option key={id} value={id?.toString()}>
                    {column_name}
                  </Option>
                ))
              ) : (
                <Option disabled>No Columns</Option>
              )}
            </Select>
            <Error error={formErrors.column_id} />
          </div>
          <br />
          <div className="flex flex-col gap-1">
            <Input
              type="text"
              name="title"
              label="Title"
              size="lg"
              color="blue"
              value={formFields.title}
              onChange={(event) => handleInputChange(event)}
              crossOrigin={undefined}
            />
            <Error error={formErrors.title} />
          </div>
          <br />
          <div className="flex flex-col gap-1">
            <Select
              label="Select Status"
              name="role_id"
              color="blue"
              size="lg"
              value={formFields.status}
              onChange={(value) => handleStatusChange(value ?? "")}
            >
              {status_list.map((status) => (
                <Option key={status} value={status?.toString()}>
                  {status}
                </Option>
              ))}
            </Select>
            <Error error={formErrors.status} />
          </div>
          <br />
          <div className="flex flex-col gap-1">
            <Input
              type="date"
              name="due_date"
              label="Due date"
              size="lg"
              color="blue"
              value={formFields.due_date}
              onChange={(event) => handleInputChange(event)}
              crossOrigin={undefined}
            />
            <Error error={formErrors.due_date} />
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

export default AddEditTask