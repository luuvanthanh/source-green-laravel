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

    protected $defaultIncludes = ['user'];

    /**
     * Define relations user
     */
    public function includeUser(DecisionRewardDetail $decisionRewardDetail)
    {
        if (empty($decisionRewardDetail->user)) {
            return;
        }

        return $this->item($decisionRewardDetail->user, new UserTransformer, 'User');
    }
}
