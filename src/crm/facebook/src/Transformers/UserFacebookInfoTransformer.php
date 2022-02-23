<?php

namespace GGPHP\Crm\Facebook\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Facebook\Models\UserFacebookInfo;

/**
 * Class CustomerPotentialEventInfoTransformer.
 *
 * @package namespace App\Transformers;
 */
class UserFacebookInfoTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['userFacebookInfoTag', 'employeeFacebook'];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $sex = null;
        foreach (UserFacebookInfo::SEX as $key => $value) {
            if (!is_null($model->sex)) {
                if ($value == $model->sex) {
                    $sex = $key;
                }
            }
        }

        $status = null;

        foreach (UserFacebookInfo::STATUS as $key => $value) {
            if ($value == $model->status) {
                $status = $key;
            }
        }

        return [
            'status' => $status,
            'sex' => $sex
        ];
    }

    public function includeUserFacebookInfoTag(UserFacebookInfo $userFacebookInfo)
    {
        return $this->collection($userFacebookInfo->userFacebookInfoTag, new UserFacebookInfoTagTransformer, 'UserFacebookInfoTag');
    }

    public function includeEmployeeFacebook(UserFacebookInfo $userFacebookInfo)
    {
        if (is_null($userFacebookInfo->employeeFacebook)) {
            return;
        }

        return $this->item($userFacebookInfo->employeeFacebook, new EmployeeFacebookTransformer, 'EmployeeFacebook');
    }
}
