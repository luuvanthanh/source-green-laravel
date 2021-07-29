<?php

namespace GGPHP\Children\Models;

use Carbon\Carbon;
use GGPHP\Children\Presenters\ChildrenPresenter;
use GGPHP\Core\Models\UuidModel;

class Children extends UuidModel
{
    public $incrementing = false;

    protected $appends = ['months'];

    /**
     * Declare the table name
     */
    protected $table = 'Childrens';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'FullName', 'Gender', 'Birthday', 'Status', 'Relationship', 'IsDependentPerson'
    ];

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateTimeFormat = 'c';

    protected $dateTimeFields = [
        'Birthday',
    ];

    protected $presenter = ChildrenPresenter::class;

    /**
     * Define relations user
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }

    /**
     * Define relations user
     */
    public function getMonthsAttribute()
    {
        $birthday = Carbon::parse($this->birthday);
        $months = $birthday->diffInMonths() + number_format($birthday->diff()->d / 30, 1);

        return $this->attributes['months'] = $months;
    }
}
