<?php

namespace GGPHP\VideoWall\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use GGPHP\VideoWall\Models\VideoWall;

class VideoWallCreateRequest extends FormRequest
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
            'name'         => 'required|string|max:20',
        ];
    }
}
