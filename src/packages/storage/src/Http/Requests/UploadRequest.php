<?php

namespace GGPHP\Storage\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadRequest extends FormRequest
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
            'file' => 'required_without:files|file|mimes:jpeg,jpg,png,docx,doc,pdf,xlsx',
            'files' => 'required_without:file|array',
            'files.*' => 'required|file|mimes:jpeg,jpg,png,docx,doc,pdf,xlsx',
        ];
    }
}
