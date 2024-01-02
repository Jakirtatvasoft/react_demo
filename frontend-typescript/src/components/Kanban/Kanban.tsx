import { useState, useEffect, useCallback } from 'react';
import { Button } from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import AddEditColumn from './AddEditColumn';
import AddEditTask from './AddEditTask';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import taskService from '../../services/taskService';
import taskColumnService from '../../services/taskColumnService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Kanban = () => {
 const [showColumnPopup, setShowColumnPopup] = useState<boolean>(false);
 const [showTaskPopup, setShowTaskPopup] = useState<boolean>(false);
 const [columnNavigate, setColumnNavigate] = useState<boolean>(false);
 const [taskNavigate, setTaskNavigate] = useState<boolean>(false);
 const [columnid, setColumnid] = useState(0);
 const [taskid, setTaskid] = useState(0);
 const [board, setBoard] = useState({
  columns: {
    'column-1': {
      id: 'column-1',
      column_id: '1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2', 'task-3'],
    },
    'column-2': {
      id: 'column-2',
      column_id: '2',
      title: 'In Progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      column_id: '3',
      title: 'Done',
      taskIds: [],
    },
  },
  tasks: {
    'task-1': { id: 'task-1', task_id: '1', content: 'Task 1' },
    'task-2': { id: 'task-2', task_id: '2', content: 'Task 2' },
    'task-3': { id: 'task-3', task_id: '3', content: 'Task 3' },
  },
 });
 
 // Handle drag-and-drop functionality
 const onDragEnd = async (result: DropResult) => {
  const { destination, source, draggableId } = result;

  if (!destination) return; // If dropped outside of Droppable area

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return; // If dropped in the same place
  }

  const start = board.columns[source.droppableId];
  const finish = board.columns[destination.droppableId];

  if (start === finish) {
    const newTaskIds = Array.from(start.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...start,
      taskIds: newTaskIds,
    };
    
    const formData = new FormData();
    formData.append("reorder", newTaskIds.toString());
    formData.append("start", newColumn.id);
    formData.append("end", newColumn.id);
    var { data } = await taskService.getBoardReOrder(formData);
    if (data.flag) {
      getBoard();
    }
  } else {
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const formData = new FormData();
    formData.append("reorder", finishTaskIds.toString());
    formData.append("start", newStart.id);
    formData.append("end", newFinish.id);
    var { data } = await taskService.getBoardReOrder(formData);
    if (data.flag) {
      getBoard();
    }
  }
 };

 const getBoard = useCallback(async () => {
  try {
    const { data } = await taskService.getBoard();
    if (data.flag) {
      setBoard(data.data.board);
    }
  } catch (err) {
    console.log("error", err);
  }
}, []);

 useEffect(() => {
  getBoard();
}, [getBoard, columnNavigate, taskNavigate]);

const handleDeleteColumn = async (columnId: string | number) => {
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
    const { data } = await taskColumnService.deleteColumn(columnId);
    if (data.flag) {
      getBoard();
      toast.success(data.message);
    } else {
      toast.error(data.messsage);
    }
  } catch (err) {
    console.log("error", err);
  }
};

const handleDeleteTask = async (taskId: string | number) => {
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
    const { data } = await taskService.deleteTask(taskId);
    if (data.flag) {
      getBoard();
      toast.success(data.message);
    } else {
      toast.error(data.messsage);
    }
  } catch (err) {
    console.log("error", err);
  }
};

const editColumn = (columnId: any) => {
  setShowColumnPopup(true);
  setColumnid(columnId);
};

const editTask = (taskId: any) => {
  setShowTaskPopup(true);
  setTaskid(taskId);
};

 return (
    <>
      <div className="flex justify-end mt-3">
        <Link to="" onClick={() => editColumn(0)}>
          <Button className="flex items-center gap-1" color="blue" size="lg">
              Add Column
          </Button>
        </Link>
        <Link to="" onClick={() => editTask(0)}>
          <Button className="flex items-center gap-1" color="blue" size="lg">
              Add Task
          </Button>
        </Link>
      </div>
      <AddEditColumn columnpopup={showColumnPopup} setColumnPopup={setShowColumnPopup} columnnavigate={columnNavigate} setcolumnnavigate={setColumnNavigate} columnid={columnid} setColumnid={setColumnid} />
      <AddEditTask taskpopup={showTaskPopup} setTaskPopup={setShowTaskPopup} taskavigate={taskNavigate} settasknavigate={setTaskNavigate} taskid={taskid} setTaskid={setTaskid} />
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex' }}>
          {Object.values(board.columns).map((column) => (
            <div key={column.id} style={{ margin: 8 }}>
              <div>
                <h3 style={{fontWeight: 'bold', textAlign: 'center', background: '#f2f2f2', padding: 12, minHeight: 30,  display: 'flex'}}>
                  {column.title} 
                  <Link to="" onClick={() => editColumn(column.column_id ?? 0)} style={{paddingLeft: 5}}>
                    <PencilSquareIcon className="w-5 h-5 text-blue-700" />
                  </Link>
                  <Link to="" onClick={() => handleDeleteColumn(column.column_id ?? 0)} style={{paddingLeft: 5}}>
                    <TrashIcon className="w-5 h-5 text-blue-700" />
                  </Link>
                </h3>
              </div>
              <Droppable droppableId={column.id} key={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      background: '#f2f2f2',
                      padding: 8,
                      width: 300,
                      minHeight: 200,
                    }}
                  >
                    {column.taskIds.map((taskId, index) => {
                      const task = board.tasks[taskId];
                      return (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: 'none',
                                padding: 8,
                                margin: '0 0 8px 0',
                                backgroundColor: 'white',
                                display: 'flex',
                                ...provided.draggableProps.style,
                              }}
                            >
                              {task.content}
                              <Link to="" onClick={() => editTask(task.task_id ?? 0)} style={{paddingLeft: 5}}>
                                <PencilSquareIcon className="w-5 h-5 text-blue-700" />
                              </Link>
                              <Link to="" onClick={() => handleDeleteTask(task.task_id ?? 0)} style={{paddingLeft: 5}}>
                                <TrashIcon className="w-5 h-5 text-blue-700" />
                              </Link>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </>
 )
}

export default Kanban