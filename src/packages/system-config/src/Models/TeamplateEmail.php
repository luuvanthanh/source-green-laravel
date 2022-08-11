<?php

namespace  GGPHP\SystemConfig\Models;

use GGPHP\Core\Models\UuidModel;

class TeamplateEmail extends UuidModel
{
    protected $table = 'list_config_teamplate_email';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['system_config_id', 'name', 'code', 'is_on', 'title', 'content'];

    protected $casts = [
        'is_on' => 'boolean'
    ];

    public function emailVariable()
    {
        return $this->belongsToMany(EmailVariable::class, 'teamplate_email_variable', 'teamplate_email_id', 'variable_id');
    }
}
