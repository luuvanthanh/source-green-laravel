<?php

namespace GGPHP\Fee\Observers;

use GGPHP\Fee\Jobs\CreatePaymentFormCrmJob;
use GGPHP\Fee\Jobs\UpdatePaymentFormCrmJob;
use GGPHP\Fee\Models\PaymentForm;

class PaymentFormObserver
{
    /**
     * Handle the school year "created" event.
     *
     * @param  \App\PaymentForm  $PaymentForm
     * @return void
     */
    public function created(PaymentForm $paymentForm)
    {
        dispatch(new CreatePaymentFormCrmJob($paymentForm, $this->getToken()));
    }

    /**
     * Handle the school year "updated" event.
     *
     * @param  \App\PaymentForm  $paymentForm
     * @return void
     */
    public function updated(PaymentForm $paymentForm)
    {
        dispatch(new UpdatePaymentFormCrmJob($paymentForm, $paymentForm->PaymentFormCrmId, $this->getToken()));
    }

    /**
     * Handle the school year "deleted" event.
     *
     * @param  \App\PaymentForm  $paymentForm
     * @return void
     */
    public function deleted(PaymentForm $paymentForm)
    {
        //
    }

    /**
     * Handle the school year "restored" event.
     *
     * @param  \App\PaymentForm  $paymentForm
     * @return void
     */
    public function restored(PaymentForm $paymentForm)
    {
        //
    }

    /**
     * Handle the school year "force deleted" event.
     *
     * @param  \App\PaymentForm  $Fee
     * @return void
     */
    public function forceDeleted(PaymentForm $Fee)
    {
        //
    }

    public function getToken()
    {
        return request()->bearerToken();
    }
}
