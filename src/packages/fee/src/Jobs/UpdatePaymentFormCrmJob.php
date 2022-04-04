<?php

namespace GGPHP\Fee\Jobs;

use GGPHP\Fee\Services\PaymentFormCrmService;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class UpdatePaymentFormCrmJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $paymentForm;
    protected $paymentFormCrmId;
    protected $token;

    public function __construct($paymentForm, $paymentFormCrmId, $token)
    {
        $this->paymentForm = $paymentForm;
        $this->paymentFormCrmId = $paymentFormCrmId;
        $this->token = $token;
    }

    public function handle()
    {
        PaymentFormCrmService::update($this->paymentForm, $this->paymentFormCrmId, $this->token);
    }
}
