<?php

namespace GGPHP\VideoWall\Repositories\Eloquent;

use GGPHP\VideoWall\Models\VideoWall;
use GGPHP\VideoWall\Presenters\VideoWallPresenter;
use GGPHP\VideoWall\Repositories\Contracts\VideoWallRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class VideoWallRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class VideoWallRepositoryEloquent extends BaseRepository implements VideoWallRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
        'name' => 'like'
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return VideoWall::class;
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
        return VideoWallPresenter::class;
    }

    /**
     * Get video walls
     *
     * @param array $attributes
     */
    public function getVideoWalls(array $attributes)
    {
        if (empty($attributes['limit'])) {
            $result = $this->all();
        } else {
            $result = $this->paginate($attributes['limit']);
        }

        return $result;
    }

    /**
     * Update video wall
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function update(array $attributes, $videoWall)
    {
        $videoWall->update($attributes);

        // Remove cameras from video wall
        if (!empty($attributes['cameras_delete'])) {
            $videoWall->cameras()->detach($attributes['cameras_delete']);
        }

        // Add cameras to video wall
        if (isset($attributes['cameras']) && count($attributes['cameras']) == 0) {
            $videoWall->cameras()->detach();
        } elseif (!empty($attributes['cameras'])) {
            $cameras = $attributes['cameras'];
            $cameraArray = [];
            foreach ($cameras as $key => $camera) {
                if (!empty($camera['id'])) {
                    $cameraArray[$camera['id']] = !empty($camera['priority']) ? ['priority' => $camera['priority']] : [];
                }
            }

            if (!empty($cameraArray)) {
                $videoWall->cameras()->sync($cameraArray);
            }
        }

        return $this->parserResult($videoWall);
    }

    public function addCameraToVideoWall(array $attributes, $id)
    {
        $videoWall = VideoWall::findOrFail($id);

        if (!empty($attributes['camera_ids'])) {
            $videoWall->cameras()->detach();
            $videoWall->cameras()->sync($attributes['camera_ids']);
        }

        return $this->parserResult($videoWall);
    }
}
