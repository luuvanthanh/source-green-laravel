<?php

namespace GGPHP\Camera\Events;

use Illuminate\Queue\SerializesModels;
use GGPHP\Camera\Models\Camera;

class CameraDeleted
{
    use SerializesModels;

    public $camera;

    /**
     * Camera deleted
     *
     * @param Camera $camera
     */
    public function __construct(Camera $camera)
    {
        $this->camera = $camera;
    }
}
