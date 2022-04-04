<?php

namespace GGPHP\Fee\Jobs;

use GGPHP\Fee\Services\FeePolicieCrmService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CreateFeePolicieCrmJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $feePolicie;
    protected $token;

    public function __construct($feePolicie, $token)
    {
        $this->token = $token;
        $this->feePolicie = $feePolicie;
    }

    public function handle()
    {
        FeePolicieCrmService::create($this->feePolicie, $this->token);
    }
}
