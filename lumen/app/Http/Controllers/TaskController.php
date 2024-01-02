<?php

namespace App\Http\Controllers;

use App\Libraries\Utils\ResponseManager;
use App\Models\Task;
use App\Models\TaskColumn;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class TaskController extends Controller
{
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'column_id' => 'required',
            'title' => 'required',
            'due_date' => 'required',
            'status' => 'required',
        ]);
    
        if ($validator->fails()) {
            $data = ['errors' => $validator->errors()];
            return response()->json(ResponseManager::getResponse($data, 422));
        }

        try {
            DB::beginTransaction();
            $inputData = $request->all();
            $task = new Task($request->all());
            $task->save();

            if($task) {
                DB::commit();
                $data = ['task' => $task];
                return response()->json(ResponseManager::getResponse($data, 200, 'New task added successfully.', true));
            }else{
                return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
            }
        }catch(Exception $e) {
            DB::rollBack();

            return response()->json(ResponseManager::getResponse('', 200, 'An error occurred, please try later.'));
        }
    }

    public function edit($taskId) {
        $task = Task::find($taskId);

        if(!$task) {
            return response()->json(ResponseManager::getResponse('', 200, 'Task not found.'));
        }

        if($task) {
            $data = ['task' => $task];
            return response()->json(ResponseManager::getResponse($data, 200, '', true));
        }

        return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
    }

    public function update($taskId, Request $request) {
        $validator = Validator::make($request->all(), [
            'column_id' => 'required',
            'title' => 'required',
            'due_date' => 'required',
            'status' => 'required',
        ]);
    
        if ($validator->fails()) {
            $data = ['errors' => $validator->errors()];
            return response()->json(ResponseManager::getResponse($data, 422));
        }

        $task = Task::find($taskId);
        if($task) {
            $task->update($request->all());
            $data = ['task' => $task];
            return response()->json(ResponseManager::getResponse($data, 200, 'Task updated successfully.', true));
        }else{
            return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
        }
    }

    public function getColumns() {
        $columns = TaskColumn::get();

        if($columns) {
            $data = ['columns' => $columns];
            return response()->json(ResponseManager::getResponse($data, 200, '', true));
        }else{
            return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
        }
    }

    public function board() {
        $columns = TaskColumn::get()->toArray();
        $finalData = array();
        foreach ($columns as $key => $value) {
            $finalData['columns']['column-'.$value['id']]['id'] = 'column-'.$value['id'];
            $finalData['columns']['column-'.$value['id']]['column_id'] = $value['id'];
            $finalData['columns']['column-'.$value['id']]['title'] = $value['column_name'];
            $tasks = Task::where('column_id', $value['id'])->orderBy('order', 'ASC')->get()->toArray();
            $finalTasks = array();
            foreach ($tasks as $t_key => $t_value) {
                array_push($finalTasks, 'task-'.$t_value['id']);
            }
            $finalData['columns']['column-'.$value['id']]['taskIds'] = $finalTasks;
        }
        $tasks = Task::get()->toArray();
        foreach ($tasks as $key => $value) {
            $finalData['tasks']['task-'.$value['id']]['id'] = 'task-'.$value['id'];
            $finalData['tasks']['task-'.$value['id']]['task_id'] = $value['id'];
            $finalData['tasks']['task-'.$value['id']]['content'] = $value['title'];
        }

        if($columns) {
            $data = ['board' => $finalData];
            return response()->json(ResponseManager::getResponse($data, 200, '', true));
        }else{
            return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
        }
    }

    public function destroy($taskId) {
        try {
            DB::beginTransaction();
            
            $task = Task::find($taskId);
    
            if(!$task) {
                return response()->json(ResponseManager::getResponse('', 200, 'Task not found.'));
            }
    
            if($task->delete()) {
                DB::commit();
                
                return response()->json(ResponseManager::getResponse('', 200, 'Task deleted successfully.', true));
            } else {
                DB::rollBack();

                return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
            }
        }catch(Exception $e) {
            DB::rollBack();

            return response()->json(ResponseManager::getResponse('', 200, 'An error occurred, please try later.'));
        }
    }

    public function reorder(Request $request) {
        try {
            $inputData = $request->all();
            $taskOrder = isset($inputData['reorder']) ? str_replace("task-", "", $inputData['reorder']) : "";
            $start = isset($inputData['start']) ? str_replace("column-", "", $inputData['start']) : "";
            $end = isset($inputData['end']) ? str_replace("column-", "", $inputData['end']) : "";

            if(!empty($taskOrder) && !empty($start) && !empty($end)) {
                $taskOrder = explode(',', $taskOrder);
                foreach ($taskOrder as $key => $value) {
                    $task = Task::find($value);
                    $task->column_id = $end;
                    $task->order = $key+1;
                    $task->save();
                }
                return response()->json(ResponseManager::getResponse('', 200, 'Board has been updated.', true));
            } else {
                return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
            }
        } catch(Exception $e) {
            DB::rollBack();
            return response()->json(ResponseManager::getResponse('', 200, 'An error occurred, please try later.'));
        }
    }
}
