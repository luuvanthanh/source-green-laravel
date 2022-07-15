<?php

namespace GGPHP\Profile\Http\Rules;

use GGPHP\Profile\Models\NumberFormContract;
use Illuminate\Contracts\Validation\Rule;

class ContractCreateRule implements Rule
{
    protected $numberFormContractId;

    public function __construct($numberFormContractId)
    {
        $this->numberFormContractId = $numberFormContractId;
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
        $numberFormContract = NumberFormContract::findOrFail($this->numberFormContractId);

        if ($value == $numberFormContract->OrdinalNumber) {
            return false;
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
        return 'Số thứ tự khác số đã có.';
    }
}
