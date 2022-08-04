<?php

namespace GGPHP\Fee\Services;

use Carbon\Carbon;
use GGPHP\Fee\Models\ExpectedToCollectMoney;

class ExpectedToCollectMoneyService
{
    public function createExpectedToCollectionMoney($data, $studentId, $chargeOldStudentId)
    {
        foreach ($data as $valueData) {
            foreach ($valueData['fee'] as $value) {

                $dataCustom = [
                    'month' => Carbon::parse($valueData['month'])->format('Y-m-d'),
                    'studentId' => $studentId,
                    'chargeOldStudentId' => $chargeOldStudentId,
                    'name' => $value['fee_name'],
                    'money' => $value['money'],
                    'feeId' => $value['fee_id']
                ];
                ExpectedToCollectMoney::create($dataCustom);
            }
        }
    }
}
