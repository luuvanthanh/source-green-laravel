<?php

namespace GGPHP\ActivityLog\Traits;

use GGPHP\ActivityLog\Transformers\ActivityLogTransformer;

trait ActivityLogTransformerTrait
{
    public function includeLogActivity($model)
    {
        return $this->collection($model->logActivity, new ActivityLogTransformer, 'LogActivity');
    }
}
