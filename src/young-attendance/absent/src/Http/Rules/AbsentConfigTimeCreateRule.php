<?php

namespace GGPHP\YoungAttendance\Absent\Http\Rules;

use Illuminate\Contracts\Validation\Rule;

class AbsentConfigTimeCreateRule implements Rule
{

    protected $data;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        unset($this->data['deleteRows']);
        $getData = call_user_func_array('array_merge', $this->data);

        foreach ($getData as $value) {
            if (!empty($value['id']) || !empty($value['type']) || !empty($value['advanceNotice'])) {
                unset($value['id']);
                unset($value['type']);
                unset($value['advanceNotice']);
            }
            $data[] = $value;
        }

        foreach ($data as $valueFirst) {

            array_shift($data);

            foreach ($data as $valueSecond) {

                $checkValue = $this->arrays_are_equal($valueFirst, $valueSecond);
                if ($checkValue) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Cấu hình xin phép không được trùng nhau.';
    }

    public static function arrays_are_equal($array1, $array2)
    {
        array_multisort($array1);
        array_multisort($array2);
        return (serialize($array1) === serialize($array2));
    }
}
