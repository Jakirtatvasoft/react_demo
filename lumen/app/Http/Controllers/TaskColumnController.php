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

class TaskColumnController extends Controller
{
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'column_name' => 'required',
        ]);
    
        if ($validator->fails()) {
            $data = ['errors' => $validator->errors()];
            return response()->json(ResponseManager::getResponse($data, 422));
        }

        try {
            DB::beginTransaction();
            $inputData = $request->all();
            $column = new TaskColumn($request->all());
            $column->save();

            if($column) {
                DB::commit();
                $data = ['column' => $column];
                return response()->json(ResponseManager::getResponse($data, 200, 'New task column added successfully.', true));
            }else{
                return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
            }
        }catch(Exception $e) {
            DB::rollBack();

            return response()->json(ResponseManager::getResponse('', 200, 'An error occurred, please try later.'));
        }
    }

    public function edit($columnId) {
        $column = TaskColumn::find($columnId);

        if(!$column) {
            return response()->json(ResponseManager::getResponse('', 200, 'Column not found.'));
        }

        if($column) {
            $data = ['column' => $column];
            return response()->json(ResponseManager::getResponse($data, 200, '', true));
        }

        return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
    }

    public function update($columnId, Request $request) {
        $validator = Validator::make($request->all(), [
            'column_name' => 'required',
        ]);
    
        if ($validator->fails()) {
            $data = ['errors' => $validator->errors()];
            return response()->json(ResponseManager::getResponse($data, 422));
        }

        $column = TaskColumn::find($columnId);
        if($column) {
            $column->update($request->all());
            $data = ['column' => $column];
            return response()->json(ResponseManager::getResponse($data, 200, 'Column updated successfully.', true));
        }else{
            return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
        }
    }

    public function destroy($columnId) {
        try {
            DB::beginTransaction();
            
            $column = TaskColumn::find($columnId);
    
            if(!$column) {
                return response()->json(ResponseManager::getResponse('', 200, 'Column not found.'));
            }
    
            if($column) {
                Task::where('column_id', $columnId)->delete();
                $column->delete();
                DB::commit();
                
                return response()->json(ResponseManager::getResponse('', 200, 'Column deleted successfully.', true));
            } else {
                DB::rollBack();

                return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
            }
        }catch(Exception $e) {
            DB::rollBack();

            return response()->json(ResponseManager::getResponse('', 200, 'An error occurred, please try later.'));
        }
    }
}
