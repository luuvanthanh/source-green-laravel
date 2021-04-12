<?php

namespace GGPHP\Reward\Transformers;

use GGPHP\Core\Traits\ApprovalTransformerTrait;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Reward\Models\DecisionReward;
use GGPHP\Reward\Transformers\DecisionRewardDetailTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class DecisionRewardTransformer.
 *
 * @package namespace App\Transformers;
 */
class DecisionRewardTransformer extends BaseTransformer
{
    use ApprovalTransformerTrait;

    protected $defaultIncludes = ['approval', 'decisionRewardDetails', 'userCreate'];

    /**
     * Include transferDetails
     * @param  DecisionReward $decisionReward
     */
    public function includeDecisionRewardDetails(DecisionReward $decisionReward)
    {
        return $this->collection($decisionReward->decisionRewardDetails, new DecisionRewardDetailTransformer, 'DecisionRewardDetail');
    }

    /**
     * Include UserCreate
     * @param  DecisionReward $transfer
     */
    public function includeUserCreate(DecisionReward $decisionReward)
    {
        if (empty($decisionReward->userCreate)) {
            return;
        }

        return $this->item($decisionReward->userCreate, new UserTransformer, 'UserCreate');
    }
}
