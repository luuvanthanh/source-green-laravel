<?php

namespace GGPHP\SystemConfig\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\SystemConfig\Models\SystemConfig;
use GGPHP\Users\Transformers\UserTransformer;
use GGPHP\Camera\Transformers\CameraTransformer;

/**
 * Class SystemConfigTransformer.
 *
 * @package namespace App\Transformers;
 */
class SystemConfigTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['receiveEmail', 'teamplateEmail'];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {

        return [
            'count_receive_email' => $model->receiveEmail->count()
        ];
    }

    /**
     * Include ReceiveEmail
     * @param  SystemConfig $models
     */
    public function includeReceiveEmail(SystemConfig $models)
    {
        return $this->collection($models->receiveEmail, new UserTransformer, 'ReceiveEmail');
    }

    /**
     * Include TeamplateEmail
     * @param  SystemConfig $models
     */
    public function includeTeamplateEmail(SystemConfig $models)
    {
        return $this->collection($models->teamplateEmail, new TeamplateEmailTransformer, 'TeamplateEmail');
    }
}
