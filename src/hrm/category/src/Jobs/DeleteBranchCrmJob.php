<?php

namespace GGPHP\Category\Jobs;

use GGPHP\Category\Services\DeleteBranchCrmServices;
use GGPHP\Category\Services\UpdateBranchCrmService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DeleteBranchCrmJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $token;
    protected $id;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($token, $id)
    {
        $this->token = $token;
        $this->id = $id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        DeleteBranchCrmServices::deleteBranchCrm($this->token, $this->id);
    }
}
