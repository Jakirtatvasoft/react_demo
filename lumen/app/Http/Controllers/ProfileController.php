<?php

namespace App\Http\Controllers;

use App\Libraries\Utils\ResponseManager;
use App\Models\File;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function editProfile($userId, Request $request) {
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


                $userData = User::with(['files'])->find($userId);
                $data = ['user' => $userData];
                return response()->json(ResponseManager::getResponse($data, 200, 'Profile updated successfully.', true));
            }else{
                return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
            }
        } catch(Exception $e) {
            DB::rollBack();

            return response()->json(ResponseManager::getResponse('', 200, 'An error occurred, please try later.'));
        }
    }
}
