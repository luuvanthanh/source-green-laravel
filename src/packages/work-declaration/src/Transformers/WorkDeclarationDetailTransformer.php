<?php

namespace GGPHP\WorkDeclaration\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\ShiftSchedule\Transformers\ShiftTransformer;
use GGPHP\Timekeeping\Transformers\TimekeepingTransformer;
use GGPHP\WorkDeclaration\Models\WorkDeclarationDetail;

/**
 * Class WorkDeclarationDetailTransformer.
 *
 * @package namespace GGPHP\WorkDeclaration\Transformers;
 */
class WorkDeclarationDetailTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['model'];
    protected $availableIncludes = ['shift', 'timekeeping'];

    public function customAttributes($model): array
    {
        return [
            "time" => json_decode($model->Time),
        ];
    }

    /**
     * Include model
     * @param  WorkDeclarationDetail $workDeclarationDetail
     */
    public function includeModel(WorkDeclarationDetail $workDeclarationDetail)
    {
        if ($workDeclarationDetail->model_type == WorkDeclarationDetail::MODEL['DEFAULT']) {
            return;
        }

        if (empty($workDeclarationDetail->model)) {
            return;
        }

        $presenter = $workDeclarationDetail->model->getPresenter();

        return $this->item($workDeclarationDetail->model, $workDeclarationDetail->model->transformer(), $presenter->resourceKeyItem);
    }

    /**
     * Include shift
     * @param  WorkDeclarationDetail $workDeclarationDetail
     */
    public function includeShift(WorkDeclarationDetail $workDeclarationDetail)
    {
        if (empty($workDeclarationDetail->shift)) {
            return;
        }

        return $this->item($workDeclarationDetail->shift, new ShiftTransformer, 'Shift');
    }

    /**
     * Include timekeeping
     * @param WorkDeclarationDetail $workDeclarationDetail
     * @return \League\Fractal\Resource\Collection
     */
    public function includeTimekeeping(WorkDeclarationDetail $workDeclarationDetail)
    {
        return $this->collection($lateEarly->timekeeping ?? [], new TimekeepingTransformer, 'Timekeeping');
    }

}
