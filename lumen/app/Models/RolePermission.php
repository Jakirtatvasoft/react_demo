<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RolePermission extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'role_id', 
        'permissions',
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($rolePermission) {
            $rolePermission->permissions = json_encode($rolePermission->permissions);
        });

        static::retrieved(function ($rolePermission) {
            $rolePermission->permissions = json_decode($rolePermission->permissions);
        });
    }
}
