<?php

namespace GGPHP\Crm\Fee\Observers;

use GGPHP\Crm\Fee\Models\SchoolYear;
use Illuminate\Support\Facades\Http;

class SchoolYearObserver
{
    /**
     * Handle the school year "created" event.
     *
     * @param  \App\SchoolYear  $schoolYear
     * @return void
     */
    public function created(SchoolYear $schoolYear)
    {
        $data = [
            'SchoolYearCrmId' => $schoolYear->id
        ];

        $id = $schoolYear->school_year_clover_id;

        $this->updateIdClover($data, $id);
    }

    /**
     * Handle the school year "updated" event.
     *
     * @param  \App\SchoolYear  $schoolYear
     * @return void
     */
    public function updated(SchoolYear $schoolYear)
    {
        //
    }

    /**
     * Handle the school year "deleted" event.
     *
     * @param  \App\SchoolYear  $schoolYear
     * @return void
     */
    public function deleted(SchoolYear $schoolYear)
    {
        //
    }

    /**
     * Handle the school year "restored" event.
     *
     * @param  \App\SchoolYear  $schoolYear
     * @return void
     */
    public function restored(SchoolYear $schoolYear)
    {
        //
    }

    /**
     * Handle the school year "force deleted" event.
     *
     * @param  \App\SchoolYear  $schoolYear
     * @return void
     */
    public function forceDeleted(SchoolYear $schoolYear)
    {
        //
    }

    public function getToken()
    {
        return request()->bearerToken();
    }

    public function url()
    {
        return env('URL_CLOVER') . '/api/v1/school-years';
    }

    public function updateIdClover($data, $id)
    {
        Http::withToken($this->getToken())->put($this->url() . '/' . $id, $data);
    }
}
