<?php

namespace GGPHP\Users\Repositories\Eloquent;

use GGPHP\Notification\Models\Player;
use GGPHP\RolePermission\Models\Role;
use GGPHP\Users\Jobs\SendEmail;
use GGPHP\Users\Models\User;
use GGPHP\Users\Presenters\UserPresenter;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

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
    public function listing($attributes)
    {

        // Filter by key
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('full_name', $attributes['key']);
                $query->orWhereLike('email', $attributes['key']);
            });
        }

        // Filter by status
        if (!empty($attributes['status'])) {
            $this->model = $this->model->whereIn('status', $attributes['status']);
        }

        // Filter by collection
        if (!empty($attributes['collection_id'])) {
            $collectionId = $attributes['collection_id'];
            $this->model = $this->model->whereHas('collection', function ($query) use ($collectionId) {
                return $query->where('collection_id', $collectionId);
            });
        }

        // Filter by role
        if (!empty($attributes['role_id'])) {
            $roleId = explode(',', $attributes['role_id']);
            $this->model = $this->model->whereHas('roles', function ($query) use ($roleId) {
                $query->whereIn('role_id', $roleId);
            });
        }

        if (empty($attributes['limit'])) {
            $users = $this->all();
        } else {
            $users = $this->paginate($attributes['limit']);
        }

        return $users;
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
            $user->roles()->sync($attributes['role_id']);
        }

        if (!empty($attributes['permission_id'])) {
            $data = [];
            foreach ($attributes['permission_id'] as  $permission) {
                $data[] = [
                    'permission_id' => $permission,
                    'model_type' => User::class,
                    'model_id' => $user->id,
                    'collection_id' => '00000000-0000-0000-0000-000000000000',
                ];
            }
            \DB::table('model_has_permissions')->insert($data);
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
    public function update(array $attributes, $id)
    {
        $user = $this->model()::findOrFail($id);

        if (!empty($attributes['password'])) {
            $attributes['password'] = Hash::make($attributes['password']);
        }

        $user->update($attributes);

        // Check if avatar null, remove avatar
        if (!empty($attributes['avatar'])) {
            $user->addMediaFromDisk($attributes['avatar']['path'])->usingName($attributes['avatar']['file_name'])->preservingOriginal()->toMediaCollection('avatar');
        }

        if (!empty($attributes['role_id'])) {
            $user->roles()->detach();
            $user->roles()->sync($attributes['role_id']);
        }

        if (!empty($attributes['permission_id'])) {
            $data = [];
            foreach ($attributes['permission_id'] as  $permission) {
                $data[] = [
                    'permission_id' => $permission,
                    'model_type' => User::class,
                    'model_id' => $id,
                    'collection_id' => '00000000-0000-0000-0000-000000000000',
                ];
            }
            \DB::table('model_has_permissions')
                ->where('model_id', $id)
                ->where('model_type', User::class)
                ->where('collection_id', '00000000-0000-0000-0000-000000000000')->delete();
            \DB::table('model_has_permissions')->insert($data);
        }

        return $this->parserResult($user);
    }

    public function lockUser(array $attributes, $id)
    {
        $user = $this->model()::findOrFail($id);

        $user->update($attributes);

        return $this->parserResult($user);
    }

    /**
     * Add player to user
     * @param $player_id
     * @param $user_id
     */
    public static function addPlayer($player_id, $user_id)
    {
        $player = Player::where('player_id', $player_id)
            ->where('user_id', $user_id)
            ->get();

        if ($player->isEmpty()) {
            Player::create(['player_id' => $player_id, 'user_id' => $user_id]);
        }
    }

    /**
     * Delete player
     * @param $player_id
     * @param $user_id
     */
    public function deletePlayer($player_id, $user_id)
    {
        Player::where('player_id', $player_id)
            ->where('user_id', $user_id)
            ->delete();
    }

    /**
     * Add Player user
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function addPlayerUser(array $attributes, $id)
    {
        $player = Player::where('player_id', $attributes['player_id'])
            ->where('user_id', $id)
            ->first();

        if (is_null($player)) {
            Player::create(['player_id' => $attributes['player_id'], 'user_id' => $id]);
        }

        $user = $this->find($id);

        return $user;
    }
}
