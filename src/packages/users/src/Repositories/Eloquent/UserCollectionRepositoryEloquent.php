<?php

namespace GGPHP\Users\Repositories\Eloquent;

use Carbon\Carbon;
use DB;
use GGPHP\Users\Models\UserCollection;
use GGPHP\Users\Presenters\UserCollectionPresenter;
use GGPHP\Users\Repositories\Contracts\UserCollectionRepository;
use GGPHP\Users\Models\User;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class UserCollectionRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class UserCollectionRepositoryEloquent extends BaseRepository implements UserCollectionRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
        'user_id',
        'collection_id',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return UserCollection::class;
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
        return UserCollectionPresenter::class;
    }

    /**
     * Collection assigned
     *
     * @param type $request
     * @return type
     */
    public function assigned(array $attributes, $userId)
    {
        $user = User::findOrFail($userId);

        $this->model = $this->model->where('user_id', $userId);

        if (empty($attributes['limit'])) {
            $result = $this->all();
        } else {
            $result = $this->paginate($attributes['limit']);
        }

        return $result;
    }

    /**
     * Assign or remove to collection
     *
     * @param array $data
     * @param type $id
     * @return type
     */
    public function assignOrRemoveUser(array $attributes)
    {
        $listUserId = [];

        foreach ($attributes['users'] as $user) {
            $listUserId[] = $user['user_id'];
        }

        $this->removeUser($listUserId, $attributes['collection_id']);

        if (!empty($attributes['users_delete'])) {
            $this->removeUser($attributes['users_delete'], $attributes['collection_id']);
        }

        $now = Carbon::now();

        foreach ($attributes['users'] as $item) {
            $dataUserCollections[] = [
                'user_id' => $item['user_id'],
                'collection_id' => $attributes['collection_id'],
                'created_at' => $now,
                'updated_at' => $now,
            ];
            foreach ($item['permission'] as $permissionId) {
                $datasUserPermission[] = [
                    'permission_id' => $permissionId,
                    'model_type' => User::class,
                    'model_id' => $item['user_id'],
                    'collection_id' => $attributes['collection_id'],
                ];
            }
        }

        \DB::table('user_collection')->insert($dataUserCollections);
        \DB::table('model_has_permissions')->insert($datasUserPermission);

        return [];
    }

    /**
     * Remove user by collection
     *
     * @param type $items
     * @param type $collectionId
     * @return type
     */
    public function removeUser($items, $collectionId)
    {
        UserCollection::whereIn('user_id', $items)
            ->where('collection_id', $collectionId)
            ->delete();

        \DB::table('model_has_permissions')->where('model_type', User::class)
            ->where('collection_id', $collectionId)
            ->whereIn('model_id', $items)
            ->delete();

        return true;
    }
}
