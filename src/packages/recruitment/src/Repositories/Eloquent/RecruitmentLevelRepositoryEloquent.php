<?php

namespace GGPHP\Recruitment\Repositories\Eloquent;

use GGPHP\Recruitment\Presenters\RecruitmentLevelPresenter;
use GGPHP\Recruitment\Repositories\Contracts\RecruitmentLevelRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Recruitment\Models\RecruitmentLevel;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class LevelRepositoryEloquent.
 *
 * @package namespace GGPHP\Recruitment\Repositories\Eloquent;
 */
class RecruitmentLevelRepositoryEloquent extends CoreRepositoryEloquent implements RecruitmentLevelRepository
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
        return RecruitmentLevel::class;
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
        return RecruitmentLevelPresenter::class;
    }

    public function getLevel(array $attributes)
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
            $sttOneDigit = substr($code->Code, 2);
            $sttOneDigit += 1;
            
            if (strlen($sttOneDigit) == 1) {
                $code = RecruitmentLevel::CODE . '000' . $sttOneDigit;
            }elseif ((strlen($sttOneDigit) == 2)) {
                $code = RecruitmentLevel::CODE . '00' . $sttOneDigit;
            }elseif ((strlen($sttOneDigit) == 3)) {
                $code = RecruitmentLevel::CODE . '0' . $sttOneDigit;
            }elseif ((strlen($sttOneDigit) == 4)) {
                $code = RecruitmentLevel::CODE . $sttOneDigit;
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
