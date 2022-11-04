<?php

namespace GGPHP\StudyProgram\Setting\Repositories\Eloquent;

use Exception;
use GGPHP\StudyProgram\Setting\Models\Subject;
use GGPHP\StudyProgram\Setting\Models\SubjectSection;
use GGPHP\StudyProgram\Setting\Models\SubjectSectionDetail;
use GGPHP\StudyProgram\Setting\Presenters\SubjectPresenter;
use GGPHP\StudyProgram\Setting\Repositories\Contracts\SubjectRepository;
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
class SubjectRepositoryEloquent extends BaseRepository implements SubjectRepository
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
        return Subject::class;
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
        return SubjectPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model()::whereLike('Name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $subject = $this->paginate($attributes['limit']);
        } else {
            $subject = $this->get();
        }

        return $subject;
    }

    public function createAll(array $attributes)
    {
        DB::beginTransaction();
        try {
            $subject = $this->model->create($attributes);
            $this->createSubjectSection($subject, $attributes['section']);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($subject);
    }

    public function createSubjectSection(Model $model, array $attributes): void
    {
        if (!empty($attributes['createRows'])) {
            foreach ($attributes['createRows'] as $valueSection) {
                $valueSection['subjectId'] = $model->Id;
                $section = SubjectSection::create($valueSection);

                $this->createSectionDetail($section, $valueSection['detail']);
            }
        }

        if (!empty($attributes['updateRows'])) {
            foreach ($attributes['updateRows'] as $valueUpdate) {

                $subjectSection = SubjectSection::find($valueUpdate['id']);

                if (!is_null($subjectSection)) {
                    $subjectSection->update($valueUpdate);
                    $this->createSectionDetail($subjectSection, $valueUpdate['detail']);
                }
            }
        }

        if (!empty($attributes['deleteRows'])) {
            SubjectSection::whereIn('Id', $attributes['deleteRows'])->delete();
        }
    }

    public function createSectionDetail($model, $attributes): void
    {
        if (!empty($attributes['createDetail'])) {
            foreach ($attributes['createDetail'] as $valueDetailCreate) {
                $valueDetailCreate['SubjectSectionId'] = $model->Id;
                SubjectSectionDetail::create($valueDetailCreate);
            }
        }

        if (!empty($attributes['updateDetail'])) {
            foreach ($attributes['updateDetail'] as $valueDetailUpdate) {
                $subjectSectionDetail = SubjectSectionDetail::find($valueDetailUpdate['id']);

                if (!is_null($subjectSectionDetail)) {
                    $subjectSectionDetail->update($valueDetailUpdate);
                }
            }
        }

        if (!empty($attributes['deleteDetail'])) {
            SubjectSectionDetail::whereIn('Id', $attributes['deleteDetail'])->delete();
        }
    }

    public function updateAll(array $attributes, $id)
    {
        DB::beginTransaction();
        try {
            $subject = $this->model->find($id);
            $subject->update($attributes);
            $this->createSubjectSection($subject, $attributes['section']);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($subject);
    }

    public function deleteAll($id)
    {
        $subject = $this->model->find($id);
        $section = $subject->subjectSection;

        if (!empty($section)) {
            SubjectSectionDetail::whereIn('SubjectSectionId', array_column($section->ToArray(), 'Id'))->delete();
        }
        $subject->subjectSection()->delete();
        $subject->delete();

        return parent::all();
    }
}
