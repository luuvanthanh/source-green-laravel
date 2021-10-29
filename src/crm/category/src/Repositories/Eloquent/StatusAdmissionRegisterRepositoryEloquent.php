<?php

namespace GGPHP\Crm\Category\Repositories\Eloquent;

use GGPHP\Crm\Category\Models\StatusAdmissionRegister;
use GGPHP\Crm\Category\Presenters\statusAdmissionRegisterPresenter;
use GGPHP\Crm\Category\Repositories\Contracts\StatusAdmissionRegisterRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class StatusAdmissionRegisterRepositoryEloquent extends BaseRepository implements StatusAdmissionRegisterRepository
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
        return StatusAdmissionRegister::class;
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
        return statusAdmissionRegisterPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $statusParentLead = $this->paginate($attributes['limit']);
        } else {
            $statusParentLead = $this->get();
        }

        return $statusParentLead;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $code = StatusAdmissionRegister::max('code');

            if (is_null($code)) {
                $attributes['code'] = StatusAdmissionRegister::CODE . "1";
            } else {
                $getNumber = substr($code, 3) + 1;
                $attributes['code'] = StatusAdmissionRegister::CODE . "$getNumber";
            }
            $statusAdmissionRegister = StatusAdmissionRegister::create($attributes);

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($statusAdmissionRegister);
    }
}
