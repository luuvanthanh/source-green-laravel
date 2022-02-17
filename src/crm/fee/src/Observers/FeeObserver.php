<?php

namespace GGPHP\Crm\Fee\Observers;

use GGPHP\Crm\Fee\Models\Fee;
use Illuminate\Support\Facades\Http;

class FeeObserver
{
    /**
     * Handle the school year "created" event.
     *
     * @param  \App\Fee  $fee
     * @return void
     */
    public function created(Fee $fee)
    {
        $data = [
            'FeeCrmId' => $fee->id
        ];

        $id = $fee->fee_clover_id;

        $this->updateIdClover($data, $id);
    }

    /**
     * Handle the school year "updated" event.
     *
     * @param  \App\Fee  $fee
     * @return void
     */
    public function updated(Fee $fee)
    {
        //
    }

    /**
     * Handle the school year "deleted" event.
     *
     * @param  \App\Fee  $fee
     * @return void
     */
    public function deleted(Fee $fee)
    {
        //
    }

    /**
     * Handle the school year "restored" event.
     *
     * @param  \App\Fee  $fee
     * @return void
     */
    public function restored(Fee $fee)
    {
        //
    }

    /**
     * Handle the school year "force deleted" event.
     *
     * @param  \App\Fee  $fee
     * @return void
     */
    public function forceDeleted(Fee $fee)
    {
        //
    }

    public function getToken()
    {
        return request()->bearerToken();
    }

    public function url()
    {
        return env('URL_CLOVER') . '/api/v1/fees';
    }

    public function updateIdClover($data, $id)
    {
        Http::withToken($this->getToken())->put($this->url() . '/' . $id, $data);
    }
}
