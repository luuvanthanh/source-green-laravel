<?php

namespace GGPHP\Users\Repositories\Eloquent;

use GGPHP\Storage\Services\StorageService;
use GGPHP\Users\Jobs\SendEmail;
use GGPHP\Users\Models\User;
use GGPHP\Users\Presenters\UserPresenter;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;
use Spatie\Permission\Models\Role;

/**
 * Class UserRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class UserRepositoryEloquent extends BaseRepository implements UserRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
        'email' => 'like',
        'fullname' => 'like',
        'create_at',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return User::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return UserPresenter::class;
    }

    /**
     * Get user listing
     *
     * @param type $request
     */
    public function listing($request)
    {
        // Add scope filter
        $this->scopeQuery(function ($query) use ($request) {
            return $query->byFilter($request);
        });

        if (empty($request->limit)) {
            $users = $this->all();
        } else {
            $users = $this->paginate($request->limit);
        }

        return $users;
    }

    /**
     * Update role user
     * @param  array  $attributes attributes from request
     * @param  string  $id id from request
     * @return object
     */
    public function updateRoleUser(array $attributes, $id)
    {
        $user = $this->model()::find($id);

        if (!empty($attributes['roles'])) {
            $user->syncRoles($attributes['roles']);
        }

        return parent::find($id);
    }

    /**
     * Update permission user
     * @param  array  $attributes attributes from request
     * @param  string  $id id from request
     * @return object
     */
    public function updatePermissionUser(array $attributes, $id)
    {
        $user = $this->model()::find($id);

        if (!empty($attributes['permission_id'])) {
            $user->syncPermissions($attributes['permission_id']);
        }

        return parent::find($id);
    }

    /**
     * Create user
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function create(array $attributes)
    {
        $password = Str::random(8);
        $attributes['password'] = Hash::make($password);

        $user = User::create($attributes);

        if (!empty($attributes['avatar'])) {
            $user->addMediaFromDisk($attributes['avatar']['path'])->usingName($attributes['avatar']['file_name'])->preservingOriginal()->toMediaCollection('avatar');
        }

        if (!empty($attributes['role_id'])) {
            $user->assignRole($attributes['role_id']);
        }

        if (!empty($attributes['permission_id'])) {
            $user->assignPermissions($attributes['permission_id']);
        }

        // send mail
        $dataMail = [
            'email' => $user->email,
            'name' => $user->fullname,
            'password' => $password,
            'url_login' => env('LOGIN_URL', 'http://localhost:11005/login'),
        ];
        dispatch(new SendEmail($dataMail, 'NOTI_PASSWORD'));

        return parent::find($user->id);
    }

    /**
     * Update profile user
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function updateProfile(array $attributes, $id)
    {
        $user = $this->model()::findOrFail($id);

        if (!empty($attributes['password'])) {
            $attributes['password'] = Hash::make($attributes['password']);
        }

        $user->update($attributes);

        // Check if avatar null, remove avatar
        if (array_key_exists('avatar', $attributes)) {
            if (empty($attributes['avatar'])) {
                $media = $user->getAvatar();
                if ($media) {
                    $media->delete();
                    $user->clearMediaCollection('avatar');
                }
            } else {
                $path = StorageService::upload($attributes['avatar'], config('filesystems.pathToUpload'));
                $user->addMediaFromDisk($path['path'])->preservingOriginal()->toMediaCollection('avatar');
            }
        };

        if (!empty($attributes['role_id'])) {
            $user->syncRoles($attributes['role_id']);
        }

        if (!empty($attributes['permission_id'])) {
            $user->syncPermissions($attributes['permission_id']);
        }

        return $this->parserResult($user);
    }
}
