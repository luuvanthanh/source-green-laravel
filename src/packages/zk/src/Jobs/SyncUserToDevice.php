<?php

namespace ZK\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SyncUserToDevice implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $user;
    public $devices;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($user, $devices)
    {
        $this->user = $user;
        $this->devices = $devices;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            foreach ($this->devices as $device) {
                $zk = new \ZK\Driver\ZKLib($device->ip, $device->port);
                //connect to device
                $zk->connect();
                //set user from server to device
                $zk->setUser($this->user->id, $this->user->id, $this->user->full_name, '', \ZK\Driver\Util::LEVEL_USER);
                //disconnect
                $zk->disconnect();
            }
        } catch (\Exception $e) {
            \Log::info($e);
        }
    }
}
