<?php

namespace GGPHP\ChildDevelop\TestSemester\Http\Requests;

use GGPHP\ChildDevelop\TestSemester\Models\TestSemester;
use Illuminate\Foundation\Http\FormRequest;

class TestSemesterUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [];
    }

    public function all($keys = null)
    {
        $data = Parent::all();

        if (!empty($data['status'])) {
            $data['status'] = TestSemester::STATUS[$data['status']];
        }

        if (!empty($data['approvalStatus'])) {
            $data['approvalStatus'] = TestSemester::APPROVAL_STATUS[$data['approvalStatus']];
        }

        return $data;
    }
}
