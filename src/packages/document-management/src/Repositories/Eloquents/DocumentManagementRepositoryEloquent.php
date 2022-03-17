<?php

namespace GGPHP\DocumentManagement\Repositories\Eloquents;

use GGPHP\Clover\Models\EmployeeAccount;
use GGPHP\DocumentManagement\Models\DocumentManagement;
use GGPHP\DocumentManagement\Presenters\DocumentManagementPresenter;
use GGPHP\DocumentManagement\Repositories\Contracts\DocumentManagementRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;
use Illuminate\Support\Facades\DB;

/**
 * Class DocumentManagementRepositoryEloquent.
 *
 * @package GGPHP\DocumentManagement\Repositories\Eloquents;
 */
class DocumentManagementRepositoryEloquent extends CoreRepositoryEloquent implements DocumentManagementRepository
{
    /**
     * @var array
     */
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
        return DocumentManagement::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return DocumentManagementPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function getAll(array $attributes)
    {
        if (isset($attributes['topic'])) {
            $this->model = $this->model->where('Topic', $attributes['topic']);
        }

        if (isset($attributes['typeOfDocument'])) {
            $this->model = $this->model->where('TypeOfDocument', $attributes['typeOfDocument']);
        }

        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('Title', $attributes['key']);
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->whereDate('CreationTime', '>=', $attributes['startDate'])
                ->whereDate('CreationTime', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['limit'])) {
            $documentManagement = $this->paginate($attributes['limit']);
        } else {
            $documentManagement = $this->get();
        }

        return $documentManagement;
    }

    public function create(array $attributes)
    {
        $attributes['typeOfDocument'] = DocumentManagement::TYPE_DOCUMENT[$attributes['typeOfDocument']];
        $attributes['topic'] = DocumentManagement::TOPIC[$attributes['topic']];
        $documentManagement = DocumentManagement::create($attributes);

        if (!empty($attributes['detail'])) {
            $documentManagement->employee()->sync($attributes['detail']);
        }

        $userId = [];
        $userId = $documentManagement->employee->pluck('Id')->toArray();
        $accountId = EmployeeAccount::whereIn('EmployeeId', $userId)->pluck('AppUserId')->toArray();

        $file =  json_decode($documentManagement->FileDocument);
        $urlFile = '';

        if (!empty($file)) {
            $urlFile = env('IMAGE_URL') . $file[0];
        }

        if (!empty($accountId)) {
            $dataNoti = [
                'users' => $accountId,
                'title' => $documentManagement->Title,
                'imageURL' => $urlFile,
                'message' => $documentManagement->Content,
                'moduleType' => 16,
                'moduleCode' => 'DOCUMENTARY',
                'refId' => $documentManagement->Id,
            ];

            dispatch(new \GGPHP\Core\Jobs\SendNoti($dataNoti));
        }

        return parent::find($documentManagement->Id);
    }

    public function update(array $attributes, $id)
    {
        $documentManagement = DocumentManagement::findOrFail($id);
        $attributes['typeOfDocument'] = DocumentManagement::TYPE_DOCUMENT[$attributes['typeOfDocument']];
        $attributes['topic'] = DocumentManagement::TOPIC[$attributes['topic']];
        $documentManagement->update($attributes);

        if (!empty($attributes['detail'])) {
            $documentManagement->employee()->detach();
            $documentManagement->employee()->sync($attributes['detail']);
        }

        $userId = [];
        $userId = $documentManagement->employee->pluck('Id')->toArray();
        $accountId = EmployeeAccount::whereIn('EmployeeId', $userId)->pluck('AppUserId')->toArray();

        $file =  json_decode($documentManagement->FileDocument);
        $urlFile = '';

        if (!empty($file)) {
            $urlFile = env('IMAGE_URL') . $file[0];
        }

        if (!empty($accountId)) {
            $dataNoti = [
                'users' => $accountId,
                'title' => $documentManagement->Title,
                'imageURL' => $urlFile,
                'message' => $documentManagement->Content,
                'moduleType' => 16,
                'moduleCode' => 'DOCUMENTARY',
                'refId' => $documentManagement->Id,
            ];

            dispatch(new \GGPHP\Core\Jobs\SendNoti($dataNoti));
        }

        return parent::find($id);
    }

    public function delete($id)
    {
        $documentManagement = DocumentManagement::find($id);
        $documentManagement->employee()->detach();
        $documentManagement->delete();

        return $this->parserResult($documentManagement);
    }
}
