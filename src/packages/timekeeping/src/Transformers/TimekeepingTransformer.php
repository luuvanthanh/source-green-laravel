<?php

namespace GGPHP\Timekeeping\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\FingerprintTimekeeper\Transformers\FingerprintTimekeeperTransformer;
use GGPHP\Timekeeping\Models\Timekeeping;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class TimekeepingTransformer.
 *
 * @package namespace App\Transformers;
 */
class TimekeepingTransformer extends BaseTransformer
{
    protected $availableIncludes = ['employee'];
    protected $defaultIncludes = ['fingerprintTimekeeper'];

    /**
     * Transform the Timekeeping entity.
     *
     * @param Timekeeping $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
        ];
    }

    /**
     * Include Permission
     * @param Timekeeping $timekeeping
     * @return \League\Fractal\Resource\Item
     */
    public function includeEmployee(Timekeeping $timekeeping)
    {
        if (empty($timekeeping->employee)) {
            return;
        }

        return $this->item($timekeeping->employee, new UserTransformer, 'Employee');
    }

    /**
     * Include Permission
     * @param Timekeeping $timekeeping
     * @return \League\Fractal\Resource\Item
     */
    public function includeFingerprintTimekeeper(Timekeeping $timekeeping)
    {
        if (empty($timekeeping->fingerprintTimekeeper)) {
            return;
        }
        return $this->item($timekeeping->fingerprintTimekeeper, new FingerprintTimekeeperTransformer, 'FingerprintTimekeeper');
    }
}
