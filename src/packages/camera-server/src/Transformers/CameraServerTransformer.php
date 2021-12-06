<?php

namespace GGPHP\CameraServer\Transformers;

use GGPHP\CameraServer\Models\CameraServer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Models\User;
use Illuminate\Support\Facades\Auth;

/**
 * Class CollectionTransformer.
 *
 * @package namespace App\Transformers;
 */
class CameraServerTransformer extends BaseTransformer
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
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        //status 
        $status = null;

        foreach (CameraServer::STATUS as $key => $value) {
            if ($value == $model->status) {
                $status = $key;
            }
        }


        return [
            "status" => $status,
        ];
    }
}
