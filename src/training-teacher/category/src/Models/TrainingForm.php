<?php

namespace GGPHP\TrainingTeacher\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class TrainingForm extends UuidModel
{
    /**
     * Declare the table name
     */
    protected $table = 'evaluate_teacher.TrainingForms';

    const TYPE_TRAINING = [
        'SEFT_LEARNING' => 1,
        'TRAINING_ONINE' => 2,
        'TRAINING_OFFLINE' => 3,
        'PRACTICE' => 4
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name', 'Note', 'Type'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function trainingSkillDetail()
    {
        return $this->hasMany(TrainingSkillDetail::class, 'TrainingFormId');
    }
}
