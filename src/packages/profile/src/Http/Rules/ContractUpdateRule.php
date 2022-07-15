<?php

namespace GGPHP\Profile\Http\Rules;

use Illuminate\Contracts\Validation\Rule;

class ContractUpdateRule implements Rule
{
    protected $model;
    protected $numberForm;
    protected $idContract;

    public function __construct($model, $numberForm, $idContract)
    {
        $this->model = $model;
        $this->numberForm = $numberForm;
        $this->idContract = $idContract;
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
        $contract = $this->model::where('NumberForm', $this->numberForm)->where('Id', '!=', $this->idContract)->first();
        
        if (is_null($contract)) {
            return true;
        }

        if ($value == $contract->OrdinalNumber) {
            return false;
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Số thứ tự khác số đã có.';
    }
}
