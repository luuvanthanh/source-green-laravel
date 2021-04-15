<?php

namespace GGPHP\Reward\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Reward\Models\DecisionRewardDetail;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class DecisionRewardDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class DecisionRewardDetailTransformer extends BaseTransformer
{

    protected $defaultIncludes = ['employee'];

    /**
     * Define relations employee
     */
    public function includeUser(DecisionRewardDetail $decisionRewardDetail)
    {
        if (empty($decisionRewardDetail->employee)) {
            return;
        }

        return $this->item($decisionRewardDetail->employee, new UserTransformer, 'User');
    }
}
