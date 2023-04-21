<?php

namespace GGPHP\InterviewManager\Transformers;

use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\InterviewManager\Models\Refund;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\SchoolYearTransformer;
use GGPHP\InterviewManager\Models\Interviewer;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class RefundTransformer.
 *
 * @package namespace GGPHP\InterviewManager\Transformers;
 */
class InterviewerTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['division', 'interviewerEmployee', 'configuation'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $usersuse =  $model->interviewerEmployee->toArray();
        $users= User::get()->toArray();
        $data = [];
        foreach ($users as $key => $value) {
            $newData = array_combine(
                array_map(function($key) { return lcfirst($key); }, array_keys($value)),
                array_values($value)
            );
            $data[] = $newData;
        }
        foreach ($usersuse as $key => $value) {
            foreach ($data as $key => $itemUser) {
                if ($value['Id'] == $itemUser['id']) {
                    $data[$key]['status'] = 'true';
                }else {
                    $data[$key]['status'] = 'false';
                }
            }
        }
        
        return [
            'employee' => $data
        ];
    }

    public function includeDivision(Interviewer $interviewer)
    {
        if (is_null($interviewer->division)) {
            return null;
        }

        return $this->item($interviewer->division, new DivisionTransformer, 'division');
    }

    public function includeInterviewerEmployee(Interviewer $interviewer)
    {
        return $this->collection($interviewer->interviewerEmployee, new InterviewerEmployeeTransformer, 'InterviewerEmployee');
    }

    public function includeConfiguation(Interviewer $interviewer)
    {
        return $this->collection($interviewer->configuation, new InterviewConfigurationTransformer, 'InterviewConfiguration');
    }
}
