<?php

namespace GGPHP\ActivityLog\Jobs;

use GGPHP\ActivityLog\Repositories\Eloquent\ActivityLogRepositoryEloquent;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ActivityLog
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    protected $data;



    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        resolve(ActivityLogRepositoryEloquent::class)->create($this->data);
    }
}
