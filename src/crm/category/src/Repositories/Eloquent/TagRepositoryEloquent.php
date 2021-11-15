<?php

namespace GGPHP\Crm\Category\Repositories\Eloquent;

use GGPHP\Crm\Category\Models\Tag;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Crm\Category\Presenters\TagPresenter;
use GGPHP\Crm\Category\Repositories\Contracts\TagRepository;

/**
 * Class StatusParentPotentialRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class TagRepositoryEloquent extends BaseRepository implements TagRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at',
    ];
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Tag::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function presenter()
    {
        return TagPresenter::class;
    }

    public function getAll($attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $tag = $this->paginate($attributes['limit']);
        } else {
            $tag = $this->get();
        }

        return $tag;
    }

    public function create(array $attributes)
    {
        if (!empty($attributes['create_rows'])) {
            foreach ($attributes['create_rows'] as $value) {
                Tag::create($value);
            }
        }

        if (!empty($attributes['update_rows'])) {
            foreach ($attributes['update_rows'] as $value) {
                $updateTag = Tag::find($value['tag_id']);
                $updateTag->update($value);
            }
        }

        if (!empty($attributes['delete_rows'])) {
            Tag::whereIn('id', $attributes['delete_rows'])->delete();
        }

        return parent::all();
    }
}
