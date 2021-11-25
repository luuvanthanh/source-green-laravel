<?php

namespace GGPHP\Camera\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CollectionAddOrDeleteCameraRequest extends FormRequest
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
            'items_new' => 'present|array',
            'items_delete' => 'present|array',
            'collection_ids' => 'required|array',
            'collection_ids.*' => 'required|exists:collections,id',
        ];
    }
}
