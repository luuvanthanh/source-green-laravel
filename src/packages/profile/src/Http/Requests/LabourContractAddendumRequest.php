<?php

namespace GGPHP\Profile\Http\Requests;

use GGPHP\Profile\Repositories\Contracts\LabourContractRepository;
use Illuminate\Foundation\Http\FormRequest;

class LabourContractAddendumRequest extends FormRequest
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
            'contract' => function ($attribute, $value, $fail) {
                $contract = resolve(LabourContractRepository::class)->skipPresenter()->find($value);

                if (!$contract->ContractDate) {
                    return $fail('Hợp đồng chưa hoàn thành');
                }

                return true;
            }
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);

        $data['contract'] = $this->route('labour_contract_id');

        return $data;
    }
}
