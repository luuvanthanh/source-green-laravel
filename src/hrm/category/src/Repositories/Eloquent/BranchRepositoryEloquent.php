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

            //$branchCrm = CrmService::createBranch($data);

            // if (isset($branchCrm->data->id)) {
            //     $branch->BranchIdCrm = $branchCrm->data->id;
            //     $branch->update();
            // }
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
            // $branchIdCrm = $branch->BranchIdCrm;

            // $branchCrm = CrmService::updateBranch($data, $branchIdCrm);

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
            // $branchIdCrm = $branch->BranchIdCrm;
            // $branchCrm = CrmService::deleteBranch($branchIdCrm);
            $branch->delete();
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }
        return parent::all();
    }
}
