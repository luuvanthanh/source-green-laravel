<?php

namespace GGPHP\Crm\AdmissionRegister\Repositories\Eloquent;

use GGPHP\Crm\AdmissionRegister\Models\AdmissionRegister;
use GGPHP\Crm\AdmissionRegister\Models\ConfirmTransporter;
use GGPHP\Crm\AdmissionRegister\Presenters\AdmissionRegisterPresenter;
use GGPHP\Crm\AdmissionRegister\Presenters\ConfirmTransporterPresenter;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\ConfirmTransporterRepository;
use GGPHP\Crm\AdmissionRegister\Services\ParentInfoService;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ConfirmTransporterRepositoryEloquent extends BaseRepository implements ConfirmTransporterRepository
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
        return ConfirmTransporter::class;
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
        return ConfirmTransporterPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['admission_register_id'])) {
            $this->model = $this->model->where('admission_register_id', $attributes['admission_register_id']);
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
        if (!empty($attributes['confirm_transporter'])) {
            $confirmTransporter = ConfirmTransporter::where('admission_register_id', $attributes['admission_register_id'])->delete();
            foreach ($attributes['confirm_transporter'] as $value) {
                $value['admission_register_id'] = $attributes['admission_register_id'];
                $confirmTransporter = ConfirmTransporter::create($value);
            }
        }

        return parent::parserResult($confirmTransporter);
    }
}
