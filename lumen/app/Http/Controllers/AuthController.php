<?php

namespace App\Http\Controllers;

use App\Libraries\Utils\ResponseManager;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);
    
        if ($validator->fails()) {
            $data = ['errors' => $validator->errors()];
            return response()->json(ResponseManager::getResponse($data, 422));
        }

        $user = User::with(['files'])->where('email', $request->email)->first();

        if($user && $user->is_active == "In Active") {
            $data = ['errors' => [
                "email" => ["Can't login, your account is inactive."]
            ]];
            return response()->json(ResponseManager::getResponse($data, 422));
        }

        if(!$user || !Hash::check($request->password, $user->password)){
            if($user) {
                unset($user->password);
                unset($user->role_name);
                $user->number_of_attempts += 1;
                
                if($user->number_of_attempts == 5) {
                    $user->is_active = "In Active";
                }

                $user->save();
            }

            $data = ['errors' => [
                    "email" => ['The provided credentials are incorrect.']
                ]];
            return response()->json(ResponseManager::getResponse($data, 422));
        }

        $token = $user->createToken('auth_token')->accessToken;

        $data = [
                'token' => $token,
                'user' => $user
        ];
        return response()->json(ResponseManager::getResponse($data, 200, 'Loggedin successfully.', true));
    }

    public function logout(Request $request) {
        $request->user()->token()->revoke();

        return response()->json(ResponseManager::getResponse('', 200, 'Logged out successfully.', true));
    }
}
