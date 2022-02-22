<?php

namespace ZK;

use Illuminate\Support\Facades\Facade; 

/**
 * @see \ZK
 */
class ZKFacade extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'ZK';
    }
}
