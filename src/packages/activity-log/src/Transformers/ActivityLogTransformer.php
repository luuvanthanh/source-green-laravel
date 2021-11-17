<?php

namespace GGPHP\ActivityLog\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Review\Models\ReviewProductivity;
use GGPHP\Users\Transformers\UserTransformer;
use Spatie\Activitylog\Models\Activity;
use Symfony\Component\ClassLoader\ClassMapGenerator;

/**
 * Class TimekeepingTransformer.
 *
 * @package namespace App\Transformers;
 */
class ActivityLogTransformer extends BaseTransformer
{
    protected $defaultIncludes = [];
    protected $availableIncludes = ['causer'];

    /**
     * Transform the ReviewProductivity entity.
     *
     * @param ReviewProductivity $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $models = config('constants-activity.MODEL_COLLECTIONS');

        $function = array_key_exists($model->subject_type, $models) ? $models[$model->subject_type] : $model->subject_type;

        return [
            'description' => config('constants-activity.ACTION_COLLECTIONS')[$model->description],
            'function' => $function,
            'created_at' => $model->created_at,
        ];
    }

    /**
     * Include Owner
     * @param Activity $activity
     * @return \League\Fractal\Resource\Item
     */
    public function includeCauser(Activity $activity)
    {
        if (empty($activity->causer)) {
            return;
        }

        return $this->item($activity->causer, new UserTransformer(), 'User');
    }
}
