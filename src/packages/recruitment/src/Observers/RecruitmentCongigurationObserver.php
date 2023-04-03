<?php

namespace GGPHP\Recruitment\Observers;

use GGPHP\Recruitment\Services\RecruitmentQuestionService;
use GGPHP\Recruitment\Models\RecruitmentConfiguration;

class RecruitmentCongigurationObserver
{
    /**
     * Handle the charge old student "created" event.
     *
     * @param  \App\ChargeOldStudent  $chargeOldStudent
     * @return void
     */
    public function created(RecruitmentConfiguration $chargeOldStudent)
    {
        resolve(RecruitmentQuestionService::class)->createRecruitmentQuestion($chargeOldStudent);
    }

    /**
     * Handle the charge old student "updated" event.
     *
     * @param  \App\ChargeOldStudent  $chargeOldStudent
     * @return void
     */
    // public function updated(ChargeOldStudent $chargeOldStudent)
    // {
    //     $chargeOldStudent->expectedToCollectMoney()->delete();
    //     resolve(ExpectedToCollectMoneyService::class)->createExpectedToCollectionMoney($chargeOldStudent->ExpectedToCollectMoney, $chargeOldStudent->StudentId, $chargeOldStudent->Id);
    // }

    // /**
    //  * Handle the charge old student "deleted" event.
    //  *
    //  * @param  \App\ChargeOldStudent  $chargeOldStudent
    //  * @return void
    //  */
    // public function deleted(ChargeOldStudent $chargeOldStudent)
    // {
    //     $chargeOldStudent->expectedToCollectMoney()->delete();
    // }

    // /**
    //  * Handle the charge old student "restored" event.
    //  *
    //  * @param  \App\ChargeOldStudent  $chargeOldStudent
    //  * @return void
    //  */
    // public function restored(ChargeOldStudent $chargeOldStudent)
    // {
    //     //
    // }

    // /**
    //  * Handle the charge old student "force deleted" event.
    //  *
    //  * @param  \App\ChargeOldStudent  $chargeOldStudent
    //  * @return void
    //  */
    // public function forceDeleted(ChargeOldStudent $chargeOldStudent)
    // {
    //     //
    // }
}
