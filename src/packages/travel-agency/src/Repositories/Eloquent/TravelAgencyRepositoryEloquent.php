<?php

namespace GGPHP\TravelAgency\Repositories\Eloquent;

use GGPHP\TravelAgency\Models\TravelAgencieTourGuide;
use GGPHP\TravelAgency\Models\TravelAgency;
use GGPHP\TravelAgency\Presenters\TravelAgencyPresenter;
use GGPHP\TravelAgency\Repositories\Contracts\TravelAgencyRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class TravelAgencyRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TravelAgencyRepositoryEloquent extends BaseRepository implements TravelAgencyRepository
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
        return TravelAgency::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return TravelAgencyPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function getTravelAgency(array $attributes)
    {
        if (!empty($attributes['name'])) {
            $this->model = $this->model->whereLike('name', $attributes['name']);
        }

        if (!empty($attributes['license_number'])) {
            $this->model = $this->model->whereLike('license_number', $attributes['license_number']);
        }

        if (!empty($attributes['locality'])) {
            $this->model = $this->model->whereIn('locality', $attributes['locality']);
        }

        if (!empty($attributes['service_type'])) {
            $this->model = $this->model->whereIn('service_type', $attributes['service_type']);
        }

        if (empty($attributes['limit'])) {
            $travelAgency = $this->all();
        } else {
            $travelAgency = $this->paginate($attributes['limit']);
        }

        return $travelAgency;
    }

    public function addTourGuidesToTravelAgencie($attributes, $id)
    {
        foreach ($attributes['tour_guides'] as $value) {
            $value['travel_agency_id'] = $id;
            $value['date_of_entering_the_company'] = $attributes['date_of_entering_the_company'];
            TravelAgencieTourGuide::create($value);
        }

        return true;
    }

    public function deleteTourGuidesToTravelAgencie($id)
    {
        $travelAgencieTourGuide = TravelAgencieTourGuide::findOrFail($id);

        $travelAgencieTourGuide->delete();

        return true;
    }
}
