<?php

namespace GGPHP\Fee\Jobs;

use GGPHP\Fee\Services\FeePolicieCrmService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateFeePolicieCrmJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $feePolicie;
    protected $token;
    protected $feePolicieId;

    public function __construct($feePolicie, $feePolicieId, $token)
    {
        $this->token = $token;
        $this->feePolicie = $feePolicie;
        $this->feePolicieId = $feePolicieId;
    }

    public function handle()
    {
        FeePolicieCrmService::update($this->feePolicie, $this->feePolicieId, $this->token);
    }
}
