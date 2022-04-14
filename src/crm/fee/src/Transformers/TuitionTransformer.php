<?php

namespace GGPHP\Crm\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Fee\Models\Tuition;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class TuitionTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['chargeStudent', 'paymentForm', 'fee'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param  

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
            'expected_money' => $this->expectedMoney($model)
        ];
    }

    public function includeChargeStudent(Tuition $tuition)
    {
        if ($tuition->loadCount('chargeStudent')->charge_student_count < 1) {
            return null;
        }

        return $this->item($tuition->chargeStudent, new ChargeStudentTransformer, 'ChargeStudent');
    }

    public function includePaymentForm(Tuition $tuition)
    {
        if ($tuition->loadCount('paymentForm')->payment_form_count < 1) {
            return null;
        }

        return $this->item($tuition->paymentForm, new PaymentFormTransformer, 'PaymentForm');
    }

    public function includeFee(Tuition $tuition)
    {
        if ($tuition->loadCount('fee')->fee_count < 1) {
            return null;
        }

        return $this->item($tuition->fee, new FeeTransformer, 'Fee');
    }

    public function expectedMoney($model)
    {
        $chargeStudent = $model->chargeStudent;

        $expectedToCollectMoney = $chargeStudent->expected_to_collect_money;
        
        if (!empty($expectedToCollectMoney)) {
            $data = collect($expectedToCollectMoney)->map(function ($item) {
                return $item['fee'];
            });

            $data = $data->flatten(1);

            $money = $data->sum(function ($item) use ($model) {
                if ($model->fee_id != $item['fee_id_crm']) {
                    return $item['money'];
                }
            });

            return $money;
        }

        return (int) 0;
    }
}
