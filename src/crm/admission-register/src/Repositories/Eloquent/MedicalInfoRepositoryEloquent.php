<?php

namespace GGPHP\Crm\AdmissionRegister\Repositories\Eloquent;

use GGPHP\Crm\AdmissionRegister\Models\ChildHeathDevelop;
use GGPHP\Crm\AdmissionRegister\Models\MedicalDeclareInfo;
use GGPHP\Crm\AdmissionRegister\Models\MedicalInfo;
use GGPHP\Crm\AdmissionRegister\Models\ParentInfo;
use GGPHP\Crm\AdmissionRegister\Presenters\MedicalInfoPresenter;
use GGPHP\Crm\AdmissionRegister\Presenters\ParentInfoPresenter;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\MedicalInfoRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class MedicalInfoRepositoryEloquent extends BaseRepository implements MedicalInfoRepository
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
        return MedicalInfo::class;
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
        return MedicalInfoPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['admission_register_id'])) {
            $this->model = $this->model->where('admission_register_id', $attributes['admission_register_id']);
        }

        if (!empty($attributes['limit'])) {
            $medicalInfo = $this->paginate($attributes['limit']);
        } else {
            $medicalInfo = $this->get();
        }

        return $medicalInfo;
    }

    public function create(array $attributes)
    {
        $medicalInfo = MedicalInfo::where('admission_register_id', $attributes['admission_register_id'])->first();

        if (is_null($medicalInfo)) {
            $medicalInfo = MedicalInfo::create($attributes);
        } else {
            $medicalInfo->update($attributes);
        }
        $medicalDeclare = MedicalDeclareInfo::where('medical_info_id', $medicalInfo->id)->delete();
        $childHeath = ChildHeathDevelop::where('medical_info_id', $medicalInfo->id)->delete();

        if (!empty($attributes['medical_declare'])) {
            $this->storeMedicalDeclare($medicalInfo->id, $attributes['medical_declare']);
        }

        if (!empty($attributes['child_heath'])) {
            $this->storeChildHeath($medicalInfo->id, $attributes['child_heath']);
        }

        return parent::all();
    }

    public function storeMedicalDeclare($id, $attributes)
    {
        foreach ($attributes as $value) {
            $value['medical_info_id'] = $id;
            MedicalDeclareInfo::create($value);
        }

        return true;
    }

    public function storeChildHeath($id, $attributes)
    {
        foreach ($attributes as $value) {
            $value['medical_info_id'] = $id;
            ChildHeathDevelop::create($value);
        }

        return true;
    }
}
