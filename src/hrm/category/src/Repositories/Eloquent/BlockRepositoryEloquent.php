<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Block;
use GGPHP\Category\Models\BlockItem;
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
            $attributes = $this->creating($attributes);

            $block = Block::create($attributes);

            $this->createdOrUpdated($attributes, $block);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();

            throw new HttpException(500, $e->getMessage());
        }

        return parent::find($block->Id);
    }

    public function creating(array $attributes)
    {
        if (!empty($attributes['classes'])) {
            foreach ($attributes['classes'] as $key => $value) {
                $attributes['classes'][$key]['orderIndex'] = $key;
            }
        }

        $attributes['classes'] = json_encode($attributes['classes']);

        return $attributes;
    }

    public function createdOrUpdated($attributes, $block, $isUpdate = false)
    {
        if ($isUpdate) {
            
            $block->blockItem()->delete();
        }

        $data = [];
        if (!empty($attributes['programs'])) {
            $data[] = [
                'blockId' => $block->Id,
                'itemId' => $attributes['programs']['id'],
                'type' => 'PROGRAM',
                'parentId' => null
            ];

            if (!empty($attributes['programs']['modules'])) {
                foreach ($attributes['programs']['modules'] as $key => $module) {
                    $data[] = [
                        'blockId' => $block->Id,
                        'itemId' => $module['id'],
                        'type' => 'MODULE',
                        'parentId' => $attributes['programs']['id']
                    ];

                    if (!empty($module['projects'])) {
                        foreach ($module['projects'] as $key => $project) {
                            $data[] = [
                                'blockId' => $block->Id,
                                'itemId' => $project,
                                'type' => 'PROJECT',
                                'parentId' => $module['id']
                            ];
                        }
                    }
                }
            }
        }

        if (!empty($data)) {
            foreach ($data as $key => $value) {
                $value['orderIndex'] = $key;
                BlockItem::create($value);
            }
        }
    }

    public function update(array $attributes, $id)
    {
        \DB::beginTransaction();
        try {
            $block = Block::findOrFail($id);
            $isUpdate = true;
            $attributes = $this->updating($attributes);

            $block->update($attributes);

            $this->createdOrUpdated($attributes, $block, $isUpdate);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();

            throw new HttpException(500, $e->getMessage());
        }
        return parent::parserResult($block);
    }

    public function updating($attributes)
    {
        if (!empty($attributes['classes'])) {
            foreach ($attributes['classes'] as $key => $value) {
                $attributes['classes'][$key]['orderIndex'] = $key;
            }
        }

        $attributes['classes'] = json_encode($attributes['classes']);

        return $attributes;
    }
}
