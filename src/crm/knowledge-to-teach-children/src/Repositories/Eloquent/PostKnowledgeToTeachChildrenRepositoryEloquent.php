<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren\Repositories\Eloquent;

use GGPHP\Crm\Clover\Models\CriteriaStandardCriteria;
use GGPHP\Crm\KnowledgeToTeachChildren\Models\PostKnowledgeToTeachChildren;
use GGPHP\Crm\KnowledgeToTeachChildren\Repositories\Contracts\PostKnowledgeToTeachChildrenRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Crm\KnowledgeToTeachChildren\Presenters\PostknowledgeToTeachChildrenPresenter;
use Http\Client\Exception\HttpException;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class PostKnowledgeToTeachChildrenRepositoryEloquent extends BaseRepository implements PostKnowledgeToTeachChildrenRepository
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
        return PostKnowledgeToTeachChildren::class;
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
        return PostknowledgeToTeachChildrenPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key'])->orWhereLike('content', $attributes['key']);
        }

        if (!empty($attributes['category_knowledge_to_teach_children_id'])) {
            $this->model = $this->model->where('category_knowledge_to_teach_children_id', $attributes['category_knowledge_to_teach_children_id']);
        }

        if (!empty($attributes['from_date']) && !empty($attributes['to_date'])) {
            $this->model = $this->model->whereDate('created_at', '>=', $attributes['from_date'])->whereDate('created_at', '<=', $attributes['to_date']);
        }

        if (!empty($attributes['limit'])) {
            $knowledgeToTeachChildren = $this->paginate($attributes['limit']);
        } else {
            $knowledgeToTeachChildren = $this->get();
        }
        return $knowledgeToTeachChildren;
    }

    public function create(array $attributes)
    {
        $result = PostKnowledgeToTeachChildren::create($attributes);

        $this->sentNotification($result);

        return parent::parserResult($result);
    }

    public function update(array $attributes, $id)
    {
        $admissionRegister = PostKnowledgeToTeachChildren::findOrfail($id);
        $admissionRegister->update($attributes);

        $this->sentNotification($admissionRegister);

        return parent::find($id);
    }

    public function getBmiChildren(array $attributes)
    {
        $message = '';
        $type = null;
        $admissionRegister = [];

        if ($attributes['gender'] == 'MALE') {
            $type = 1;
        }

        if ($attributes['gender'] == 'FEMALE') {
            $type = 0;
        }
        // get model bmi 
        $criteriaStandardsBmi = CriteriaStandardCriteria::where('MonthNumber', $attributes['number_of_month'])->where('Type', $type)->first();
        // get array bmi tieu chuan
        $result = number_format(($attributes['weight'] / $attributes['height'] * $attributes['height']) * ($attributes['height'] / 100), 1);

        if (!empty($criteriaStandardsBmi)) {
            $criteriaStandard = json_decode($criteriaStandardsBmi['Value'], true);

            if ($result >= $criteriaStandard['MedianSmallerFirstSD'] && $result <= $criteriaStandard['MedianLargerFirstSD']) {
                $message = 'Trạng thái sức khỏe tốt';
            }

            if ($result >= $criteriaStandard['MedianSmallerThirdSD'] && $result < $criteriaStandard['MedianSmallerFirstSD']) {
                $message = 'Thiếu cân';
            }

            if ($result < $criteriaStandard['MedianSmallerThirdSD']) {
                $message = 'Thiếu cân';
            }

            if ($result > $criteriaStandard['MedianLargerFirstSD'] && $result <= $criteriaStandard['MedianLargerSecondSD']) {
                $message = 'Nguy cơ thừa cân';
            }

            if ($result > $criteriaStandard['MedianLargerSecondSD']) {
                $message = 'Thừa cân';
            }
        } else {
            $message = 'Giá trị Bmi không được tìm thấy';
        }

        $admissionRegister['result_bmi'] = $result;
        $admissionRegister['message'] = $message;

        return $admissionRegister;
    }

    public function sentNotification($model)
    {
        $idRole = null;
        $dataAbpRoles = \DB::connection('pgsql_second')->table('AbpRoles')->get();
        foreach ($dataAbpRoles as $key => $value) {
            $data = json_decode($value->ExtraProperties, true);
            if (!empty($data) && isset($data['RoleCode'])) {
                if ($data['RoleCode'] == 'guest') {
                    $idRole = $value->Id;
                }
            }
        }
        $AbpUserRoles = \DB::connection('pgsql_second')->table('AbpUserRoles')->where('RoleId', $idRole)->first();

        if (!empty($model)) {
            if ($model->status == PostKnowledgeToTeachChildren::STATUS['POSTED']) {
                $dataNotifiCation = [
                    'users' => $AbpUserRoles->UserId,
                    'title' => $model->name,
                    'imageURL' => $model->image,
                    'message' => substr(strip_tags($model->content), 0, 250),
                    'moduleType' => 31,
                    'refId' => $model->id,
                ];

                dispatch(new \GGPHP\Core\Jobs\SendNotiWithoutCode($dataNotifiCation));
            }
        }
    }
}
