<?php

namespace  GGPHP\VerificationCode\Models;

use GGPHP\Core\Models\UuidModel;

class VerificationCode extends UuidModel
{
    protected $table = 'verification_codes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'code'];
}
