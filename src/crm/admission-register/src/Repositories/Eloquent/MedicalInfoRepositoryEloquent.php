<?php

namespace GGPHP\Crm\AdmissionRegister\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Crm\AdmissionRegister\Models\ChildHeathDevelop;
use GGPHP\Crm\AdmissionRegister\Models\MedicalDeclareInfo;
use GGPHP\Crm\AdmissionRegister\Models\MedicalInfo;
use GGPHP\Crm\AdmissionRegister\Models\ParentInfo;
use GGPHP\Crm\AdmissionRegister\Presenters\MedicalInfoPresenter;
use GGPHP\Crm\AdmissionRegister\Presenters\ParentInfoPresenter;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\MedicalInfoRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;

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

    public function __construct(
        ExcelExporterServices $excelExporterServices,
        WordExporterServices $wordExporterServices,
        Application $app
    ) {
        parent::__construct($app);
        $this->wordExporterServices = $wordExporterServices;
        $this->excelExporterServices = $excelExporterServices;
    }

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

    public function exportMedicalInfo($attributes)
    {
        $dataValueDeclareInfo = [];
        $dataValueChildHeathDevelop = [];
        $now = Carbon::now()->setTimezone('GMT+7');
        $medicalInfo = MedicalInfo::where('admission_register_id', $attributes['admission_register_id'])->first();

        $dataValueDeclareInfo = $medicalInfo->medicalDeclareInfo->map(function ($item, $key) {
            return [
                'number' => $key + 1,
                'question' => !empty($item->configMedicalDeclare->name) ? $item->configMedicalDeclare->name : '.....',
                'answer' => !empty($item->is_checked) ? 'Có' : 'Không',
                'reason' => !empty($item->reason) ? $item->reason : '.....'
            ];
        });

        $dataValueChildHeathDevelop = $medicalInfo->childHeathDevelop->map(function ($item, $key) {
            return [
                'number' => $key + 1,
                'sick' => $item->sick,
                'year_sick' => $item->year,
                'hospital_time' => $item->hospital_time,
                'status' => $item->status,
                'note' => !empty($item->note) ? $item->note : '.....'
            ];
        });

        $param = [
            'date' => $now->format('d'),
            'month' => $now->format('m'),
            'year' => $now->format('Y'),
            'note' => $medicalInfo->note,
            'full_name_parent' => $medicalInfo->admissionRegister->studentInfo->customerLead->full_name,
            'full_name_student' => $medicalInfo->admissionRegister->studentInfo->full_name,
            'birth_date' => $medicalInfo->admissionRegister->studentInfo->birth_date,
            'weight' => $medicalInfo->weight . '.Kg',
            'height'  => $medicalInfo->height . '.Cm',
            'detail' => $dataValueDeclareInfo->all(),
            'detailChildren' => $dataValueChildHeathDevelop->all()
        ];

        return $this->wordExporterServices->multipleTableExportWord('medical_info', $param);
    }
}
