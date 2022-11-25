<?php

namespace GGPHP\ActivityLog\Traits;

use GGPHP\ActivityLog\Transformers\ActivityLogTransformer;

trait ActivityLogTransformerTrait
{
    public function includeActivityLog($model)
    {
        return $this->collection($model->activityLog, new ActivityLogTransformer, 'activityLog');
    }
}
