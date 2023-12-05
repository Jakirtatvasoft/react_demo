<?php

namespace App\Http\Controllers;

use App\Libraries\Utils\ResponseManager;
use App\Models\Role;
use App\Models\RolePermission;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class RoleController extends Controller
{
    public function index() {
        $roles = Role::get();
        
        if($roles) {
            $data = ['roles' => $roles];
            return response()->json(ResponseManager::getResponse($data, 200, '', true));
        }else{
            return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
        }
    }

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'role_name' => 'required|unique:roles'
        ]);
    
        if ($validator->fails()) {
            $data = ['errors' => $validator->errors()];
            return response()->json(ResponseManager::getResponse($data, 422));
        }

        try {
            DB::beginTransaction();
            $inputData = $request->all();
            $inputData['created_by'] = Auth::user()->id;
            $role = Role::create($inputData);

            if($role) {
                RolePermission::create([
                    'role_id' => $role->id,
                    'permissions' => [],
                ]);

                DB::commit();

                $data = ['role' => $role];
                return response()->json(ResponseManager::getResponse($data, 200, 'New role added successfully.', true));
            }else{
                return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
            }
        }catch(Exception $e) {
            DB::rollBack();

            return response()->json(ResponseManager::getResponse('', 200, 'An error occurred, please try later.'));
        }
    }

    public function edit($roleId) {
        $role = Role::find($roleId);

        if(!$role) {
            return response()->json(ResponseManager::getResponse('', 200, 'Role not found.'));
        }

        if($role) {
            $data = ['role' => $role];
            return response()->json(ResponseManager::getResponse($data, 200, '', true));
        }

        return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
    }

    public function update($roleId, Request $request) {
        $validator = Validator::make($request->all(), [
            'role_name' => [
                'required',
                Rule::unique('roles')->ignore($roleId)    
            ]
        ]);
    
        if ($validator->fails()) {
            $data = ['errors' => $validator->errors()];
            return response()->json(ResponseManager::getResponse($data, 422));
        }

        $role = Role::find($roleId);
        unset($role->role_permissions);
        if($role->update($request->all())) {
            $data = ['role' => $role];
            return response()->json(ResponseManager::getResponse($data, 200, 'Role updated successfully.', true));
        }else{
            return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
        }
    }

    public function changeStatus($roleId, Request $request) {
        $role = Role::find($roleId);
        unset($role->role_permissions);
        if(!$role) {
            return response()->json(ResponseManager::getResponse('', 200, 'Role not found.'));
        }

        if($request->status) {
            $role->is_active = $request->status;
            
            if($role->save()) {
                $data = ['role' => $role];
                return response()->json(ResponseManager::getResponse($data, 200, 'Role status successfully changed to "'.$request->status.'".', true));
            }else{
                return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
            }
        }else{
            return response()->json(ResponseManager::getResponse('', 200, 'Please pass status to update role status.'));
        }
    }

    public function destroy($roleId) {
        try {
            DB::beginTransaction();
            
            $role = Role::find($roleId);
    
            if(!$role) {
                return response()->json(ResponseManager::getResponse('', 200, 'Role not found.'));
            }
    
            if($role->delete()) {
                DB::commit();
                
                return response()->json(ResponseManager::getResponse('', 200, 'Role deleted successfully.', true));
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
