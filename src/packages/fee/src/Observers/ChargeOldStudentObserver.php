<?php

namespace GGPHP\Fee\Observers;

use GGPHP\Fee\Models\ChargeOldStudent;
use GGPHP\Fee\Services\ExpectedToCollectMoneyService;

class ChargeOldStudentObserver
{
    /**
     * Handle the charge old student "created" event.
     *
     * @param  \App\ChargeOldStudent  $chargeOldStudent
     * @return void
     */
    public function created(ChargeOldStudent $chargeOldStudent)
    {
        resolve(ExpectedToCollectMoneyService::class)->createExpectedToCollectionMoney($chargeOldStudent->ExpectedToCollectMoney, $chargeOldStudent->StudentId, $chargeOldStudent->Id);
    }

    /**
     * Handle the charge old student "updated" event.
     *
     * @param  \App\ChargeOldStudent  $chargeOldStudent
     * @return void
     */
    public function updated(ChargeOldStudent $chargeOldStudent)
    {
        $chargeOldStudent->expectedToCollectMoney()->delete();
        resolve(ExpectedToCollectMoneyService::class)->createExpectedToCollectionMoney($chargeOldStudent->ExpectedToCollectMoney, $chargeOldStudent->StudentId, $chargeOldStudent->Id);
    }

    /**
     * Handle the charge old student "deleted" event.
     *
     * @param  \App\ChargeOldStudent  $chargeOldStudent
     * @return void
     */
    public function deleted(ChargeOldStudent $chargeOldStudent)
    {
        $chargeOldStudent->expectedToCollectMoney()->delete();
    }

    /**
     * Handle the charge old student "restored" event.
     *
     * @param  \App\ChargeOldStudent  $chargeOldStudent
     * @return void
     */
    public function restored(ChargeOldStudent $chargeOldStudent)
    {
        //
    }

    /**
     * Handle the charge old student "force deleted" event.
     *
     * @param  \App\ChargeOldStudent  $chargeOldStudent
     * @return void
     */
    public function forceDeleted(ChargeOldStudent $chargeOldStudent)
    {
        //
    }
}
