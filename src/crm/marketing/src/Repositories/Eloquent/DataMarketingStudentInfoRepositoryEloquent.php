<?php

namespace GGPHP\Crm\Marketing\Repositories\Eloquent;

use GGPHP\Crm\Marketing\Models\DataMarketingStudentInfo;
use GGPHP\Crm\Marketing\Presenters\DataMarketingStudentInfoPresenter;
use GGPHP\Crm\Marketing\Repositories\Contracts\DataMarketingStudentInfoRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class EventInfoRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class DataMarketingStudentInfoRepositoryEloquent extends BaseRepository implements DataMarketingStudentInfoRepository
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
        return DataMarketingStudentInfo::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function presenter()
    {
        return DataMarketingStudentInfoPresenter::class;
    }

    public function getStudentInfo(array $attributes)
    {
        if (!empty($attributes['data_marketing_id'])) {
            $this->model = $this->model->where('data_marketing_id', $attributes['data_marketing_id']);
        }

        if (!empty($attributes['limit'])) {
            $studentInfo = $this->paginate($attributes['limit']);
        } else {
            $studentInfo = $this->get();
        }

        return $studentInfo;
    }

    public function create(array $attributes)
    {
        if (!empty($attributes['create_rows'])) {
            foreach ($attributes['create_rows'] as $value) {  
                $value['sex'] = DataMarketingStudentInfo::SEX[$value['sex']];
                DataMarketingStudentInfo::create($value);
            }
        }

        if (!empty($attributes['update_rows'])) {
            foreach ($attributes['update_rows'] as $value) {
                $updateDataMarketingStudentInfo = DataMarketingStudentInfo::find($value['id']);
                $value['sex'] = DataMarketingStudentInfo::SEX[$value['sex']];
                $updateDataMarketingStudentInfo->update($value);
            }
        }

        if (!empty($attributes['delete_rows'])) {
            DataMarketingStudentInfo::whereIn('id', $attributes['delete_rows'])->delete();
        }

        return parent::all();
    }
}
