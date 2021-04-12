<?php
namespace GGPHP\Reward\Services;

use GGPHP\Reward\Models\DecisionRewardDetail;

class DecisionRewardDetailServices
{
    /**
     * @param $attributes
     * @return bool
     */
    public static function add($id, $attributes)
    {
        foreach ($attributes as $value) {
            $value['decision_reward_id'] = $id;
            $shiftDetail = DecisionRewardDetail::create($value);
        }

        return true;
    }
}
