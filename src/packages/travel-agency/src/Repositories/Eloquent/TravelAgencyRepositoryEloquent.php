<?php

namespace GGPHP\TravelAgency\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
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

    public function getTravelAgency(array $attributes, $parse = true)
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

        if (!$parse) {
            return $this->model->get();
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


    public function exportExcel($attributes)
    {
        $travelAgencies = $this->getTravelAgency($attributes, false);

        $params = [];

        foreach ($travelAgencies as $key => $travelAgency) {
            $params['[number]'][] = ++$key;
            $params['[name]'][] = $travelAgency->name;
            $params['[service_type]'][] = $this->getConstServiceType($travelAgency->service_type);
            $params['[number_tour_guide]'][] = $travelAgency->travelAgencyAdditionalInformation()->count();
            $params['[address]'][] = $travelAgency->address;
            $params['[license_number]'][] = $travelAgency->license_number;
            $params['[license_date]'][] = !is_null($travelAgency->license_date) ?  Carbon::parse($travelAgency->license_date)->format('d-m-Y') : null;
        }

        return  resolve(ExcelExporterServices::class)->export('dvdl', $params);
    }

    public function getConstServiceType($value)
    {
        $value = null;
        switch ($value) {
            case TravelAgency::SERVICE_TYPE['AUTHORIZED_DEALER']:
                $value = 'Đại lý ủy quyền';
                break;
            case TravelAgency::SERVICE_TYPE['REPRESENTATIVE_OFFICE']:
                $value = 'Văn phòng đại diện';
                break;
            case TravelAgency::SERVICE_TYPE['INTERNATIONAL_TO_BRANCH']:
                $value = 'Chi nhánh lữ hành quốc tế';
                break;
            case TravelAgency::SERVICE_TYPE['INLAND_TO_BRANCH']:
                $value = 'Chi nhánh lữ hành nội địa';
                break;
            case TravelAgency::SERVICE_TYPE['INLAND_TO']:
                $value = 'Công ty lữ hành nội địa';
                break;
            case TravelAgency::SERVICE_TYPE['INTERNATIONAL_TO']:
                $value = 'Công ty lữ hành quốc tế';
                break;
        }

        return $value;
    }
}
