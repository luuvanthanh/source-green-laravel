<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Block;
use GGPHP\Category\Models\BlockClassProject;
use GGPHP\Category\Models\BlockDetail;
use GGPHP\Category\Presenters\BlockPresenter;
use GGPHP\Category\Repositories\Contracts\BlockRepository;
use GGPHP\Clover\Models\ClassProject;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class BlockRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class BlockRepositoryEloquent extends CoreRepositoryEloquent implements BlockRepository
{
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Block::class;
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
        return BlockPresenter::class;
    }

    public function getBlock(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $degree = $this->paginate($attributes['limit']);
        } else {
            $degree = $this->get();
        }

        return $degree;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $a = Block::get();
            $block = Block::create($attributes);

            $this->created($attributes, $block->Id);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($block->Id);
    }

    public function created($data, $blockId)
    {
        $array = [];
        foreach ($data['module'] as $key => $value) {
            $array[] = $value['id'];
        }
        $classProjects = ClassProject::whereIn('ItemId', $array)->get()->toArray();

        foreach ($classProjects as $key => $value) {
            BlockClassProject::create([
                'BlockId' => $blockId,
                'ProjectId' => $value['Id']
            ]);
        }

        foreach ($data['classes'] as $key => $value) {
            BlockDetail::create([
                'BlockId' => $blockId,
                'Name' => $value['name']
            ]);
        }
    }
}
