<?php

namespace GGPHP\Users\Models;

use GGPHP\Camera\Models\Camera;
use GGPHP\Category\Models\TouristDestination;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Notification\Models\Player;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Laravel\Passport\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Permission\Traits\HasPermissions;
use Spatie\Permission\Traits\HasRoles;

class User extends UuidModel implements AuthenticatableContract, AuthorizableContract, CanResetPasswordContract, HasMedia
{
    use Notifiable,
        HasApiTokens,
        HasRoles,
        HasPermissions,
        Authenticatable,
        Authorizable,
        CanResetPassword,
        MustVerifyEmail,
        InteractsWithMedia,
        SoftDeletes;

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')->singleFile();
    }

    const STATUS = [
        'ACTIVITY' => 0,
        'LOCK' => 1,
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'full_name', 'email', 'password', 'phone', 'status', 'is_first_login', 'unit_id',
        'is_all_tourist_destination', 'is_all_camera'
    ];

    protected $guard_name = 'api';
    protected $appends = ['rolesName'];

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateTimeFormat = 'c';

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'is_all_tourist_destination' => 'boolean',
        'is_all_camera' => 'boolean'
    ];

    /**
     * get roles user
     * @return array roles
     */
    public function getRoles()
    {
        return $this->roles()->orderBy('role_id')->pluck('name')->toArray();
    }

    public function getRolesNameAttribute()
    {
        return Arr::pluck($this->roles, 'name') ? implode(' - ', Arr::pluck($this->roles, 'name')) : [];
    }

    /**
     * Get collection of camera
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function collection()
    {
        return $this->belongsToMany(\GGPHP\Collection\Models\Collection::class, 'user_collection');
    }

    /**
     * Get avatar
     */
    public function getAvatar()
    {
        $avatar = $this->getMedia('avatar');

        return $avatar->isEmpty() ? null : $avatar->first();
    }

    /**
     * Get the video walls for the user
     */
    public function videoWalls()
    {
        return $this->hasMany(\GGPHP\VideoWall\Models\VideoWall::class);
    }

    /**
     * Define relations player
     */
    public function players()
    {
        return $this->hasMany(Player::class);
    }

    /**
     * Define relations player
     */
    public function touristDestination()
    {
        return $this->belongsToMany(TouristDestination::class, 'tourist_destination_user', 'user_id', 'tourist_destination_id');
    }

    /**
     * Define relations player
     */
    public function camera()
    {
        return $this->belongsToMany(Camera::class, 'camera_user', 'user_id', 'camera_id');
    }
}
