import { Button, Card, CardBody, CardHeader, Input, Option, Select, Typography, Dialog, DialogBody, DialogHeader, IconButton,
} from "@material-tailwind/react";
import Error from "../../common/components/Error";
import { Link } from 'react-router-dom';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import { EventDataType, CalendarEventDataType, ValidationErrorType } from '../../Types';
import { setValidationErrors, validator } from "../../common/validator";
import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';
import eventService from '../../services/eventService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const Events = () => {
  const [events, setEvents] = useState<EventDataType[]>([]);
  const [event, setEvent] = useState<EventDataType>({} as EventDataType);
  const [showEvent, setShowEvent] = useState<boolean>(false);
  const [calenderevents, setCalenderevents] = useState<CalendarEventDataType[]>([]); 
  const [eventflag, setEventflag] = useState(0);
  const [eventpopup, setEventpopup] = useState<boolean>(false);
  const [viewrepeat, setViewrepeat] = useState<boolean>(false);
  const [eventid, setEventid] = useState(0);
  const [formTitle, setFormTitle] = useState<string>("Add Event");
  const [expandedRow, setExpandedRow] = useState(null);
  const [formFields, setFormFields] = useState<EventDataType>({
    event_name: "",
    event_color: "",
    event_date: "",
    recurring: "",
    repeat_end_date: "",
  });
  const [formErrors, setFormErrors] = useState<ValidationErrorType>({
    event_name: "",
    event_color: "",
    event_date: "",
    recurring: "",
    repeat_end_date: "",
  });
  const handleRowClick = (id : any) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  const recurring: string[] = ["None", "Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];
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
  const handleRecurringChange = (value: string) => {
    if(value != "None") {
      setViewrepeat(true);
    } else {
      setViewrepeat(false);
    }
    setFormFields({
      ...formFields,
      recurring: value,
    });
  };
  const handleNewEvent = () => {
    setEventpopup(true);
    setEventid(0);
    setFormFields({
      ...formFields,
      event_date: "",
    });
  };
  const handleUpdateEvent = async (id: number | "") => {
    if(id) {
      setEventpopup(true);
      setEventid(id);
      setFormTitle('Update Event');
      const { data } = await eventService.editEvent(id ?? 0);
      if (data.flag) {
        setFormFields({
          event_name: data.data.event.event_name,
          event_color: data.data.event.event_color,
          event_date: data.data.event.event_date,
          recurring: data.data.event.recurring,
          repeat_end_date: data.data.event.repeat_end_date,
        });
        if(data.data.event.repeat_end_date) {
          setViewrepeat(true);
        } else {
          setViewrepeat(false);
        }
      } else {
        toast.error(data.message);
      }
    } else {
      setViewrepeat(false);
      setEventpopup(false);
      setEventid(0);
      setFormTitle('New Event');
      setFormFields({
        event_name: "",
        event_color: "",
        event_date: "",
        recurring: "",
        repeat_end_date: "",
      });
    }
  };
  const localizer = momentLocalizer(moment);

  const getEvents = useCallback(async () => {
    try {
      const { data } = await eventService.getEvents();

      if (data.flag) {
        setEvents(data.data.events);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log("error", err);
    }
  }, [setEvents, toast]);

  const getCalenderevents = useCallback(async () => {
    try {
      const { data } = await eventService.getCalenderEvents();

      if (data.flag) {
        const rows = [];
        const len = data.data.events;
        for (let i = 0; i < len.length; i++) {
          rows.push({
              id: data.data.events[i].id,
              title: data.data.events[i].event_name,
              start: data.data.events[i].event_date,
              end: data.data.events[i].event_date,
              color: data.data.events[i].event_color,
          });
        }
        setCalenderevents(rows);
      } else {
        // toast.error(data.message);
      }
    } catch (err) {
      console.log("error", err);
    }
  }, [setCalenderevents, toast]);

  useEffect(() => {
    getEvents();
    getCalenderevents();
  }, [getEvents, getCalenderevents, eventflag]);

  const eventStyleGetter = (calenderevents: any) => {
    const backgroundColor = calenderevents.color;
    return {
      style: {
        backgroundColor,
      },
    };
  };

  const handleShowEvent = async (eventId: string | number = "") => {
    if (eventId) {
      const { data } = await eventService.editEvent(eventId);

      if (data.flag) {
        setEvent(data.data.event);

        setShowEvent(true);
      } else {
        toast.error(data.message);
      }
    } else {
      setShowEvent(false);
    }
  };

  const handleDelete = async (eventId: string | number) => {
    const isConfirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      return result.isConfirmed;
    });

    if (!isConfirm) {
      return;
    }

    try {
      const { data } = await eventService.deleteEvent(eventId);

      if (data.flag) {
        const eventsData = events.filter((event) => event.id !== eventId);

        setEvents(eventsData);

        toast.success(data.message);
      } else {
        toast.error(data.messsage);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleSubmit = async () => {
    let rules = {
      event_name: "required",
      event_color: "required",
      event_date: "required",
      recurring: "required",
    };

    let messages = {};
    let errors = validator(formFields, rules, messages);

    setValidationErrors(formErrors, setFormErrors, errors);

    if (Object.keys(errors).length == 0) {
      try {
        const formData = new FormData();
        formData.append("event_name", formFields.event_name);
        formData.append("event_color", formFields.event_color);
        formData.append("event_date", formFields.event_date);
        formData.append("recurring", formFields.recurring);
        formData.append("repeat_end_date", formFields.repeat_end_date);

        if (eventid) {
          var { data } = await eventService.updateEvent(eventid, formData);
        } else {
          var { data } = await eventService.addEvent(formData);
        }

        if (data.flag) {
          setEventpopup(false);
          toast.success(data.message);
          setEventflag(0);
          getEvents();
          getCalenderevents();
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

  const handleSelect = (event:any) => {
    var event_date = new Date(event.start), mnth = ("0" + (event_date.getMonth() + 1)).slice(-2), day = ("0" + event_date.getDate()).slice(-2);
    var e_date = [event_date.getFullYear(), mnth, day].join("-");
    setFormFields({
      ...formFields,
      event_date: e_date,
    });
    setEventpopup(true);
    setEventid(0);
  };

  const handleEventSelect = (event:any) => {
    handleShowEvent(event.id);
  };

  return (
    <>
      <div className="flex justify-end mt-3">
        <Link to="" onClick={() => setEventflag(0)}>
          <Button className="flex items-center gap-1" color="blue" size="lg">
              Calender View
          </Button>
        </Link>
        <Link to="" onClick={() => setEventflag(1)}>
          <Button className="flex items-center gap-1" color="blue" size="lg">
              List View
          </Button>
        </Link>
        <Link to="" onClick={() => handleNewEvent()}>
          <Button className="flex items-center gap-1" color="blue" size="lg">
            New Event
          </Button>
        </Link>
      </div>

      { eventflag == 0 && (
        <div className="mt-12 mb-8 flex flex-col gap-12">
          <Card>
            <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
              <Typography variant="h6" color="white">
                Calender View
              </Typography>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <Calendar
              localizer={localizer}
              events={calenderevents}
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={eventStyleGetter}
              selectable={true}
              onSelectSlot={handleSelect}
              onSelectEvent={handleEventSelect}
              style={{ height: 500 }}
            />
            </CardBody>
          </Card>
        </div>
      )}

      { eventflag == 1 && (
        <>
          <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
              <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
                <Typography variant="h6" color="white">
                  List View
                </Typography>
              </CardHeader>
              <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                <table className="w-full min-w-[640px] table-auto">
                  <thead>
                    <tr>
                      {[
                        "#",
                        "Event Name",
                        "Event Date",
                        "Recurring",
                        "Action",
                      ].map((el) => (
                        <th
                          key={el}
                          className="border-b border-blue-gray-50 py-3 px-5 text-left"
                        >
                          <Typography
                            variant="small"
                            className="text-[11px] font-bold uppercase text-blue-gray-400"
                          >
                            {el}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {events && events.length > 0 ? (
                      events.map(
                        (
                          {
                            id,
                            event_name,
                            event_date,
                            recurring,
                            message
                          },
                          key
                        ) => {
                          const className = `py-3 px-5 ${
                            key === events.length - 1
                              ? ""
                              : "border-b border-blue-gray-50"
                          }`;

                          return (
                            <React.Fragment key={id}>
                              <tr onClick={() => handleRowClick(id)}>
                                <td className={className}>
                                  <Typography
                                    variant="small"
                                    className="font-semibold"
                                  >
                                    {key + 1}
                                  </Typography>
                                </td>
                                <td className={className}>
                                  <Typography
                                    variant="small"
                                    className="font-semibold"
                                  >
                                    {event_name}
                                  </Typography>
                                </td>
                                <td className={className}>
                                  <Typography
                                    variant="small"
                                    className="font-semibold"
                                  >
                                    {event_date}
                                  </Typography>
                                </td>
                                <td className={className}>
                                  <Typography
                                    variant="small"
                                    className="font-semibold"
                                  >
                                    {recurring}
                                  </Typography>
                                </td>
                                <td className={className + " flex gap-0"}>
                                  <Link to="" onClick={() => handleUpdateEvent(id ?? 0)}>
                                    <PencilSquareIcon className="w-5 h-5 text-blue-700" />
                                  </Link>
                                  <Link to="" onClick={() => handleShowEvent(id)}>
                                    <EyeIcon className="w-5 h-5 text-blue-400" />
                                  </Link>
                                  &nbsp;&nbsp;
                                  <Link to="" onClick={() => handleDelete(id ?? 0)}>
                                    <TrashIcon className="w-5 h-5 text-red-600" />
                                  </Link>
                                </td>
                              </tr>
                              {expandedRow === id && (
                                <tr>
                                  <td colSpan={4} style={{textAlign: "center"}}>{message}</td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        }
                      )
                    ) : (
                      <tr>
                        <td className="p-5 text-center" colSpan={7}>
                          No Users Found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </div>
        </>
      )}

      <Dialog open={showEvent} handler={() => handleShowEvent()}>
        <DialogHeader className="items-center justify-between">
          <div>Event Detail</div>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={() => handleShowEvent()}
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2 p-5 mt-5">
            <div className="flex flex-col gap-1">
              <Typography variant="h6">Event Name</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {event.event_name || "-"}
              </Typography>
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="h6">Event Color</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {event.event_color || "-"}
              </Typography>
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="h6">Event Date</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {event.event_date || "-"}
              </Typography>
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="h6">Recurring</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {event.recurring || "-"}
              </Typography>
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="h6">Repeat end date</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {event.repeat_end_date || "-"}
              </Typography>
            </div>
          </div>
        </DialogBody>
      </Dialog>

      <Dialog open={eventpopup} handler={() => handleUpdateEvent(0)}>
        <DialogHeader className="items-center justify-between">
          <div>{formTitle}</div>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={() => handleUpdateEvent(0)}
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
              name="event_name"
              label="Event Name"
              size="lg"
              color="blue"
              value={formFields.event_name}
              onChange={(event) => handleInputChange(event)}
              crossOrigin={undefined}
            />
            <Error error={formErrors.event_name} />
          </div>
          <br />
          <div className="flex flex-col gap-1">
            <Input
              type="date"
              name="event_date"
              label="Event date"
              size="lg"
              color="blue"
              value={formFields.event_date}
              onChange={(event) => handleInputChange(event)}
              crossOrigin={undefined}
            />
            <Error error={formErrors.event_date} />
          </div>
          <br />
          <div className="flex flex-col gap-1">
            <Input
              type="color"
              name="event_color"
              label="Event color"
              size="lg"
              color="blue"
              value={formFields.event_color}
              onChange={(event) => handleInputChange(event)}
              crossOrigin={undefined}
            />
            <Error error={formErrors.event_color} />
          </div>
          <br />
          <div className="flex flex-col gap-1">
            <Select
              label="Select Recurring"
              name="role_id"
              color="blue"
              size="lg"
              value={formFields.recurring}
              onChange={(value) => handleRecurringChange(value ?? "0")}
            >
              {recurring.map((rec) => (
                <Option key={rec} value={rec?.toString()}>
                  {rec}
                </Option>
              ))}
            </Select>
            <Error error={formErrors.recurring} />
          </div>
          <br />
          {viewrepeat &&
            <>
            <div className="flex flex-col gap-1">
              <Input
                type="date"
                name="repeat_end_date"
                label="Repeat end date"
                size="lg"
                color="blue"
                value={formFields.repeat_end_date}
                onChange={(event) => handleInputChange(event)}
                crossOrigin={undefined}
              />
              <Error error={formErrors.repeat_end_date} />
            </div>
            <br />
            </>
          }
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

export default Events
