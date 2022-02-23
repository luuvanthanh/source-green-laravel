<?php

namespace GGPHP\Crm\CustomerPotential\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatePotentialStudentInfoRequest extends FormRequest
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
            'createRows' => 'array',
            'updateRows' => 'array',
            'deleteRows' => 'array',
            'createRows.*.full_name' => 'required|string',
            'createRows.*.birth_date' => 'date_format:Y-m-d',
            'createRows.*.sex' => 'string',
            'createRows.*.category_relationship_id' => 'required|exists:category_relationships,id',
            'createRows.*.customer_potential_id' => 'required|exists:customer_potentials,id',
            'updateRows.*.full_name' => 'string',
            'updateRows.*.birth_date' => 'date_format:Y-m-d',
            'updateRows.*.sex' => 'string',
            'updateRows.*.customer_potential_id' => 'exists:customer_potentials,id',

        ];
    }
}
