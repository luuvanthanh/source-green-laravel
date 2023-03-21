<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Block;
use GGPHP\Category\Models\BlockDetail;
use GGPHP\Category\Presenters\BlockPresenter;
use GGPHP\Category\Repositories\Contracts\BlockRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

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
            $block = Block::create($attributes);

            $this->created($attributes, $block);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();

            throw new HttpException(500, $e->getMessage());
        }

        return parent::find($block->Id);
    }

    public function created($data, $block)
    {
        $block->classProject()->attach($data['projectId']);
        foreach ($data['classes'] as $key => $value) {
            $value['blockId'] = $block->Id;
            BlockDetail::create($value);
        }
    }

    public function update(array $attributes, $id)
    {
        $block = Block::findOrFail($id);

        \DB::beginTransaction();
        try {
            $block->update($attributes);

            $this->updated($attributes, $block);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();

            throw new HttpException(500, $e->getMessage());
        }
        return parent::parserResult($block);
    }

    public function updated($data, $block)
    {
        $block->classProject()->detach();
        $block->classProject()->attach($data['projectId']);
        $block->blockDetail()->delete();
        foreach ($data['classes'] as $key => $value) {
            $value['blockId'] = $block->Id;
            BlockDetail::create($value);
        }
    }
}
