<?php

namespace GGPHP\Fee\Observers;

use GGPHP\Fee\Jobs\CreateClassTypeCrmJob;
use GGPHP\Fee\Jobs\UpdateClassTypeCrmJob;
use GGPHP\Fee\Models\ClassType;

class ClassTypeObserver
{
    /**
     * Handle the school year "created" event.
     *
     * @param  \App\ClassType  $ClassType
     * @return void
     */
    public function created(ClassType $classType)
    {
        dispatch(new CreateClassTypeCrmJob($classType, $this->getToken()));
    }

    /**
     * Handle the school year "updated" event.
     *
     * @param  \App\ClassType  $classType
     * @return void
     */
    public function updated(ClassType $classType)
    {
        dispatch(new UpdateClassTypeCrmJob($classType, $classType->ClassTypeCrmId, $this->getToken()));
    }

    /**
     * Handle the school year "deleted" event.
     *
     * @param  \App\ClassType  $classType
     * @return void
     */
    public function deleted(ClassType $classType)
    {
        //
    }

    /**
     * Handle the school year "restored" event.
     *
     * @param  \App\ClassType  $classType
     * @return void
     */
    public function restored(ClassType $classType)
    {
        //
    }

    /**
     * Handle the school year "force deleted" event.
     *
     * @param  \App\ClassType  $ClassType
     * @return void
     */
    public function forceDeleted(ClassType $ClassType)
    {
        //
    }

    public function getToken()
    {
        return request()->bearerToken();
    }
}
