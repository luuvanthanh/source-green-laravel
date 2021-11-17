<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use CloudCreativity\LaravelJsonApi\Exceptions\ValidationException;
use CloudCreativity\LaravelJsonApi\Document\Error\Translator;
use CloudCreativity\LaravelJsonApi\Validation\Validator;
use Illuminate\Translation;

class RegisterRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'email'      => 'required',
            'password'   => 'required|confirmed',
        ];
    }


    protected function failedValidation($validator)
    {
        $errors = (new Validator($validator, (new Translator(app('translator')))));
        throw ValidationException::create($errors);
    }
}
