<?php

namespace GGPHP\Crm\AdmissionRegister\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\ChildDevelop\Models\ChildEvaluate;
use GGPHP\Crm\ChildDevelop\Models\ChildEvaluateDetail;
use GGPHP\Crm\ChildDevelop\Models\ChildEvaluateDetailChildrent;

class TestInputDetailChildren extends UuidModel
{
    protected $table = 'test_input_detail_childrens';

    protected $fillable = [
        'child_evaluate_detail_children_id', 'child_evaluate_detail_id', 'test_input_detail_id', 'child_evalua_id'
    ];

    public function testInputDetail()
    {
        return $this->belongsTo(TestInputDetail::class, 'test_input_detail_id');
    }

    public function childEvaluateDetailChildren()
    {
        return $this->belongsTo(ChildEvaluateDetailChildrent::class, 'child_evaluate_detail_children_id');
    }

    public function childEvaluateDetail()
    {
        return $this->belongsTo(ChildEvaluateDetail::class, 'child_evaluate_detail_id');
    }

    public function childEvaluate()
    {
        return $this->belongsTo(ChildEvaluate::class, 'child_evalue_id');
    }
}
