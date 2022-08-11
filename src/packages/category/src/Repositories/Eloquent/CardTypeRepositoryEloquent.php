<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\CardType;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Category\Presenters\CardTypePresenter;
use GGPHP\Category\Repositories\Contracts\CardTypeRepository;

/**
 * Class CardTypeRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class CardTypeRepositoryEloquent extends BaseRepository implements CardTypeRepository
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
        return CardType::class;
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
        return CardTypePresenter::class;
    }

    public function getCardType(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where('name', 'like', '%' . $attributes['key'] . '%')->orWhere('code', 'like', '%' . $attributes['key'] . '%');
        }

        if (!empty($attributes['limit'])) {
            $cardType = $this->paginate($attributes['limit']);
        } else {
            $cardType = $this->get();
        }

        return $cardType;
    }

    public function create(array $attributes)
    {
        $cardType = CardType::create($attributes);

        if (!empty($attributes['previous_file'])) {
            $cardType->addMediaFromDisk($attributes['previous_file']['path'])->usingName($attributes['previous_file']['file_name'])->preservingOriginal()->toMediaCollection('previous_file');
        }

        if (!empty($attributes['after_file'])) {
            $cardType->addMediaFromDisk($attributes['after_file']['path'])->usingName($attributes['after_file']['file_name'])->preservingOriginal()->toMediaCollection('after_file');
        }

        return parent::find($cardType->id);
    }

    public function update(array $attributes, $id)
    {
        $cardType = CardType::findOrFail($id);

        $cardType->update($attributes);

        if (!empty($attributes['previous_file'])) {
            $cardType->addMediaFromDisk($attributes['previous_file']['path'])->usingName($attributes['previous_file']['file_name'])->preservingOriginal()->toMediaCollection('previous_file');
        }

        if (!empty($attributes['after_file'])) {
            $cardType->addMediaFromDisk($attributes['after_file']['path'])->usingName($attributes['after_file']['file_name'])->preservingOriginal()->toMediaCollection('after_file');
        }

        return parent::find($id);
    }
}
