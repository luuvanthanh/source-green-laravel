<?php

namespace GGPHP\Crm\AdmissionRegister\Repositories\Eloquent;

use GGPHP\Crm\AdmissionRegister\Models\AdmissionRegister;
use GGPHP\Crm\AdmissionRegister\Models\ParentInfo;
use GGPHP\Crm\AdmissionRegister\Presenters\AdmissionRegisterPresenter;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\AdmissionRegisterRepository;
use GGPHP\Crm\AdmissionRegister\Services\ParentInfoService;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AdmissionRegisterRepositoryEloquent extends BaseRepository implements AdmissionRegisterRepository
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
        return AdmissionRegister::class;
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
        return AdmissionRegisterPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereHas('studentInfo', function ($query) use ($attributes) {
                $query->whereLike('full_name', $attributes['key']);
            });
        }

        if (!empty($attributes['birth_date'])) {
            $this->model = $this->model->whereHas('studentInfo', function ($query) use ($attributes) {
                $query->where('birth_date', $attributes['birth_date']);
            });
        }

        if (!empty($attributes['parent_info_id'])) {
            $this->model = $this->model->whereHas('parentInfo', function ($query) use ($attributes) {
                $query->where('id', $attributes['parent_info_id']);
            });
        }

        if (!empty($attributes['date_register'])) {
            $this->model = $this->model->where('date_register', $attributes['date_register']);
        }

        if (!empty($attributes['status_admission_register_id'])) {
            $this->model = $this->model->whereHas('statusAdmissionRegister', function ($query) use ($attributes) {
                $query->where('id', $attributes['status_admission_register_id']);
            });
        }

        if (!empty($attributes['limit'])) {
            $admissionRegister = $this->paginate($attributes['limit']);
        } else {
            $admissionRegister = $this->get();
        }

        return $admissionRegister;
    }

    public function create(array $attributes)
    {
        $admissionRegister = AdmissionRegister::create($attributes);
        $customerLead = CustomerLead::where('id', $attributes['customer_lead_id'])->first();
        ParentInfoService::addParentInfo($admissionRegister->id, $customerLead);

        if (!empty($attributes['parent_info'])) {
            $admissionRegister->parentInfo()->create($attributes['parent_info']);
        }
        
        return $this->parserResult($admissionRegister);
    }
}
