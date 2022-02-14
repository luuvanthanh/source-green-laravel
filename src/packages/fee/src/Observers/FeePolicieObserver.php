<?php

namespace GGPHP\Fee\Observers;

use GGPHP\Fee\Jobs\CreateFeePolicieCrmJob;
use GGPHP\Fee\Jobs\UpdateFeePolicieCrmJob;
use GGPHP\Fee\Models\FeePolicie;

class FeePolicieObserver
{
    /**
     * Handle the school year "created" event.
     *
     * @param  \App\Fee  $Fee
     * @return void
     */
    public function created(FeePolicie $feePolice)
    {
        dispatch(new CreateFeePolicieCrmJob($feePolice, $this->getToken()));
    }

    /**
     * Handle the school year "updated" event.
     *
     * @param  \App\Fee  $feePolice
     * @return void
     */
    public function updated(FeePolicie $feePolice)
    {
        dispatch(new UpdateFeePolicieCrmJob($feePolice, $feePolice->FeePolicieCrmId, $this->getToken()));
    }

    /**
     * Handle the school year "deleted" event.
     *
     * @param  \App\Fee  $feePolice
     * @return void
     */
    public function deleted(FeePolicie $feePolice)
    {
        //
    }

    /**
     * Handle the school year "restored" event.
     *
     * @param  \App\Fee  $feePolice
     * @return void
     */
    public function restored(FeePolicie $feePolice)
    {
        //
    }

    /**
     * Handle the school year "force deleted" event.
     *
     * @param  \App\Fee  $Fee
     * @return void
     */
    public function forceDeleted(FeePolicie $Fee)
    {
        //
    }

    public function getToken()
    {
        return request()->bearerToken();
    }
}
