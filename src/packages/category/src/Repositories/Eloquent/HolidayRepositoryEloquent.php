<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Holiday;
use GGPHP\Category\Models\HolidayDetail;
use GGPHP\Category\Presenters\HolidayPresenter;
use GGPHP\Category\Repositories\Contracts\HolidayRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class HolidayRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class HolidayRepositoryEloquent extends BaseRepository implements HolidayRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'Name',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Holiday::class;
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
        return HolidayPresenter::class;
    }

    public function createOrUpdate(array $attributes)
    {
        $holiday = Holiday::where('Name', $attributes['name'])->first();

        if (is_null($holiday)) {
            $holiday = Holiday::create($attributes);
        } else {
            $holiday->update($attributes);
        }

        if (!empty($attributes['deleteIds'])) {
            $deleteIds = HolidayDetail::whereIn('Id', $attributes['deleteIds'])->delete();
        }

        if (!empty($attributes['updateRows'])) {
            foreach ($attributes['updateRows'] as $value) {
                $updateRows = HolidayDetail::find($value['id']);
                if ($updateRows) {
                    $updateRows->update($value);
                }
            }
        }

        if (!empty($attributes['createRows'])) {
            foreach ($attributes['createRows'] as $value) {
                $value['holidayId'] = $holiday->Id;
                $holiday->holidayDetail()->create($value);
            }
        }

        return parent::find($holiday->Id);
    }
}
