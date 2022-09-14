<?php

namespace GGPHP\TourGuide\Jobs;

use GGPHP\TourGuide\Services\SyncTourGuideService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ImportTourGuideJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $page;
    protected $limit;
    protected $type;
    protected $legacy;
    protected $token;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($page, $limit, $type, $legacy, $token)
    {
        $this->page = $page;
        $this->limit = $limit;
        $this->type = $type;
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
        switch ($this->type) {
            case 'NEW':
                SyncTourGuideService::result($this->page, $this->limit, $this->token);
                break;
            case 'ADD_IMAGE':
                SyncTourGuideService::insertImage($this->legacy, $this->token);
                break;
        }
    }
}
