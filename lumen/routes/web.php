<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

// $router->get('/', function () use ($router) {
//     return $router->app->version();
// });

// for cors origin issue
$router->options('{all:.*}', function () {
    return;
});

$router->group(['prefix' => 'api'], function ()  use ($router) {
    $router->post('login', 'AuthController@login');

    $router->group(['middleware' => ['auth']], function ()  use ($router) {
        $router->post('logout', 'AuthController@logout');

        $router->get('dashboard', 'DashboardController@index');
        
        $router->get('roles', 'RoleController@index');
        $router->post('roles', 'RoleController@store');
        $router->get('roles/{roleId}', 'RoleController@edit');
        $router->post('roles/{roleId}', 'RoleController@update');
        $router->post('roles/change-status/{roleId}', 'RoleController@changeStatus');
        $router->delete('roles/{roleId}', 'RoleController@destroy');

        $router->get('role-permission', 'RolePermissionController@index');
        $router->post('role-permission', 'RolePermissionController@addRolesPermissions');

        $router->get('users', 'UserController@index');
        $router->get('users/get-roles', 'UserController@getRoles');
        $router->post('users', 'UserController@store');
        $router->get('users/{userId}', 'UserController@edit');
        $router->post('users/{userId}', 'UserController@update');
        $router->get('users/show/{userId}', 'UserController@show');
        $router->post('users/change-status/{userId}', 'UserController@changeStatus');
        $router->delete('users/{userId}', 'UserController@destroy');

        $router->post('edit-profile/{userId}', 'ProfileController@editProfile');

        $router->get('events', 'EventController@index');
        $router->post('events', 'EventController@store');
        $router->get('events/{eventId}', 'EventController@edit');
        $router->post('events/{eventId}', 'EventController@update');
        $router->delete('events/{eventId}', 'EventController@destroy');
        $router->get('events/calender/events', 'EventController@calenderEvents');

        $router->post('task_columns', 'TaskColumnController@store');
        $router->delete('task_columns/{columnId}', 'TaskColumnController@destroy');
        $router->get('task_columns/{columnId}', 'TaskColumnController@edit');
        $router->post('task_columns/{columnId}', 'TaskColumnController@update');

        $router->post('tasks', 'TaskController@store');
        $router->get('tasks/get-columns', 'TaskController@getColumns');
        $router->get('tasks/board', 'TaskController@board');
        $router->delete('tasks/{taskId}', 'TaskController@destroy');
        $router->post('tasks/reorder', 'TaskController@reorder');
        $router->get('tasks/{taskId}', 'TaskController@edit');
        $router->post('tasks/{taskId}', 'TaskController@update');
    });
});
