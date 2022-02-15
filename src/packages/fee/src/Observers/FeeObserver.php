<?php

namespace GGPHP\Fee\Observers;

use GGPHP\Fee\Jobs\CreateFeeCrmJob;
use GGPHP\Fee\Jobs\UpdateFeeCrmJob;
use GGPHP\Fee\Models\Fee;

class FeeObserver
{
    /**
     * Handle the school year "created" event.
     *
     * @param  \App\Fee  $Fee
     * @return void
     */
    public function created(Fee $fee)
    {
        dispatch(new CreateFeeCrmJob($fee, $this->getToken()));
    }

    /**
     * Handle the school year "updated" event.
     *
     * @param  \App\Fee  $fee
     * @return void
     */
    public function updated(Fee $fee)
    {
        dispatch(new UpdateFeeCrmJob($fee, $fee->FeeCrmId, $this->getToken()));
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
     * @param  \App\Fee  $Fee
     * @return void
     */
    public function forceDeleted(Fee $Fee)
    {
        //
    }

    public function getToken()
    {
        return request()->bearerToken();
    }
}
