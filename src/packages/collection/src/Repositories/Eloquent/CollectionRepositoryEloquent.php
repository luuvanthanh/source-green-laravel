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
        $attributes['created_by'] = "fe9880d9-8872-4c70-b299-cfb609118ef9";
        $collection = Collection::create($attributes);


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

        if (!empty($attributes['avatar'])) {
            $path = StorageService::upload($attributes['avatar'], config('filesystems.pathToUpload'));
            $collection->addMediaFromDisk($path['path'])->preservingOriginal()->toMediaCollection('avatar');
        }

        if (!empty($attributes['cameras'])) {
            $cameras = $attributes['cameras'];
            $cameraArray = [];
            foreach ($cameras as $key => $camera) {
                if (!empty($camera['id'])) {
                    $cameraArray[$camera['id']] = !empty($camera['priority']) ? ['priority' => $camera['priority']] : [];
                }
            }

            if (!empty($cameraArray)) {
                $collection->camera()->sync($cameraArray);
            }
        }

        if (!empty($attributes['users'])) {
            $users = $attributes['users'];
            $userId = [];
            foreach ($users as $key => $user) {
                if (!empty($user['id'])) {
                    $userModel = User::find($user['id']);
                    if ($userModel) {
                        $userPermission = [];
                        if (!empty($user['permission'])) {
                            foreach ($user['permission'] as $value) {
                                $userPermission[$value] = ['collection_id' => $collection->id];
                            }
                            if (!empty($userPermission)) {
                                $userModel->permissions()->wherePivot('collection_id', $collection->id)->sync($userPermission);
                                $userModel->load('permissions');
                            }
                        }
                        $userId[] = $user['id'];
                    }
                }
            }

            if (!empty($userId)) {
                $collection->user()->sync($userId);
            }
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

                //TODO: Push notification

                return true;
            }
        } catch (\Exception $e) {
            \DB::rollback();
            \Log::error($e->getMessage());
        }

        return false;
    }
}
