<?php

namespace GGPHP\TravelAgency\Jobs;

use GGPHP\TravelAgency\Services\SyncTravelAgencyService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ImportTravelAgencyJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $page;
    protected $limit;
    protected $legacy;
    protected $token;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($page, $limit, $legacy, $token)
    {
        $this->page = $page;
        $this->limit = $limit;
        $this->legacy = $legacy;
        $this->token = $token;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        SyncTravelAgencyService::result($this->page, $this->limit, $this->token);
    }
}
