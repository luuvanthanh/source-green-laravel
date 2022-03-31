<?php

namespace GGPHP\Collection\Repositories\Eloquent;

use GGPHP\Camera\Models\Camera;
use GGPHP\Users\Models\User;
use GGPHP\Camera\Models\CameraCollection;
use GGPHP\Collection\Models\Collection;
use GGPHP\Collection\Presenters\CollectionPresenter;
use GGPHP\Collection\Repositories\Contracts\CollectionRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class CollectionRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CollectionRepositoryEloquent extends BaseRepository implements CollectionRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
        'name' => 'like',
        'description' => 'like',
        'location' => 'like',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Collection::class;
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
        return CollectionPresenter::class;
    }

    /**
     * Add camera to collection
     *
     * @param array $data
     * @param type $id
     * @return type
     */
    public function addOrDeleteCamera($data, $collectionIds)
    {
        if (!empty($data['items_delete'])) {
            $this->deleteCamera($data['items_delete'], $collectionIds);
        }
        if (!empty($data['items_new'])) {
            $this->addCamera($data['items_new'], $collectionIds);
        }
        return [];
    }

    /**
     * Add camera to collection
     *
     * @param type $items
     * @param type $collectionId
     */
    protected function addCamera($items, $collectionIds)
    {
        $itemsExist = Camera::whereIn('id', $items)
            ->select('id')
            ->pluck('id')
            ->toArray();

        if (!empty($itemsExist)) {
            foreach ($collectionIds as $collectionId) {
                $collection = Collection::find($collectionId);
                if (!empty($collection)) {
                    $collection->camera()->sync($itemsExist);
                }
            }
        }
    }

    /**
     * Delete camera by collection
     *
     * @param type $items
     * @param type $collectionId
     * @return type
     */
    protected function deleteCamera($items, $collectionIds)
    {
        return CameraCollection::whereIn('camera_id', $items)
            ->whereIn('collection_id', $collectionIds)
            ->delete();
    }

    /**
     * Get collection
     *
     * @param type $items
     * @param type $collectionId
     * @return type
     */
    public function getCollection(array $attributes)
    {
        // Filter by camera device name/number
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key']);
        }

        if (empty($attributes['limit'])) {
            $result = $this->all();
        } else {
            $result = $this->paginate($attributes['limit']);
        }

        return $result;
    }

    /**
     * Create collection
     *
     * @param type $items
     * @param type $collectionId
     * @return type
     */
    public function create(array $attributes)
    {

        \DB::beginTransaction();
        try {
            $collection = Collection::create($attributes);

            if (!empty($attributes['camera_id'])) {
                $collection->camera()->sync($attributes['camera_id']);
            }

            if (!empty($attributes['users'])) {
                $listUserId = [];
                $listdUserCollectionPermission = [];
                foreach ($attributes['users'] as  $itemUser) {
                    $listUserId[] = $itemUser['user_id'];
                    foreach ($itemUser['permisson_id'] as $itemPermission) {
                        $listdUserCollectionPermission[] = [
                            'permission_id' => $itemPermission,
                            'model_type' => User::class,
                            'model_id' => $itemUser['user_id'],
                            'collection_id' => $collection->id,
                        ];
                    }
                }
                $collection->user()->sync($listUserId);
                \DB::table('model_has_permissions')->insert($listdUserCollectionPermission);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw $th;
        }


        return parent::find($collection->id);
    }

    /**
     * Update collection
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function update(array $attributes, $id)
    {
        $collection = $this->model()::findOrFail($id);

        $collection->update($attributes);

        if (!empty($attributes['camera_id'])) {
            $collection->camera()->sync($attributes['camera_id']);
        }

        if (!empty($attributes['users'])) {
            $listUserId = [];
            $listdUserCollectionPermission = [];
            foreach ($attributes['users'] as  $itemUser) {
                $listUserId[] = $itemUser['user_id'];
                foreach ($itemUser['permisson_id'] as $itemPermission) {
                    $listdUserCollectionPermission[] = [
                        'permission_id' => $itemPermission,
                        'model_type' => User::class,
                        'model_id' => $itemUser['user_id'],
                        'collection_id' => $collection->id,
                    ];
                }
            }
            $collection->user()->sync($listUserId);
            \DB::table('model_has_permissions')->where('collection_id', $collection->id)->delete();
            \DB::table('model_has_permissions')->insert($listdUserCollectionPermission);
        }

        return $this->parserResult($collection);
    }

    /**
     * Delete camera
     *
     * @param type $id
     * @return type
     */
    public function delete($collection)
    {
        \DB::beginTransaction();
        try {
            if (!empty($collection->user)) {
                // Remove permission
                foreach ($collection->user as $key => $user) {
                    if (!empty($user->permissions)) {
                        $user->permissions()->where('collection_id', $collection->id)->detach();
                    }
                }

                // Remove user
                $collection->user()->detach();
            }

            // Remove collection
            if ($collection->delete()) {
                \DB::commit();

                return true;
            }
        } catch (\Exception $e) {
            \DB::rollback();
            \Log::error($e->getMessage());
        }

        return false;
    }
}
