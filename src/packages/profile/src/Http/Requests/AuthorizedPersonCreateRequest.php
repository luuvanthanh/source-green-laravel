<?php

namespace GGPHP\Profile\Http\Requests;

use GGPHP\Profile\Models\AuthorizedPerson;
use GGPHP\Profile\Repositories\Contracts\AuthorizedPersonRepository;
use Illuminate\Foundation\Http\FormRequest;

class AuthorizedPersonCreateRequest extends FormRequest
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
        return [
            'employeeId' => [
                'required',
                'exists:Employees,Id',
                function ($attribute, $value, $fail) {
                    $authorized = resolve(AuthorizedPersonRepository::class)->skipPresenter()->where([
                        ['EmployeeId', $value],
                        ['IsEffect', $this->isEffect]
                    ])->orWhere([
                        ['EmployeeId', $value],
                        ['IsEffect', $this->isEffect]
                    ])->count();

                    if ($authorized) {
                        return $fail('Nhân sự đã được áp dụng');
                    }
                }
            ],
            'dateApply' => 'required|date|date_format:Y-m-d',
            'powerOfAttorney' => 'nullable|sting',
            'isEffect' => 'required|boolean|in:true,1',
        ];
    }
}
