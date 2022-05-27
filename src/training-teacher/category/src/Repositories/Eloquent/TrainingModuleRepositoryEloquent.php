<?php

namespace GGPHP\TrainingTeacher\Category\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\TrainingTeacher\Category\Models\TrainingModule;
use GGPHP\TrainingTeacher\Category\Presenters\TrainingModulePresenter;
use GGPHP\TrainingTeacher\Category\Repositories\Contracts\TrainingModuleRepository;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class TrainingModuleRepositoryEloquent.
 *
 * @package namespace GGPHP\TrainingTeacher\Category\Repositories\Eloquent;
 */
class TrainingModuleRepositoryEloquent extends CoreRepositoryEloquent implements TrainingModuleRepository
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
        return TrainingModule::class;
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
        return TrainingModulePresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereHas('item', function ($query) use ($attributes) {
                $query->whereLike('Name', $attributes['key'])->whereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $trainingModule = $this->paginate($attributes['limit']);
        } else {
            $trainingModule = $this->get();
        }

        return $trainingModule;
    }

    public function create(array $attributes)
    {
        DB::beginTransaction();
        try {
            $trainingModule = TrainingModule::latest('Code')->first();

            if (is_null($trainingModule)) {
                $attributes['code'] = TrainingModule::CODE . 1;
                $attributes['serialNumber'] = 1;
            } else {
                $subString = substr($trainingModule->Code, 2);
                $attributes['code'] = TrainingModule::CODE .  ++$subString;
                $attributes['serialNumber'] = ++$trainingModule->SerialNumber;
            }

            $trainingModule = TrainingModule::create($attributes);

            $trainingModule->trainingModuleTrainingSkill()->sync($attributes['trainingModuleTrainingSkill']);

            foreach ($attributes['trainingModuleDetail']['createRows'] as $value) {
                $trainingModule->trainingModuleDetail()->create(['TrainingSkillDetailId' => $value]);
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
        }

        return $this->parserResult($trainingModule);
    }

    public function update(array $attributes, $id)
    {
        DB::beginTransaction();
        try {
            $trainingModule = TrainingModule::findorFail($id);
            $trainingModule->update($attributes);

            if (!empty($attributes['trainingSkill'])) {
                $trainingModule->trainingModuleTrainingSkill()->detach();
                $trainingModule->trainingModuleTrainingSkill()->sync($attributes['trainingSkill']);
            }

            if (!empty($attributes['trainingModuleDetail'])) {

                if (!empty($attributes['trainingModuleDetail']['deleteRows'])) {
                    $trainingModule->trainingModuleDetail()->whereIn('Id', $attributes['trainingModuleDetail']['deleteRows'])->delete();
                }

                foreach ($attributes['trainingModuleDetail']['createRows'] as $value) {
                    $trainingModule->trainingModuleDetail()->create(['TrainingSkillDetailId' => $value]);
                }
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
        }

        return $this->parserResult($trainingModule);
    }
}
