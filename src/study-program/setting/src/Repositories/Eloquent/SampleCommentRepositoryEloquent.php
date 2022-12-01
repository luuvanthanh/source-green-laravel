<?php

namespace GGPHP\StudyProgram\Setting\Repositories\Eloquent;

use GGPHP\StudyProgram\Setting\Models\SampleComment;
use GGPHP\StudyProgram\Setting\Models\SampleCommentDetail;
use GGPHP\StudyProgram\Setting\Presenters\SampleCommentPresenter;
use GGPHP\StudyProgram\Setting\Repositories\Contracts\SampleCommentRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SampleCommentRepositoryEloquent extends BaseRepository implements SampleCommentRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id', 'CreationTime'
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return SampleComment::class;
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
        return SampleCommentPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model()::whereLike('Name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $result = $this->paginate($attributes['limit']);
        } else {
            $result = $this->get();
        }

        return $result;
    }

    public function createAll(array $attributes)
    {
        DB::beginTransaction();
        try {
            $data = $this->model->create($attributes);
            $this->createDetail($data, $attributes['detail']);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($data);
    }

    public function updateAll(array $attributes, $id)
    {
        DB::beginTransaction();
        try {
            $data = $this->model->find($id);
            $data->update($attributes);
            $this->createDetail($data, $attributes['detail']);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($data);
    }

    public function deleteAll($id)
    {
        $subject = $this->model->find($id);

        return parent::all();
    }

    public function createDetail(model $model, array $attributes): void
    {
        if (!empty($attributes['createRows'])) {
            foreach ($attributes['createRows'] as $createValue) {
                $createValue['SampleCommentId'] = $model->Id;
                SampleCommentDetail::create($createValue);
            }
        }

        if (!empty($attributes['updateRows'])) {
            foreach ($attributes['updateRows'] as $updateValue) {
                $detail = SampleCommentDetail::find($updateValue['id']);

                if (!empty($detail)) {
                    $detail->update($updateValue);
                }
            }
        }

        if (!empty($attributes['deleteRows'])) {
            SampleCommentDetail::whereIn('Id', $attributes['deleteRows'])->delete();
        }
    }
}
