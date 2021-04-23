<?php

namespace GGPHP\BusinessCard\Repositories\Eloquent;

use GGPHP\BusinessCard\Models\BusinessCard;
use GGPHP\BusinessCard\Presenters\BusinessCardPresenter;
use GGPHP\BusinessCard\Repositories\Contracts\BusinessCardRepository;
use GGPHP\BusinessCard\Services\BusinessCardDetailServices;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class BusinessCardRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class BusinessCardRepositoryEloquent extends CoreRepositoryEloquent implements BusinessCardRepository
{
    protected $fieldSearchable = [
        'Id',
        'employee.FullName',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return BusinessCard::class;
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
        return BusinessCardPresenter::class;
    }

    public function filterBusinessCard(array $attributes)
    {

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['limit'])) {
            $businessCard = $this->paginate($attributes['limit']);
        } else {
            $businessCard = $this->get();
        }

        return $businessCard;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $businessCard = BusinessCard::create($attributes);

            BusinessCardDetailServices::add($businessCard->Id, $attributes['detail']);

            \DB::commit();
        } catch (\Exception $e) {
            dd($e);
            \DB::rollback();
        }

        return parent::find($businessCard->Id);
    }

    public function update(array $attributes, $id)
    {
        $businessCard = BusinessCard::findOrFail($id);

        $attributes['hours'] = json_encode($attributes['hours']);
        $businessCard->update($attributes);

        return parent::find($businessCard->Id);
    }

}
