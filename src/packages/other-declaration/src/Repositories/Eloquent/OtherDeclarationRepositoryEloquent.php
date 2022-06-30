<?php

namespace GGPHP\OtherDeclaration\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Category\Models\HolidayDetail;
use GGPHP\Clover\Repositories\Contracts\StudentRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\OtherDeclaration\Models\OtherDeclaration;
use GGPHP\OtherDeclaration\Presenters\OtherDeclarationPresenter;
use GGPHP\OtherDeclaration\Repositories\Contracts\OtherDeclarationRepository;
use GGPHP\OtherDeclaration\Services\OtherDeclarationServices;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class OtherDeclarationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class OtherDeclarationRepositoryEloquent extends CoreRepositoryEloquent implements OtherDeclarationRepository
{
    protected $fieldSearchable = [
        'Id',
        'Time',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return OtherDeclaration::class;
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
        return OtherDeclarationPresenter::class;
    }

    public function filterOtherDeclaration(array $attributes)
    {

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereHas('otherDeclarationDetail', function ($query) use ($employeeId) {
                $query->whereIn('EmployeeId', $employeeId);
            });
        }

        if (!empty($attributes['fullName'])) {
            $this->model = $this->model->whereHas('otherDeclarationDetail', function ($query) use ($attributes) {
                $query->whereHas('employee', function ($q2) use ($attributes) {
                    $q2->whereLike('FullName', $attributes['fullName']);
                });
            });
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where('Time', '>=', $attributes['startDate'])->where('Time', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['limit'])) {
            $otherDeclaration = $this->paginate($attributes['limit']);
        } else {
            $otherDeclaration = $this->get();
        }

        return $otherDeclaration;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $otherDeclaration = OtherDeclaration::create($attributes);

            OtherDeclarationServices::addDetail($otherDeclaration->Id, $attributes['detail']);
            OtherDeclarationServices::addChangeContract($otherDeclaration->Id, $attributes['changeContract']);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return parent::find($otherDeclaration->Id);
    }

    public function update(array $attributes, $id)
    {
        $otherDeclaration = OtherDeclaration::findOrFail($id);

        \DB::beginTransaction();
        try {
            $otherDeclaration->update($attributes);

            if (!empty($attributes['detail'])) {
                $otherDeclaration->otherDeclarationDetail()->delete();
                OtherDeclarationServices::addDetail($otherDeclaration->Id, $attributes['detail']);
            }

            if (!empty($attributes['changeContract'])) {
                $otherDeclaration->changeContractParameter()->delete();
                OtherDeclarationServices::addChangeContract($otherDeclaration->Id, $attributes['changeContract']);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return parent::find($otherDeclaration->Id);
    }

    public function calculatorWork(array $attributes)
    {
        $numberHolidays = resolve(StudentRepository::class)->holidays($attributes['startDate'], $attributes['endDate']);

        $totalWork = $this->numberDay($attributes['startDate'], $attributes['endDate']);

        $holidayByTime = HolidayDetail::whereDate('StartDate', '>=', $attributes['startDate'])
            ->whereDate('EndDate', '<=', $attributes['endDate'])->get();

        $totalHolidayInTimeSpace = $holidayByTime->map(function ($item) {
            $numberDay = $this->numberDay($item->StartDate, $item->EndDate);

            return $numberDay;
        })->sum();

        $work = $totalWork - $numberHolidays - $totalHolidayInTimeSpace;

        $result = ['totalWork' => $work];

        return ['data' => $result];
    }

    public function numberDay($firstMonth = null, $secondMonth)
    {
        if ($firstMonth === null) $firstMonth = Carbon::today()->startOfMonth();

        $firstMonth = Carbon::parse($firstMonth);

        $secondMonth = Carbon::parse($secondMonth);

        return $secondMonth->diffInDays($firstMonth) + 1;
    }
}
