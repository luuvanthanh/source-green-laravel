<?php

namespace GGPHP\Camera\Events;

use Illuminate\Queue\SerializesModels;
use GGPHP\Camera\Models\Camera;

class CameraUpdated
{
    use SerializesModels;

    public $camera;

    /**
     * Camera updated
     *
     * @param Camera $camera
     */
    public function __construct(Camera $camera)
    {
        $this->camera = $camera;
    }

}