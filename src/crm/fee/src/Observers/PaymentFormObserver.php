<?php

namespace GGPHP\Crm\Fee\Observers;

use GGPHP\Crm\Fee\Models\PaymentForm;
use Illuminate\Support\Facades\Http;

class PaymentFormObserver
{
    /**
     * Handle the school year "created" event.
     *
     * @param  \App\PaymentForm  $paymentForm
     * @return void
     */
    public function created(PaymentForm $paymentForm)
    {
        $data = [
            'PaymentFormCrmId' => $paymentForm->id
        ];

        $id = $paymentForm->payment_form_clover_id;

        $this->updateIdClover($data, $id);
    }

    /**
     * Handle the school year "updated" event.
     *
     * @param  \App\PaymentForm  $paymentForm
     * @return void
     */
    public function updated(PaymentForm $paymentForm)
    {
        //
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
     * @param  \App\PaymentForm  $paymentForm
     * @return void
     */
    public function forceDeleted(PaymentForm $paymentForm)
    {
        //
    }

    public function getToken()
    {
        return request()->bearerToken();
    }

    public function url()
    {
        return env('URL_CLOVER') . '/api/v1/payment-forms';
    }

    public function updateIdClover($data, $id)
    {
        Http::withToken($this->getToken())->put($this->url() . '/' . $id, $data);
    }
}
