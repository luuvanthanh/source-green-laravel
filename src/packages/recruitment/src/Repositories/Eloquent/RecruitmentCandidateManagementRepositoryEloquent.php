<?php

namespace GGPHP\Recruitment\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Recruitment\Models\RecruitmentCandidateManagement;
use GGPHP\Recruitment\Models\RecruitmentLevel;
use GGPHP\Recruitment\Presenters\RecruitmentCandidateManagementPresenter;
use GGPHP\Recruitment\Repositories\Contracts\RecruitmentCandidateManagementRepository;
use Prettus\Repository\Criteria\RequestCriteria;

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
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Code', $attributes['key']);
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Decription', $attributes['key']);
                $query->orWhereLike('Note', $attributes['key']);
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
        $attributes = $this->creating($attributes);
        
        $result = RecruitmentLevel::create($attributes);

        return parent::parserResult($result);
    }

    public function creating($attributes)
    {
        $code = RecruitmentLevel::latest()->first();

        if (is_null($code)) {
            $code = RecruitmentLevel::CODE . '0001';
        } else {
            $stt = substr($code->Code, 4);
            $stt += 1;

            if (strlen($stt) == 1) {
                $code = RecruitmentLevel::CODE . '000' . $stt;
            } elseif (strlen($stt) == 2) {
                $code = RecruitmentLevel::CODE . '00' . $stt;
            } elseif (strlen($stt) == 3) {
                $code = RecruitmentLevel::CODE . '0' . $stt;
            } else {
                $code = RecruitmentLevel::CODE . $stt;
            }
        }
        $attributes['Code'] = $code;

        return $attributes;
    }

    public function update(array $attributes, $id)
    {
        $admissionRegister = RecruitmentLevel::findOrfail($id);

        $admissionRegister->update($attributes);

        return parent::find($id);
    }
}
