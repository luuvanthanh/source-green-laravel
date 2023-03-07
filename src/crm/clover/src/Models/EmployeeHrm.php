<?php

namespace GGPHP\Crm\Clover\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;

class EmployeeHrm extends UuidModel
{
    protected $table = 'hrm.Employees';

    protected $fillable = [
        'FullName', 'DateOfBirth', 'PlaceOfBirth', 'Email', 'PhoneNumber', 'Gender', 'Code', 'TaxCode', 'DegreeId',
        'TrainingMajorId', 'TrainingSchoolId', 'DateOff', 'PermanentAddress', 'Nationality',
        'Nation', 'IdCard', 'DateOfIssueIdCard', 'PlaceOfIssueIdCard', 'Religion', 'WorkDate',
        'HealthInsuranceBookNumber', 'HospitalAddress', 'SocialInsuranceBooknumber', 'BankName',
        'BankNumberOfAccount', 'Note', 'MaternityLeave', 'MaternityLeaveFrom', 'MaternityLeaveTo',
        'EducationalLevelId', 'Address', 'Status', 'FingerprintId', 'FileImage', 'Married', 'EmployeeIdCrm', 'AccountantId', 'Description',
        'FileAttached', 'IsForeigner', 'LastName', 'Signature'
    ];
}
