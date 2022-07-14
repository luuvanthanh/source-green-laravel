<?php

namespace GGPHP\Crm\AdmissionRegister\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Crm\AdmissionRegister\Models\ChildDescription;
use GGPHP\Crm\AdmissionRegister\Models\ChildEvaluateInfo;
use GGPHP\Crm\AdmissionRegister\Models\ChildIssue;
use GGPHP\Crm\AdmissionRegister\Presenters\ChildEvaluateInfoPresenter;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\ChildEvaluateInfoRepository;
use GGPHP\Crm\CustomerLead\Models\StudentInfo;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Illuminate\Container\Container as Application;
use GGPHP\WordExporter\Services\WordExporterServices;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ChildEvaluateInfoRepositoryEloquent extends BaseRepository implements ChildEvaluateInfoRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at',
    ];

    public function __construct(
        WordExporterServices $wordExporterServices,
        Application $app
    ) {
        parent::__construct($app);
        $this->wordExporterServices = $wordExporterServices;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ChildEvaluateInfo::class;
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
        return ChildEvaluateInfoPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['admission_register_id'])) {
            $this->model = $this->model->where('admission_register_id', $attributes['admission_register_id']);
        }

        if (!empty($attributes['limit'])) {
            $childEvaluateInfo = $this->paginate($attributes['limit']);
        } else {
            $childEvaluateInfo = $this->get();
        }

        return $childEvaluateInfo;
    }

    public function create(array $attributes)
    {
        $childEvaluateInfo = ChildEvaluateInfo::where('admission_register_id', $attributes['admission_register_id'])->first();

        if (is_null($childEvaluateInfo)) {
            $childEvaluateInfo = ChildEvaluateInfo::create($attributes);
        } else {
            $childEvaluateInfo->update($attributes);
        }

        if (!empty($attributes['child_description'])) {
            ChildDescription::where('child_evaluate_info_id', $childEvaluateInfo->id)->delete();
            foreach ($attributes['child_description'] as $value) {
                $value['child_evaluate_info_id'] = $childEvaluateInfo->id;
                ChildDescription::create($value);
            }
        }

        if (!empty($attributes['child_issue'])) {
            ChildIssue::where('child_evaluate_info_id', $childEvaluateInfo->id)->delete();
            foreach ($attributes['child_issue'] as $value) {
                $value['child_evaluate_info_id'] = $childEvaluateInfo->id;
                ChildIssue::create($value);
            }
        }

        return parent::all();
    }

    public function exportChildEvaluateInfo(array $attributes)
    {
        $childEvaluateInfo = $this->model->where('admission_register_id', $attributes['admissionRegisterId'])->get();

        $now = Carbon::now('Asia/Ho_Chi_Minh');

        foreach ($childEvaluateInfo as $value) {

            $birthday = Carbon::parse($value->admissionRegister->studentInfo->birth_date);
            $numberOfMonth = $birthday->diffInMonths($now);

            $childDescription = $value->childDescription->map(function ($item, $key) {
                return [
                    'number' => $key + 1,
                    'column_question' => $item->question,
                    'answer' => $item->answer
                ];
            });

            $valueIssue = $value->childIssue()->where('is_checked', true)->get();
            $childIssue = $valueIssue->map(function ($item, $keyIssue) {
                return [
                    'number' => $keyIssue + 1,
                    'issue' => $item->question
                ];
            });

            $param = [
                'full_name' => $value->admissionRegister->studentInfo->full_name,
                'sex' => array_search($value->admissionRegister->studentInfo->sex, StudentInfo::SEX),
                'birth_date' => !empty($value->admissionRegister->studentInfo->birth_date) ? $value->admissionRegister->studentInfo->birth_date : null,
                'now' => $now->format('Y-m-d'),
                'month_age' => $numberOfMonth,
                'parent_name' => $value->admissionRegister->studentInfo->customerLead->full_name,
                'phone_number' => $value->admissionRegister->studentInfo->customerLead->phone_number ?? null,
                'email' => $value->admissionRegister->studentInfo->customerLead->email,
                'address' => $value->admissionRegister->studentInfo->customerLead->address,
                'day' => $now->format('d'),
                'month' => $now->format('m'),
                'year' => $now->format('Y'),
                'other_issue' => $value->other_issue,
                'parent_hope' => $value->parent_hope
            ];
        }

        $param['detail'] = $childDescription->all();
        $param['detailChildren'] = $childIssue->all();

        return $this->wordExporterServices->multipleTableExportWord('report_child_evaluate_info', $param);
    }
}
