<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Laravel\Lumen\Auth\Authorizable;
use Laravel\Passport\HasApiTokens;

class User extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'role_id', 
        'first_name',
        'last_name',
        'email',
        'password',
        'country_code',
        'mobile_number',
        'date_of_birth',
        'address',
        'gender',
        'hobbies',
        'number_of_attempts',
        'is_active',
        'created_by'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
    protected $hidden = [
        'password',
    ];

    public static function boot() {
        parent::boot();

        static::retrieved(function ($user) {
            if($user->role){
                $user->role_name = $user->role->role_name;           
            }
        });

        static::creating(function ($user) {
            if($user->password) {
                $user->password = Hash::make($user->password);
            }
        });

        static::deleted(function ($user) {
            foreach($user->files as $file) {
                if (file_exists($file->path)) {
                    unlink($file->path);
                }
                $file->delete();
            }
        });
    }

    public function role() {
        return $this->belongsTo(Role::class, 'role_id', 'id');
    }

    public function files() {
        return $this->morphMany(File::class, 'fileable');
    }
}
