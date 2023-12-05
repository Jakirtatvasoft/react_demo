<?php

namespace App\Http\Controllers;

use App\Libraries\Utils\ResponseManager;
use App\Models\Role;
use App\Models\RolePermission;
use Illuminate\Http\Request;

class RolePermissionController extends Controller
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

    public function addRolesPermissions(Request $request) {
        if(isset($request->permissions)) {
            $permissions = $request->permissions;
            foreach($permissions as $permission) {
                $data = [
                    "permissions" => $permission['permissions']
                ];

                $rolePermissions[] = RolePermission::whereRoleId($permission['role_id'])->update($data);
            }

            if(count($rolePermissions) > 0){
                return response()->json(ResponseManager::getResponse('', 200, "Permission assign successfully.", true));
            }else{
                return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
            }
        }else{
            return response()->json(ResponseManager::getResponse('', 200, 'Please pass permissions for assign to roles.'));
        }
    }
}
