<?php

namespace GGPHP\TourGuide\Repositories\Eloquent;

use GGPHP\TourGuide\Models\TourGuide;
use GGPHP\TourGuide\Models\TourGuideAdditionalInformation;
use GGPHP\TourGuide\Presenters\TourGuidePresenter;
use GGPHP\TourGuide\Repositories\Contracts\TourGuideRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class TourGuideRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TourGuideRepositoryEloquent extends BaseRepository implements TourGuideRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
        'name',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return TourGuide::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return TourGuidePresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function getTourGuide(array $attributes)
    {
        if (!empty($attributes['full_name'])) {
            $this->model = $this->model->whereLike('full_name', $attributes['full_name']);
        }

        if (!empty($attributes['id_card'])) {
            $this->model = $this->model->whereLike('id_card', $attributes['id_card']);
        }

        if (!empty($attributes['card_number'])) {
            $this->model = $this->model->whereLike('card_number', $attributes['card_number']);
        }

        if (!empty($attributes['nationality'])) {
            $this->model = $this->model->whereLike('nationality', $attributes['nationality']);
        }

        if (!empty($attributes['object_type_id'])) {
            $this->model = $this->model->where('object_type_id', $attributes['object_type_id']);
        }

        if (empty($attributes['limit'])) {
            $tourGuide = $this->all();
        } else {
            $tourGuide = $this->paginate($attributes['limit']);
        }
        return $tourGuide;
    }

    public function create(array $attributes)
    {
        $tourGuide = $this->model()::create($attributes);

        if (!empty($attributes['avatar'])) {
            $tourGuide->addMediaFromDisk($attributes['avatar']['path'])->usingName($attributes['avatar']['file_name'])->preservingOriginal()->toMediaCollection('avatar');
        }

        if (!empty($attributes['detail'])) {
            $attributes['detail']['tour_guide_id'] = $tourGuide->id;
            $tourGuideAdditionalInformation = TourGuideAdditionalInformation::create($attributes['detail']);

            if (!empty($attributes['files'])) {
                $tourGuideAdditionalInformation->addMediaToEntity($tourGuideAdditionalInformation, $attributes['images'], 'files');
            }
        }

        return parent::find($tourGuide->id);
    }

    public function update(array $attributes, $id)
    {
        $tourGuide = $this->model()::findOrFail($id);

        $tourGuide->update($attributes);

        if (!empty($attributes['avatar'])) {
            $tourGuide->addMediaFromDisk($attributes['avatar']['path'])->usingName($attributes['avatar']['file_name'])->preservingOriginal()->toMediaCollection('avatar');
        }

        if (!empty($attributes['detail'])) {
            $tourGuide->tourGuideAdditionalInformation()->delete();
            $attributes['detail']['tour_guide_id'] = $tourGuide->id;
            $tourGuideAdditionalInformation = TourGuideAdditionalInformation::create($attributes['detail']);

            if (!empty($attributes['files'])) {
                $tourGuideAdditionalInformation->addMediaToEntity($tourGuideAdditionalInformation, $attributes['images'], 'files');
            }
        }

        return parent::find($id);
    }
}
