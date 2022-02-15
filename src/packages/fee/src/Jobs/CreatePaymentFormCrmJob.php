<?php

namespace GGPHP\Fee\Jobs;

use GGPHP\Fee\Services\PaymentFormCrmService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CreatePaymentFormCrmJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $paymentForm;
    protected $token;

    public function __construct($paymentForm, $token)
    {
        $this->token = $token;
        $this->paymentForm = $paymentForm;
    }

    public function handle()
    {
        PaymentFormCrmService::create($this->paymentForm, $this->token);
    }
}
