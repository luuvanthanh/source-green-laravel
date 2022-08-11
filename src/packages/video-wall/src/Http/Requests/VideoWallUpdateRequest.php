<?php

namespace GGPHP\VideoWall\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use GGPHP\VideoWall\Models\VideoWall;

class VideoWallUpdateRequest extends FormRequest
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
            'name'               => 'sometimes|string|max:20',
            'display_type'       => 'sometimes|in:'. VideoWall::TYPE_2X2. ','. VideoWall::TYPE_3X3. ','. VideoWall::TYPE_4X4,
            'cameras'            => 'sometimes|array',
            'cameras.*.id'       => 'required|exists:cameras,id',
            'cameras.*.priority' => 'required|integer'
        ];
    }
}
