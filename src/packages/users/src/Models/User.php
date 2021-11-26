<?php

namespace GGPHP\Users\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
        InteractsWithMedia;

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')->singleFile();
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'full_name', 'email', 'password', 'phone', 'status', 'is_first_login',
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
     * Get permission system
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function permissionSystem()
    {
        $permissions = new Collection();

        foreach ($this->roles as $role) {
            $permissions = $permissions->merge($role->permissions);
        }

        return $permissions->merge($this->permissions()->where('collection_id', 0)->get());
    }

    /**
     * Get the video walls for the user
     */
    public function videoWalls()
    {
        return $this->hasMany(\GGPHP\VideoWall\Models\VideoWall::class);
    }

    /**
     * A model may have multiple direct permissions.
     */
    public function permissions(): BelongsToMany
    {
        return $this->morphToMany(
            config('permission.models.permission'),
            'model',
            config('permission.table_names.model_has_permissions'),
            config('permission.column_names.model_morph_key'),
            'permission_id'
        )->withPivot('collection_id');
    }

    /**
     * A model may have multiple direct permissions with collection.
     */
    public function permissionsWithCollection($collectionId)
    {
        return $this->permissions()->where('collection_id', $collectionId)->get();
    }

    /**
     * Add scope filter user by request params
     *
     * @param type $query
     * @param type $request
     * @return type
     */
    public function scopeByFilter($query, $request)
    {
        // Filter by collection
        if ($request->has('collection_id')) {
            $collectionId = $request->collection_id;
            $query->whereHas('collection', function ($query) use ($collectionId) {
                return $query->where('collection_id', $collectionId);
            });
        }

        // Filter by role
        if ($request->has('role_id')) {
            $roleId = explode(',', $request->role_id);
            $query->whereHas('roles', function ($query) use ($roleId) {
                $query->whereIn('role_id', $roleId);
            });
        }

        return $query;
    }
}
