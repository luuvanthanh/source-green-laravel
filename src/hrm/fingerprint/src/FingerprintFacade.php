<?php

namespace GGPHP\Fingerprint;

use Illuminate\Support\Facades\Facade;

/**
 * @see \GGPHP\Attendance\Skeleton\SkeletonClass
 */
class FingerprintFacade extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'Fingerprint';
    }
}
