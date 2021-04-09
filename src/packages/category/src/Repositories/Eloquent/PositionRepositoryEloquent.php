<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Position;
use GGPHP\Category\Presenters\PositionPresenter;
use GGPHP\Category\Repositories\Contracts\PositionRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class PositionRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class PositionRepositoryEloquent extends BaseRepository implements PositionRepository
{

    protected $fieldSearchable = [
        'id',
        'division.id',
        'name' => 'like',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Position::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return PositionPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function create(array $attributes)
    {
        $position = Position::create($attributes);

        if (!empty($attributes['season'])) {
            foreach ($attributes['season'] as $value) {
                $value['position_id'] = $position->id;
                $position->positionSeason()->create($value);
            }
        }

        if (!empty($attributes['permission'])) {
            $permission = explode(',', $attributes['permission']);
            $position->syncPermissions($permission);
        }

        return parent::find($position->id);
    }

    public function update(array $attributes, $id)
    {
        $position = Position::find($id);

        $position->update($attributes);
        if (!empty($attributes['season'])) {
            foreach ($attributes['season'] as $value) {
                $value['position_id'] = $position->id;
                $position->positionSeason()->updateOrCreate(
                    ['position_id' => $position->id, 'season_id' => $value['season_id']],
                    $value
                );
            }
        }

        if (!empty($attributes['permission'])) {
            $permission = explode(',', $attributes['permission']);
            $position->syncPermissions($permission);
        }

        return parent::find($id);
    }
}
