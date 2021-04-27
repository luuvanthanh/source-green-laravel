<?php

namespace GGPHP\OtherDeclaration\Models;

use GGPHP\Core\Models\UuidModel;

class OtherDeclaration extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'OtherDeclarations';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'NumberOfWorkdays', 'Time',
    ];

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function otherDeclarationDetail()
    {
        return $this->hasMany(\GGPHP\OtherDeclaration\Models\OtherDeclarationDetail::class, 'OtherDeclarationId');
    }

}
