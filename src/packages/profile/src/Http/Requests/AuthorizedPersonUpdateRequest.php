<?php

namespace GGPHP\Profile\Http\Requests;

use GGPHP\Profile\Models\AuthorizedPerson;
use GGPHP\Profile\Repositories\Contracts\AuthorizedPersonRepository;
use Illuminate\Foundation\Http\FormRequest;

class AuthorizedPersonUpdateRequest extends FormRequest
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
            'powerOfAttorney' => 'nullable|string',
            'isEffect' => [
                'nullable',
                'boolean',
                function ($attribute, $value, $fail) {
                    if ($value) {
                        $authorized = resolve(AuthorizedPersonRepository::class)->skipPresenter()->find($this->route('authorized_person'));

                        $count = resolve(AuthorizedPersonRepository::class)->skipPresenter()->where([
                            ['EmployeeId', $authorized->EmployeeId],
                            ['IsEffect', '!=', $value]
                        ])->orWhere([
                            ['EmployeeId', $authorized->EmployeeId],
                            ['IsEffect', '!=', $value]
                        ])->where('Id', '!=', $authorized->Id)->count();

                        if ($count) {
                            return $fail('Nhân sự đã được áp dụng');
                        }
                    }
                }
            ],
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);

        unset($data['employeeId']);
        unset($data['dateApply']);

        return $data;
    }
}
