<?php

namespace GGPHP\Core;

use Illuminate\Support\Facades\Facade;

/**
 * @see \GGPHP\Core\Skeleton\SkeletonClass
 */
class Core extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'Core';
    }
}
