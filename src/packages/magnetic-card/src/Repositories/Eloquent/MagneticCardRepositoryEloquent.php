<?php

namespace GGPHP\MagneticCard\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\MagneticCard\Models\MagneticCard;
use GGPHP\MagneticCard\Presenters\MagneticCardPresenter;
use GGPHP\MagneticCard\Repositories\Contracts\MagneticCardRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class MagneticCardRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class MagneticCardRepositoryEloquent extends CoreRepositoryEloquent implements MagneticCardRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'EmployeeId',
        'employee.FullName' => 'like',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return MagneticCard::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return MagneticCardPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Get all Magnetic Card
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function getAll(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where('CreationTime', '>=', $attributes['startDate'])->where('CreationTime', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->where('EmployeeId', $employeeId);
        }

        $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
            $query->tranferHistory($attributes);
        });

        $this->model = $this->model->withTrashed();

        if (!empty($attributes['limit'])) {
            $magneticCard = $this->paginate($attributes['limit']);
        } else {
            $magneticCard = $this->get();
        }

        return $magneticCard;
    }

    public function create(array $attributes)
    {
        $attributes['card'] = (int) $attributes['card'];
        $middle = floor(strlen($attributes['card']) / 2);
        $magneticCard = substr($attributes['card'], 0, $middle);
        $magneticCardPatch = substr($attributes['card'], $middle);

        $attributes['magneticCardPatch'] = $magneticCardPatch;
        $attributes['magneticCard'] = (int) $magneticCard;
        $attributes['magneticCardToken'] = \Hash::make($attributes['magneticCard']);
        $card = $this->model()::create($attributes);

        return parent::find($card->Id);
    }

    public function delete($id)
    {
        $model = $this->model->withTrashed()->findOrFail($id);

        if (request()->force === true) {
            $model->forceDelete();
        }

        $model->update(['TimekeepingStatus' => 'OFF']);
        $model->delete();
    }

    public function restore($id)
    {
        $model = $this->model->withTrashed()->findOrFail($id);
        $model->update(['TimekeepingStatus' => 'ON']);
        $model->restore();
    }

    public function update(array $attributes, $id)
    {
        $model = $this->model->withTrashed()->findOrFail($id);

        if (!empty($attributes['card'])) {
            $attributes['card'] = (int) $attributes['card'];
            $middle = floor(strlen($attributes['card']) / 2);
            $magneticCard = substr($attributes['card'], 0, $middle);
            $magneticCardPatch = substr($attributes['card'], $middle);

            $attributes['magneticCardPatch'] = $magneticCardPatch;
            $attributes['magneticCard'] = (int) $magneticCard;
            $attributes['magneticCardToken'] = \Hash::make($attributes['magneticCard']);
        }

        $model->update($attributes);

        return parent::parserResult($model);
    }
}
