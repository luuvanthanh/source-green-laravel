<?php

use Illuminate\Support\Facades\Route;

Route::group(['middleware' => []], function () {
    \ZK\RouteRegistrar::routes();
});

Route::get('test', function () {
    $confirm = \GGPHP\Approval\Models\ApprovalRequest::first();
    $workflow = Workflow::get($confirm, 'early_late_workflow');

    // dd($workflow->can($confirm, 'to_review')); // True
    $transitions = $workflow->getEnabledTransitions($confirm);
    dd($transitions);
    dd($workflow->apply($confirm, 'to_review'));
    dd($workflow->can($confirm, 'to_review'));
});
