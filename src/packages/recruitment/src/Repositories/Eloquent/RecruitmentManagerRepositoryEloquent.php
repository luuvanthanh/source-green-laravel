<?php

namespace GGPHP\Recruitment\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Clover\Models\EmployeeAccount;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Recruitment\Models\QuestionCandidate;
use GGPHP\Recruitment\Models\RecruitmentCandidateManagement;
use GGPHP\Recruitment\Models\RecruitmentConfiguration;
use GGPHP\Recruitment\Models\RecruitmentManager;
use GGPHP\Recruitment\Presenters\RecruitmentManagerPresenter;
use GGPHP\Recruitment\Repositories\Contracts\RecruitmentManagerRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Str;

/**
 * Class LevelRepositoryEloquent.
 *
 * @package namespace GGPHP\Recruitment\Repositories\Eloquent;
 */
class RecruitmentManagerRepositoryEloquent extends CoreRepositoryEloquent implements RecruitmentManagerRepository
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
        return RecruitmentManager::class;
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
        return RecruitmentManagerPresenter::class;
    }

    public function getRecruitmentManager(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Code', $attributes['key']);
                $query->orWhereLike('Name', $attributes['key']);
            })->orWhereHas('recruitmentConfiguration', function ($query) use ($attributes) {
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
            $attributes = $this->creating($attributes);

            $result = RecruitmentManager::create($attributes);

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();

            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($result);
    }

    public function creating($attributes)
    {
        $code = RecruitmentManager::latest()->first();

        if (is_null($code)) {
            $code = RecruitmentManager::CODE . '001';
        } else {
            $stt = substr($code->Code, 4);
            $stt += 1;

            if (strlen($stt) == 1) {
                $code = RecruitmentManager::CODE . '00' . $stt;
            } elseif (strlen($stt) == 2) {
                $code = RecruitmentManager::CODE . '0' . $stt;
            } else {
                $code = RecruitmentManager::CODE . $stt;
            }
        }
        $attributes['code'] = $code;

        return $attributes;
    }

    public function update(array $attributes, $id)
    {
        $admissionRegister = RecruitmentManager::findOrFail($id);

        $admissionRegister->update($attributes);

        return parent::find($id);
    }

    public function getLink(array $attributes)
    {
        $data = [];
        $url = env('LINK_RECRUITMENT_CANDIDATE');
        $str = Str::random(30);
        $data['domain'] = $url;
        $data['endPoint'] = $str;

        return ["data" => ["type" => "Link", "attributes" => $data]];
    }

    public function getFormRecruitment(array $attributes)
    {
        $recruitmentManagement = RecruitmentManager::where('Link', $attributes['endPoint'])->first();
        if (!is_null($recruitmentManagement)) {
            $recruitmentConfiguration = RecruitmentConfiguration::findOrFail($recruitmentManagement->RecruitmentConfigurationId);
        }

        return parent::parserResult($recruitmentConfiguration);;
    }

    public function createCandidate(array $attributes)
    {
        $recruimentManager = RecruitmentManager::Where('Id', $attributes['recruitmentManagerId'])->first();
        if (!is_null($recruimentManager)) {
            $attributes['date'] = Carbon::now()->toDateString();
            $attributes['status'] = RecruitmentCandidateManagement::STATUS['UNCONFIMRED'];
            $attributes['DivisionId'] = $recruimentManager->DivisionId;
            $attributes['RecruitmentLevelId'] = $recruimentManager->RecruitmentLevelId;
            $attributes['RecruitmentManagerId'] = $recruimentManager->Id;
        }

        $result = RecruitmentCandidateManagement::create($attributes);
        $this->sentNotification($result);

        return parent::parserResult($result);
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
