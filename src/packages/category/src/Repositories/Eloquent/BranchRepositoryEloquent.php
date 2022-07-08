<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Branch;
use GGPHP\Category\Presenters\BranchPresenter;
use GGPHP\Category\Repositories\Contracts\BranchRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Core\Services\CrmService;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class BranchRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class BranchRepositoryEloquent extends CoreRepositoryEloquent implements BranchRepository
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
        return Branch::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return BranchPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function getBranch(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $branch = $this->paginate($attributes['limit']);
        } else {
            $branch = $this->get();
        }

        return $branch;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $branch = Branch::create($attributes);

            $data = [
                'code' => $branch->Code,
                'name' => $branch->Name,
                'address' => $branch->Address,
                'phone_number' => $branch->PhoneNumber,
                'branch_id_hrm' => $branch->Id
            ];

            $branchCrm = CrmService::createBranch($data);

            if (isset($branchCrm->data->id)) {
                $branch->BranchIdCrm = $branchCrm->data->id;
                $branch->update();
            }
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($branch);
    }

    public function update(array $attributes, $id)
    {
        \DB::beginTransaction();
        try {
            $branch = Branch::findOrFail($id);

            $branch->update($attributes);

            $data = [
                'code' => $branch->Code,
                'name' => $branch->Name,
                'address' => $branch->Address,
                'phone_number' => $branch->PhoneNumber,
                'branch_id_hrm' => $branch->Id
            ];
            $branchIdCrm = $branch->BranchIdCrm;

            $branchCrm = CrmService::updateBranch($data, $branchIdCrm);

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($branch);
    }

    public function delete($id)
    {
        \DB::beginTransaction();
        try {
            $branch = Branch::findOrFail($id);
            $branchIdCrm = $branch->BranchIdCrm;
            $branchCrm = CrmService::deleteBranch($branchIdCrm);
            $branch->delete();
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }
        return parent::all();
    }

    public function syncBranch()
    {
        $branchs = Branch::get();

        $response = CrmService::syncBranch($branchs->toArray());

        foreach ($response->data as $key => $value) {
            $branch = Branch::where('Id', $value->attributes->branch_id_hrm)->first();
            $branch->BranchIdCrm = $value->id;
            $branch->update();
        }
        return $this->parserResult($branchs);
    }

    public function reportRefund(array $attributes)
    {
        $branches = $this->studentRefundByBranch($attributes);

        foreach ($branches as $branch) {
            $listStudent = $branch->refundStudent->map(function ($refundStudent) {
                $detail = $refundStudent->studentRefundDetail->groupBy('StudentId')->map(function ($item) use ($refundStudent) {
                    $listFee = $item->map(function ($item) use ($refundStudent) {
                        $item->refundFee = $item->refundFee->load('fee');
                        $item->dateOff = $item->DateOff;
                        $item->numberDayOff = $item->NumberDayOff;
                        $item->type = $refundStudent->Type;
                        return $item;
                    })->values();

                    $studentRefundDetail = $item->first();
                    $student = $studentRefundDetail->student;
                    $listFee = $listFee->map(function ($item) {
                        return $item->only(['refundFee', 'dateOff', 'numberDayOff', 'type']);
                    })->values();

                    $totalFeePaid = $listFee->sum(function ($item) {
                        return $item['refundFee']->sum('FeePaid');
                    });

                    $totalFeeStudied = $listFee->sum(function ($item) {
                        return $item['refundFee']->sum('FeeStudied');
                    });

                    $totalFeeRefund = $listFee->sum(function ($item) {
                        return $item['refundFee']->sum('FeeRefund');
                    });

                    $student->listRefund = $listFee;
                    $student->totalFeePaid = $totalFeePaid;
                    $student->totalFeeStudied = $totalFeeStudied;
                    $student->totalFeeRefund = $totalFeeRefund;

                    return $student;
                })->flatten();

                return $detail;
            })->flatten(1);

            $totalFeePaidByBranch = $listStudent->sum(function ($item) {
                return $item->totalFeePaid;
            });

            $totalFeeStudiedByBranch = $listStudent->sum(function ($item) {
                return $item->totalFeeStudied;
            });

            $totalFeeRefundByBranch = $listStudent->sum(function ($item) {
                return $item->totalFeeRefund;
            });

            $branch->students = $listStudent;
            $branch->totalFeePaidByBranch = $totalFeePaidByBranch;
            $branch->totalFeeStudiedByBranch = $totalFeeStudiedByBranch;
            $branch->totalFeeRefundByBranch = $totalFeeRefundByBranch;
        }

        return $this->parserResult($branches);
    }

    public function studentRefundByBranch(array $attributes)
    {
        $branches = $this->model->when(!empty($attributes['branchId']), function ($query, $attributes) {
            return $query->whereHas('refundStudent', function ($query) use ($attributes) {
                $query->where('BranchId', $attributes['branchId']);
            });
        }, function ($query) {
            return $query->has('refundStudent');
        })->when(!empty($attributes['startDate']) && !empty($attributes['endDate']), function ($query) use ($attributes) {
            return $query->whereHas('refundStudent.studentRefundDetail', function ($query) use ($attributes) {
                $query->whereDate('DateOff', '>=', $attributes['startDate'])->whereDate('DateOff', '<=', $attributes['endDate']);
            });
        })->when(!empty($attributes['type']), function ($query) use ($attributes) {
            return $query->whereHas('refundStudent', function ($query) use ($attributes) {
                $query->where('Type', $attributes['type']);
            });
        })->when(!empty($attributes['studentId']), function ($query) use ($attributes) {
            return $query->whereHas('refundStudent.studentRefundDetail', function ($query) use ($attributes) {
                $students = explode(',', $attributes['studentId']);
                $query->whereIn('StudentId', $students);
            });
        })->with([
            'refundStudent' => function ($query) use ($attributes) {
                // Lấy theo cơ sở
                $query->when(!empty($attributes['branchId']), function ($query, $attributes) {
                    return $query->where('BranchId', $attributes['branchId']);
                });

                // Check có theo ngày và chỉ lấy trong khoảng thời gian đó
                $query->when(!empty($attributes['startDate']) && !empty($attributes['endDate']), function ($query) use ($attributes) {
                    return $query->whereHas('studentRefundDetail', function ($query) use ($attributes) {
                        $query->whereDate('DateOff', '>=', $attributes['startDate']);
                        $query->whereDate('DateOff', '<=', $attributes['endDate']);
                    });
                });

                // Lấy theo loại học sinh
                $query->when(!empty($attributes['type']), function ($query) use ($attributes) {
                    return $query->where('Type', $attributes['type']);
                });

                // Check có học sinh
                $query->when(!empty($attributes['studentId']), function ($query) use ($attributes) {
                    return $query->whereHas('studentRefundDetail', function ($query) use ($attributes) {
                        $students = explode(',', $attributes['studentId']);
                        $query->whereIn('StudentId', $students);
                    });
                });

                $query->with([
                    'studentRefundDetail' => function ($query) use ($attributes) {
                        if (!empty($attributes['startDate'] && !empty($attributes['endDate']))) {
                            $query->whereDate('DateOff', '>=', $attributes['startDate']);
                            $query->whereDate('DateOff', '<=', $attributes['endDate']);
                        }

                        if (!empty($attributes['studentId'])) {
                            $students = explode(',', $attributes['studentId']);
                            $query->whereIn('StudentId', $students);
                        }
                    }
                ]);
            }
        ])->get();

        return $branches;
    }
}
