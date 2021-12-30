<?php

namespace GGPHP\DocumentManagement\Models;

use GGPHP\Clover\Models\Student;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class DocumentManagement extends UuidModel
{
    /**
     * Declare the table name
     */
    protected $table = 'DocumentManagements';

    const TYPE_DOCUMENT = [
        'CONG_VAN_DEN' => 0,
        'CONG_VAN_DI' => 1,
        'CONG_VAN_NOI_BO' => 2,
        'TAI_LIEU' => 3
    ];

    const TOPIC = [
        'THONG_BAO' => 0,
        'QUYET_DINH' => 1,
        'QUY_DINH' => 2,
        'TO_TRINH' => 3
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'TypeOfDocument', 'Topic', 'SentDivisionId', 'EmployeeId', 'BranchId', 'ReceiveDivisionId',
        'Title', 'Content', 'FileDocument'
    ];

    public function employee()
    {
        return $this->belongsToMany(User::class, 'DocumentManagementDetails', 'EmployeeId', 'DocumentManagementId');
    }
}
