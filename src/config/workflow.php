<?php

return [
    // 'fault_workflow' => [
    //     'type' => 'state_machine', // or 'state_machine'
    //     'marking_store' => [
    //         'type' => 'single_state', // or 'single_state'
    //         'property' => 'transition',
    //         // 'class' => MethodMarkingStore::class, // you may omit for default, or set to override marking store class
    //     ],
    //     'supports' => ['GGPHP\Approval\Models\ApprovalRequest'],
    //     'initial_places' => \GGPHP\Faults\Models\Fault::PENDING,
    //     'places' => [
    //         \GGPHP\Faults\Models\Fault::PENDING,
    //         'PRE_APPROVED',
    //         'PRE_DECLINED',
    //         \GGPHP\Faults\Models\Fault::APPROVED,
    //         \GGPHP\Faults\Models\Fault::DECLINED,
    //         \GGPHP\Faults\Models\Fault::CANCELED
    //     ],
    //     'transitions' => [
    //         'pre_approve' => [
    //             'from' => \GGPHP\Faults\Models\Fault::PENDING,
    //             'to' => 'PRE_APPROVED'
    //         ],
    //         'pre_decline' => [
    //             'from' => \GGPHP\Faults\Models\Fault::PENDING,
    //             'to' => 'PRE_DECLINED'
    //         ],
    //         'approve' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\Faults\Models\Fault::APPROVED
    //         ],
    //         'decline' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\Faults\Models\Fault::DECLINED
    //         ],
    //         'cancel' => [
    //             'from' => \GGPHP\Faults\Models\Fault::APPROVED,
    //             'to' => \GGPHP\Faults\Models\Fault::CANCELED
    //         ]
    //     ],
    // ],
    // 'early_late_workflow' => [
    //     'type' => 'state_machine', // or 'state_machine'
    //     'marking_store' => [
    //         'type' => 'single_state', // or 'single_state'
    //         'property' => 'transition', // this is the property on the model
    //         // 'class' => MethodMarkingStore::class, // you may omit for default, or set to override marking store class
    //     ],
    //     'supports' => ['GGPHP\Approval\Models\ApprovalRequest'],
    //     'initial_place' => \GGPHP\LateEarly\Models\LateEarly::PENDING,
    //     'places' => [
    //         \GGPHP\LateEarly\Models\LateEarly::PENDING,
    //         'PRE_APPROVED',
    //         'PRE_DECLINED',
    //         \GGPHP\LateEarly\Models\LateEarly::APPROVED,
    //         \GGPHP\LateEarly\Models\LateEarly::DECLINED,
    //         \GGPHP\LateEarly\Models\LateEarly::CANCELED,
    //     ],
    //     'transitions' => [
    //         'pre_approve' => [
    //             'from' => \GGPHP\LateEarly\Models\LateEarly::PENDING,
    //             'to' => 'PRE_APPROVED'
    //         ],
    //         'pre_decline' => [
    //             'from' => \GGPHP\LateEarly\Models\LateEarly::PENDING,
    //             'to' => 'PRE_DECLINED'
    //         ],
    //         'approve' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\LateEarly\Models\LateEarly::APPROVED
    //         ],
    //         'decline' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\LateEarly\Models\LateEarly::DECLINED
    //         ],
    //         'cancel' => [
    //             'from' => \GGPHP\LateEarly\Models\LateEarly::APPROVED,
    //             'to' => \GGPHP\LateEarly\Models\LateEarly::CANCELED
    //         ]
    //     ],
    // ],
    // 'absent_workflow' => [
    //     'type' => 'state_machine', // or 'state_machine'
    //     'marking_store' => [
    //         'type' => 'single_state', // or 'single_state'
    //         'property' => 'transition', // this is the property on the model
    //         // 'class' => MethodMarkingStore::class, // you may omit for default, or set to override marking store class
    //     ],
    //     'supports' => ['GGPHP\Approval\Models\ApprovalRequest'],
    //     'initial_place' => \GGPHP\Absent\Models\Absent::PENDING,
    //     'places' => [
    //         \GGPHP\Absent\Models\Absent::PENDING,
    //         'PRE_APPROVED',
    //         'PRE_DECLINED',
    //         \GGPHP\Absent\Models\Absent::APPROVED,
    //         \GGPHP\Absent\Models\Absent::DECLINED,
    //         \GGPHP\Absent\Models\Absent::CANCELED,
    //     ],
    //     'transitions' => [
    //         'pre_approve' => [
    //             'from' => \GGPHP\Absent\Models\Absent::PENDING,
    //             'to' => 'PRE_APPROVED'
    //         ],
    //         'pre_decline' => [
    //             'from' => \GGPHP\Absent\Models\Absent::PENDING,
    //             'to' => 'PRE_DECLINED'
    //         ],
    //         'approve' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\Absent\Models\Absent::APPROVED
    //         ],
    //         'decline' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\Absent\Models\Absent::DECLINED
    //         ],
    //         'cancel' => [
    //             'from' => \GGPHP\Absent\Models\Absent::APPROVED,
    //             'to' => \GGPHP\Absent\Models\Absent::CANCELED
    //         ]
    //     ],
    // ],
    // 'suggest_workflow' => [
    //     'type' => 'state_machine', // or 'state_machine'
    //     'marking_store' => [
    //         'type' => 'single_state', // or 'single_state'
    //         'property' => 'transition', // this is the property on the model
    //         // 'class' => MethodMarkingStore::class, // you may omit for default, or set to override marking store class
    //     ],
    //     'supports' => ['GGPHP\Approval\Models\ApprovalRequest'],
    //     'initial_place' => \GGPHP\Suggest\Models\Suggest::PENDING,
    //     'places' => [
    //         \GGPHP\Suggest\Models\Suggest::PENDING,
    //         'PRE_APPROVED',
    //         'PRE_DECLINED',
    //         \GGPHP\Suggest\Models\Suggest::APPROVED,
    //         \GGPHP\Suggest\Models\Suggest::DECLINED,
    //         \GGPHP\Suggest\Models\Suggest::CANCELED,
    //     ],
    //     'transitions' => [
    //         'pre_approve' => [
    //             'from' => \GGPHP\Suggest\Models\Suggest::PENDING,
    //             'to' => 'PRE_APPROVED'
    //         ],
    //         'pre_decline' => [
    //             'from' => \GGPHP\Suggest\Models\Suggest::PENDING,
    //             'to' => 'PRE_DECLINED'
    //         ],
    //         'approve' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\Suggest\Models\Suggest::APPROVED
    //         ],
    //         'decline' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\Suggest\Models\Suggest::DECLINED
    //         ],
    //         'cancel' => [
    //             'from' => \GGPHP\Suggest\Models\Suggest::APPROVED,
    //             'to' => \GGPHP\Suggest\Models\Suggest::CANCELED
    //         ]
    //     ],
    // ],
    // 'sub_suggest_workflow' => [
    //     'type' => 'state_machine', // or 'state_machine'
    //     'marking_store' => [
    //         'type' => 'single_state', // or 'single_state'
    //         'property' => 'transition', // this is the property on the model
    //         // 'class' => MethodMarkingStore::class, // you may omit for default, or set to override marking store class
    //     ],
    //     'supports' => ['GGPHP\Approval\Models\ApprovalRequest'],
    //     'initial_place' => 'PRE_APPROVED',
    //     'places' => [
    //         'PRE_APPROVED',
    //         \GGPHP\Suggest\Models\Suggest::APPROVED,
    //         \GGPHP\Suggest\Models\Suggest::DECLINED,
    //         \GGPHP\Suggest\Models\Suggest::CANCELED,
    //     ],
    //     'transitions' => [
    //         'decline' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\Suggest\Models\Suggest::DECLINED
    //         ],
    //         'approve' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\Suggest\Models\Suggest::APPROVED
    //         ],
    //         'cancel' => [
    //             'from' => \GGPHP\Suggest\Models\Suggest::APPROVED,
    //             'to' => \GGPHP\Suggest\Models\Suggest::CANCELED
    //         ]
    //     ],
    // ],
    // 'shift_request_workflow' => [
    //     'type' => 'state_machine', // or 'state_machine'
    //     'marking_store' => [
    //         'type' => 'single_state', // or 'single_state'
    //         'property' => 'transition', // this is the property on the model
    //         // 'class' => MethodMarkingStore::class, // you may omit for default, or set to override marking store class
    //     ],
    //     'supports' => ['GGPHP\Approval\Models\ApprovalRequest'],
    //     'initial_place' => GGPHP\ShiftSchedule\Models\ScheduleRequest::PENDING,
    //     'places' => [
    //         \GGPHP\ShiftSchedule\Models\ScheduleRequest::PENDING,
    //         'PRE_APPROVED',
    //         'PRE_DECLINED',
    //         \GGPHP\ShiftSchedule\Models\ScheduleRequest::APPROVED,
    //         \GGPHP\ShiftSchedule\Models\ScheduleRequest::DECLINED,
    //         \GGPHP\ShiftSchedule\Models\ScheduleRequest::CANCELED,
    //     ],
    //     'transitions' => [
    //         'pre_approve' => [
    //             'from' => \GGPHP\ShiftSchedule\Models\ScheduleRequest::PENDING,
    //             'to' => 'PRE_APPROVED'
    //         ],
    //         'pre_decline' => [
    //             'from' => \GGPHP\ShiftSchedule\Models\ScheduleRequest::PENDING,
    //             'to' => 'PRE_DECLINED'
    //         ],
    //         'approve' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\ShiftSchedule\Models\ScheduleRequest::APPROVED
    //         ],
    //         'decline' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\ShiftSchedule\Models\ScheduleRequest::DECLINED
    //         ],
    //         'cancel' => [
    //             'from' => \GGPHP\ShiftSchedule\Models\ScheduleRequest::APPROVED,
    //             'to' => \GGPHP\ShiftSchedule\Models\ScheduleRequest::CANCELED
    //         ]
    //     ],
    // ],
    // 'review_personal_target_workflow' => [
    //     'type' => 'state_machine', // or 'state_machine'
    //     'marking_store' => [
    //         'type' => 'single_state', // or 'single_state'
    //         'property' => 'transition', // this is the property on the model
    //         // 'class' => MethodMarkingStore::class, // you may omit for default, or set to override marking store class
    //     ],
    //     'supports' => ['GGPHP\Approval\Models\ApprovalRequest'],
    //     'initial_place' => GGPHP\Review\Models\ReviewPersonalTarget::PENDING,
    //     'places' => [
    //         \GGPHP\Review\Models\ReviewPersonalTarget::PENDING,
    //         'PRE_APPROVED',
    //         'PRE_DECLINED',
    //         \GGPHP\Review\Models\ReviewPersonalTarget::APPROVED,
    //         \GGPHP\Review\Models\ReviewPersonalTarget::DECLINED,
    //         \GGPHP\Review\Models\ReviewPersonalTarget::CANCELED,
    //     ],
    //     'transitions' => [
    //         'pre_approve' => [
    //             'from' => \GGPHP\Review\Models\ReviewPersonalTarget::PENDING,
    //             'to' => 'PRE_APPROVED'
    //         ],
    //         'pre_decline' => [
    //             'from' => \GGPHP\Review\Models\ReviewPersonalTarget::PENDING,
    //             'to' => 'PRE_DECLINED'
    //         ],
    //         'approve' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\Review\Models\ReviewPersonalTarget::APPROVED
    //         ],
    //         'decline' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\Review\Models\ReviewPersonalTarget::DECLINED
    //         ],
    //         'cancel' => [
    //             'from' => \GGPHP\Review\Models\ReviewPersonalTarget::APPROVED,
    //             'to' => \GGPHP\Review\Models\ReviewPersonalTarget::CANCELED
    //         ]
    //     ],
    // ],
    // 'review_productivity_workflow' => [
    //     'type' => 'state_machine', // or 'state_machine'
    //     'marking_store' => [
    //         'type' => 'single_state', // or 'single_state'
    //         'property' => 'transition', // this is the property on the model
    //         // 'class' => MethodMarkingStore::class, // you may omit for default, or set to override marking store class
    //     ],
    //     'supports' => ['GGPHP\Approval\Models\ApprovalRequest'],
    //     'initial_place' => 'PRE_APPROVED',
    //     'places' => [
    //         'PRE_APPROVED',
    //         'PRE_DECLINED',
    //         \GGPHP\Review\Models\ReviewProductivity::APPROVED,
    //         \GGPHP\Review\Models\ReviewProductivity::DECLINED,
    //         \GGPHP\Review\Models\ReviewProductivity::CANCELED,
    //     ],
    //     'transitions' => [
    //         'approve' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\Review\Models\ReviewProductivity::APPROVED
    //         ],
    //         'decline' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\Review\Models\ReviewProductivity::DECLINED
    //         ],
    //         'cancel' => [
    //             'from' => \GGPHP\Review\Models\ReviewProductivity::APPROVED,
    //             'to' => \GGPHP\Review\Models\ReviewProductivity::CANCELED
    //         ]
    //     ],
    // ],
    // 'additional_time_workflow' => [
    //     'type' => 'state_machine', // or 'state_machine'
    //     'marking_store' => [
    //         'type' => 'single_state', // or 'single_state'
    //         'property' => 'transition', // this is the property on the model
    //         // 'class' => MethodMarkingStore::class, // you may omit for default, or set to override marking store class
    //     ],
    //     'supports' => ['GGPHP\Approval\Models\ApprovalRequest'],
    //     'initial_place' => 'PRE_APPROVED',
    //     'places' => [
    //         'PRE_APPROVED',
    //         'PRE_DECLINED',
    //         \GGPHP\AdditionalTime\Models\AdditionalTime::APPROVED,
    //         \GGPHP\AdditionalTime\Models\AdditionalTime::DECLINED,
    //         \GGPHP\AdditionalTime\Models\AdditionalTime::CANCELED,
    //     ],
    //     'transitions' => [
    //         'approve' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\AdditionalTime\Models\AdditionalTime::APPROVED
    //         ],
    //         'decline' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\AdditionalTime\Models\AdditionalTime::DECLINED
    //         ],
    //         'cancel' => [
    //             'from' => \GGPHP\AdditionalTime\Models\AdditionalTime::APPROVED,
    //             'to' => \GGPHP\AdditionalTime\Models\AdditionalTime::CANCELED
    //         ]
    //     ],
    // ],
    // 'subtraction_time_workflow' => [
    //     'type' => 'state_machine', // or 'state_machine'
    //     'marking_store' => [
    //         'type' => 'single_state', // or 'single_state'
    //         'property' => 'transition', // this is the property on the model
    //         // 'class' => MethodMarkingStore::class, // you may omit for default, or set to override marking store class
    //     ],
    //     'supports' => ['GGPHP\Approval\Models\ApprovalRequest'],
    //     'initial_place' => 'PRE_APPROVED',
    //     'places' => [
    //         'PRE_APPROVED',
    //         'PRE_DECLINED',
    //         \GGPHP\SubtractionTime\Models\SubtractionTime::APPROVED,
    //         \GGPHP\SubtractionTime\Models\SubtractionTime::DECLINED,
    //         \GGPHP\SubtractionTime\Models\SubtractionTime::CANCELED,
    //     ],
    //     'transitions' => [
    //         'approve' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\SubtractionTime\Models\SubtractionTime::APPROVED
    //         ],
    //         'decline' => [
    //             'from' => 'PRE_APPROVED',
    //             'to' => \GGPHP\SubtractionTime\Models\SubtractionTime::DECLINED
    //         ],
    //         'cancel' => [
    //             'from' => \GGPHP\SubtractionTime\Models\SubtractionTime::APPROVED,
    //             'to' => \GGPHP\SubtractionTime\Models\SubtractionTime::CANCELED
    //         ]
    //     ],
    // ],
];
