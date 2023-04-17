<?php

namespace GGPHP\Recruitment\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Clover\Models\EmployeeAccount;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Recruitment\Models\QuestionCandidate;
use GGPHP\Recruitment\Models\RecruitmentCandidateManagement;
use GGPHP\Recruitment\Models\RecruitmentConfiguration;
use GGPHP\Recruitment\Models\RecruitmentLevel;
use GGPHP\Recruitment\Models\RecruitmentManager;
use GGPHP\Recruitment\Presenters\RecruitmentCandidateManagementPresenter;
use GGPHP\Recruitment\Repositories\Contracts\RecruitmentCandidateManagementRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class LevelRepositoryEloquent.
 *
 * @package namespace GGPHP\Recruitment\Repositories\Eloquent;
 */
class RecruitmentCandidateManagementRepositoryEloquent extends CoreRepositoryEloquent implements RecruitmentCandidateManagementRepository
{
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return RecruitmentCandidateManagement::class;
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
        return RecruitmentCandidateManagementPresenter::class;
    }

    public function getCandidate(array $attributes)
    {
        $a = QuestionCandidate::where('CandidateManagementId', 'f88e90fe-6ac5-41e8-bf44-c7b283119b8d')->get();
        dd($a);
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Location', $attributes['key']);
                $query->orWhereLike('Phone', $attributes['key']);
            })->orWhereHas('level', function ($query) use ($attributes) {
                $query->whereLike('Name', $attributes['key']);
            })->orWhereHas('division', function ($query) use ($attributes) {
                $query->whereLike('Name', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $levels = $this->paginate($attributes['limit']);
        } else {
            $levels = $this->get();
        }

        return $levels;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $recruimentManager = RecruitmentManager::Where('Link', $attributes['endPoint'])->first();
            if (!is_null($recruimentManager)) {
                $attributes['date'] = Carbon::now()->toDateString();
                $attributes['status'] = RecruitmentCandidateManagement::STATUS['UNCONFIMRED'];
                $attributes['DivisionId'] = $recruimentManager->DivisionId;
                $attributes['RecruitmentLevelId'] = $recruimentManager->RecruitmentLevelId;
                $attributes['RecruitmentManagerId'] = $recruimentManager->Id;
            }
            $result = RecruitmentCandidateManagement::create($attributes);

            if ($result) {
                $attributes['numberOfCandidates'] = $recruimentManager->NumberOfCandidates + 1;
                $recruimentManager->update(['NumberOfCandidates' => $attributes['numberOfCandidates']]);
            }


            $this->created($attributes, $result, $recruimentManager);

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();

            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($result);
    }

    public function created($atributes, $model, $recruimentManager)
    {
        $recruitmentConfiguration = RecruitmentConfiguration::findOrFail($recruimentManager->RecruitmentConfigurationId);
        if (!is_null($recruitmentConfiguration) && !empty($recruitmentConfiguration->question)) {
            foreach ($recruitmentConfiguration->question->toArray() as $key => $value) {

                if (!empty($atributes['data'])) {
                    $dataQuestion['CandidateManagementId'] = $model->Id;
                    $dataQuestion['RecruitmentQuestionId'] = $value['Id'];
                    $dataQuestion['Answer'] = $atributes['data'][$key]['answer'];

                    QuestionCandidate::create($dataQuestion);
                }
            }
        }
    }

    public function update(array $attributes, $id)
    {
        $admissionRegister = RecruitmentCandidateManagement::findOrfail($id);
        if (!empty($attributes['status'])) {
            $admissionRegister->update($attributes);

            if ($admissionRegister->Status == RecruitmentCandidateManagement::STATUS['PASS']) {
                $recruimentManager = RecruitmentManager::findOrfail($admissionRegister->RecruitmentManagerId);

                if ($recruimentManager) {
                    $attributes['numberOfCandidatesPass'] = $recruimentManager->NumberOfCandidatesPass + 1;
                    $recruimentManager->update(['NumberOfCandidatesPass' => $attributes['numberOfCandidatesPass']]);
                }
            }
        }

        return parent::find($id);
    }

    public function sentNotification($model)
    {
        if (!empty($model)) {
            $recruimentManager = RecruitmentManager::Where('Id', $model->RecruitmentManagerId)->first();
            $arrayAppUserId = EmployeeAccount::get()->pluck('AppUserId')->toArray();
            $arrayAppUserId = array_chunk($arrayAppUserId, 10);

            foreach ($arrayAppUserId as $key => $appUserId) {
                $dataNotifiCation = [
                    'users' => $appUserId,
                    'title' => $recruimentManager->Name,
                    'imageURL' => '',
                    'message' => 'Bạn có ứng viên mới dành cho ' . $recruimentManager->Name,
                    'moduleType' => 32,
                    'refId' => $recruimentManager->Id,
                ];
                
                dispatch(new \GGPHP\Core\Jobs\SendNotiWithoutCode($dataNotifiCation));
            }
        }
    }
}
