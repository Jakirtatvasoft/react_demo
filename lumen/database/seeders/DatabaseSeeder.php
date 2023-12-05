<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\RolePermission;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Role::factory()->create([
            'role_name' => 'Super Admin',
            'is_active' => 'Active',
        ]);

        RolePermission::create([
            'role_id' => 1,
            'permissions' => [],
        ]);

        User::factory()->create([
            'role_id' => 1,
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'superadmin@gmail.com',
            'password' => 'superadmin',
            'country_code' => '+91',
            'mobile_number' => '8876887622',
            'date_of_birth' => '2023-8-12',
            'address' => 'abc, nr.xyz road, pqr - 123456',
            'gender' => 'Male',
            'hobbies' => 'Cricket,Dancing',
            'is_active' => 'Active',
        ]);
    }
}
