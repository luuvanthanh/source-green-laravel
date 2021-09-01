<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReceiveMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    // Broadcast channel
    public function broadcastOn()
    {
        return new PrivateChannel('user.' . $this->user->id);
    }

    // Broadcast name
    public function broadcastAs()
    {
        return 'receive_messages';
    }

    // Broadcast data
    public function broadcastWith()
    {
        return ['id' => $this->user->id];
    }

    // Broadcast conditions
    public function broadcastWhen()
    {
        return $this->user->type === self::TYPE_ABC;
    }
}
