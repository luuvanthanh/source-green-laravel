<?php

namespace GGPHP\Camera\Events;

use Illuminate\Queue\SerializesModels;
use GGPHP\Camera\Models\Camera;

class CameraAdded
{
    use SerializesModels;

    public $camera;

    /**
     * Camera added
     *
     * @param Camera $camera
     */
    public function __construct(Camera $camera)
    {
        $this->camera = $camera;
    }

}