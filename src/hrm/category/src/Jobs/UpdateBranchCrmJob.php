<?php

namespace GGPHP\Category\Jobs;

use GGPHP\Category\Services\UpdateBranchCrmService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateBranchCrmJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $token;
    protected $data;
    protected $id;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($token, $data, $id)
    {
        $this->token = $token;
        $this->data = $data;
        $this->id = $id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        UpdateBranchCrmService::updateBranchCrm($this->token, $this->data, $this->id);
    }
}
