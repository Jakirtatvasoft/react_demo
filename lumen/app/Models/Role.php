<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'role_name',
        'is_active',
        'created_by'
    ];

    protected static function boot()
    {
        parent::boot();

        static::retrieved(function ($role) {
            $role->role_permissions = $role->permissions->permissions;
        });

        static::deleting(function ($role) {
            $role->permissions()->delete();
            $role->users()->delete();
        });
    }

    public function permissions() {
        return $this->hasOne(RolePermission::class, 'role_id', 'id');
    }

    public function users() {
        return $this->hasMany(User::class, 'role_id', 'id');
    }

    public function scopeActive($query) {
        return $query->where('is_active', 'Active');
    }
}
