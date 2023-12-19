<?php

namespace App\Http\Controllers;

use App\Libraries\Utils\ResponseManager;
use App\Models\File;
use App\Models\Role;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index() {
        $users = User::get();
        
        if($users) {
            $data = ['users' => $users];
            return response()->json(ResponseManager::getResponse($data, 200, '', true));
        }else{
            return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
        }
    }
    public function getRoles() {
        $roles = Role::active()->get();

        if($roles) {
            $data = ['roles' => $roles];
            return response()->json(ResponseManager::getResponse($data, 200, '', true));
        }else{
            return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
        }
    }

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            "role_id" => "required",
            "first_name" => "required",
            "last_name" => "required",
            "email" => "required|email|unique:users",
            "password" => "required|min:8",
            "mobile_number" => "required|numeric",
            "date_of_birth" => "required",
            "address" => "required",
            "gender" => "required",
            "hobbies" => "required"
        ]);
    
        if ($validator->fails()) {
            $data = ['errors' => $validator->errors()];
            return response()->json(ResponseManager::getResponse($data, 422));
        }

        try {
            DB::beginTransaction();

            $inputData = $request->all();
            $inputData['created_by'] = Auth::user()->id;
            $inputData['hobbies'] = implode(",", $inputData['hobbies']);
            $user = User::create($inputData);

            if($user) {
                if($request->hasFile('image')){
                    $image = $request->file('image');
                    $fileName = time() . "-userimg." . $image->getClientOriginalExtension();
                    $image->move('images/user', $fileName);
                    
                    $imagePath = 'images/user/' . $fileName;
                    $path = new File(['type' => 'image', 'path' => $imagePath]);

                    $user->files()->save($path);
                }

                if($request->hasFile('files')){
                    $files = $request->file('files');
                    foreach($files as $key => $file) {
                        $fileName = time() . $key . "user-file." . $file->getClientOriginalExtension();
                        $file->move('files/user', $fileName);
                        
                        $filePath = 'files/user/' . $fileName;
                        $path = new File(['type' => 'file', 'path' => $filePath]);
                        
                        $user->files()->save($path);
                    }
                }

                DB::commit();

                $data = ['user' => $user];
                return response()->json(ResponseManager::getResponse($data, 200, 'User added successfully.', true));
            }else{
                return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
            }
        } catch(Exception $e) {
            DB::rollBack();

            return response()->json(ResponseManager::getResponse('', 200, 'An error occurred, please try later.'));
        }
    }

    public function show($userId) {
        $user = User::with(['files'])->find($userId);

        if(!$user) {
            return response()->json(ResponseManager::getResponse('', 200, 'User not found.'));
        }

        if($user) {
            $data = ['user' => $user];
            return response()->json(ResponseManager::getResponse($data, 200, '', true));
        }

        return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
    }

    public function edit($userId) {
        $user = User::find($userId);

        if(!$user) {
            return response()->json(ResponseManager::getResponse('', 200, 'User not found.'));
        }

        if($user) {
            $data = ['user' => $user];
            return response()->json(ResponseManager::getResponse($data, 200, '', true));
        }

        return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
    }

    public function update($userId, Request $request) {
        $validator = Validator::make($request->all(), [
            "role_id" => "required",
            "first_name" => "required",
            "last_name" => "required",
            "email" => [
                'required',
                'email',
                Rule::unique('users')->ignore($userId)
            ],
            "password" => "nullable|min:8",
            "mobile_number" => "required|numeric",
            "date_of_birth" => "required",
            "address" => "required",
            "gender" => "required",
            "hobbies" => "required"
        ]);
    
        if ($validator->fails()) {
            $data = ['errors' => $validator->errors()];
            return response()->json(ResponseManager::getResponse($data, 422));
        }
        
        $user = User::find($userId);

        if(!$user) {
            return response()->json(ResponseManager::getResponse('', 200, 'User not found.'));
        }

        try {
            DB::beginTransaction();
            unset($user->role_name);

            $inputData = $request->except('password');
            
            if(!empty($request->password)) {
                $inputData['password'] = Hash::make($request->password);
            }

            if($user->update($inputData)) {
                if($request->hasFile('image')){
                    foreach($user->files as $file) {
                        if($file->type == 'image') {
                            if (file_exists($file->path)) {
                                unlink($file->path);
                            }
                            $file->delete();
                        }
                    }

                    $image = $request->file('image');
                    $fileName = time() . "-userimg." . $image->getClientOriginalExtension();
                    $image->move('images/user', $fileName);
                    
                    $imagePath = 'images/user/' . $fileName;
                    $path = new File(['type' => 'image', 'path' => $imagePath]);

                    $user->files()->save($path);
                }

                if($request->hasFile('files')){
                    foreach($user->files as $file) {
                        if($file->type == 'file') {
                            if (file_exists($file->path)) {
                                unlink($file->path);
                            }
                            $file->delete();
                        }
                    }

                    $files = $request->file('files');
                    foreach($files as $key => $file) {
                        $fileName = time() . $key . "user-file." . $file->getClientOriginalExtension();
                        $file->move('files/user', $fileName);
                        
                        $filePath = 'files/user/' . $fileName;
                        $path = new File(['type' => 'file', 'path' => $filePath]);
                        
                        $user->files()->save($path);
                    }
                }

                DB::commit();

                $data = ['user' => $user];
                return response()->json(ResponseManager::getResponse($data, 200, 'User updated successfully.', true));
            }else{
                return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
            }
        } catch(Exception $e) {
            DB::rollBack();

            return response()->json(ResponseManager::getResponse('', 200, 'An error occurred, please try later.'));
        }
    }

    public function changeStatus($userId, Request $request) {
        $user = User::find($userId);
        unset($user->role_name);
        if(!$user) {
            return response()->json(ResponseManager::getResponse('', 200, 'User not found.'));
        }

        if($request->status) {
            if($request->status == "Active") {
                $user->number_of_attempts = 0;
            }
            $user->is_active = $request->status;
            
            if($user->save()) {
                $data = ['user' => $user];
                return response()->json(ResponseManager::getResponse($data, 200, 'User status successfully changed to "'.$request->status.'".', true));
            }else{
                return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
            }
        }else{
            return response()->json(ResponseManager::getResponse('', 200, 'Please pass status to update user status.'));
        }
    }

    public function destroy($userId) {
        $user = User::find($userId);

        if(!$user) {
            return response()->json(ResponseManager::getResponse('', 200, 'User not found.'));
        }

        if($user->delete()) {
            return response()->json(ResponseManager::getResponse('', 200, 'User deleted successfully.', true));
        } else {
            return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
        }
    }
}
