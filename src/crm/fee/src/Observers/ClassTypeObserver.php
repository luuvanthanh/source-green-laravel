<?php

namespace GGPHP\Crm\Fee\Observers;

use GGPHP\Crm\Fee\Models\ClassType;
use Illuminate\Support\Facades\Http;

class ClassTypeObserver
{
    /**
     * Handle the school year "created" event.
     *
     * @param  \App\ClassType  $classType
     * @return void
     */
    public function created(ClassType $classType)
    {
        $data = [
            'ClassTypeCrmId' => $classType->id
        ];

        $id = $classType->class_type_clover_id;

        $this->updateIdClover($data, $id);
    }

    /**
     * Handle the school year "updated" event.
     *
     * @param  \App\ClassType  $classType
     * @return void
     */
    public function updated(ClassType $classType)
    {
        //
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
     * @param  \App\ClassType  $classType
     * @return void
     */
    public function forceDeleted(ClassType $classType)
    {
        //
    }

    public function getToken()
    {
        return request()->bearerToken();
    }

    public function url()
    {
        return env('URL_CLOVER') . '/api/v1/class-types';
    }

    public function updateIdClover($data, $id)
    {
        Http::withToken($this->getToken())->put($this->url() . '/' . $id, $data);
    }
}
