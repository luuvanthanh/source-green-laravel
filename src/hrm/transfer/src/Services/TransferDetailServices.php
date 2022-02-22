<?php

namespace GGPHP\Transfer\Services;

use GGPHP\PositionLevel\Repositories\Eloquent\PositionLevelRepositoryEloquent;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\Transfer\Models\TransferDetail;

class TransferDetailServices
{
    /**
     * @param $attributes
     * @return bool
     */
    public static function add($id, $attributes, $timeApply)
    {
        foreach ($attributes as $value) {
            $value['TransferId'] = $id;
            $transferDetail = TransferDetail::create($value);

            $dataPosition = [
                'employeeId' => $value['employeeId'],
                'branchId' => $value['branchId'],
                'positionId' => $value['positionId'],
                'divisionId' => $value['divisionId'],
                'startDate' => $timeApply->format('Y-m-d'),
                'type' => 'TRANFER',
                'modelId' => $transferDetail->Id,
                'modelType' => TransferDetail::class,
            ];

            $positionLevelRepository = resolve(PositionLevelRepositoryEloquent::class);
            $positionLevelRepository->create($dataPosition);

            $divisionShift = \GGPHP\ShiftSchedule\Models\DivisionShift::where('DivisionId', $value['divisionId'])->where([['StartDate', '<=', $timeApply->format('Y-m-d')], ['EndDate', '>=', $timeApply->format('Y-m-d')]])->first();

            if (!is_null($divisionShift)) {
                $dataSchedule = [
                    'employeeId' => $value['employeeId'],
                    'shiftId' => $divisionShift->ShiftId,
                    'startDate' => $timeApply,
                    'endDate' => $timeApply->addYear()->format('Y-m-d'),
                    'interval' => 1,
                    'repeatBy' => 'daily',
                ];

                $scheduleRepositoryEloquent = resolve(ScheduleRepositoryEloquent::class);
                $scheduleRepositoryEloquent->createOrUpdate($dataSchedule);
            }
        }

        return true;
    }

    /**
     * @param $attributes
     * @return bool
     */
    public static function update($id, $attributes, $timeApply)
    {
        foreach ($attributes as $value) {
            $transferDetail = TransferDetail::where('EmployeeId', $value['employeeId'])->where('TransferId', $id)->first();

            if (is_null($transferDetail)) {
                $value['TransferId'] = $id;
                $transferDetail = TransferDetail::create($value);

                $dataPosition = [
                    'employeeId' => $value['employeeId'],
                    'branchId' => $value['branchId'],
                    'positionId' => $value['positionId'],
                    'divisionId' => $value['divisionId'],
                    'startDate' => $timeApply,
                    'type' => 'TRANFER',
                    'modelId' => $transferDetail->Id,
                    'modelType' => TransferDetail::class,
                ];

                $positionLevelRepository = resolve(PositionLevelRepositoryEloquent::class);
                $positionLevelRepository->create($dataPosition);

                $divisionShift = \GGPHP\ShiftSchedule\Models\DivisionShift::where('DivisionId', $value['divisionId'])->where([['StartDate', '<=', $timeApply->format('Y-m-d')], ['EndDate', '>=', $timeApply->format('Y-m-d')]])->first();

                if (!is_null($divisionShift)) {
                    $dataSchedule = [
                        'employeeId' => $value['employeeId'],
                        'shiftId' => $divisionShift->ShiftId,
                        'startDate' => $timeApply,
                        'endDate' => $timeApply->addYear()->format('Y-m-d'),
                        'interval' => 1,
                        'repeatBy' => 'daily',
                    ];

                    $scheduleRepositoryEloquent = resolve(ScheduleRepositoryEloquent::class);
                    $scheduleRepositoryEloquent->createOrUpdate($dataSchedule);
                }
            } else {
                $transferDetail->update($value);

                $positionLevel = $transferDetail->positionLevel;

                $dataPosition = [
                    'employeeId' => $value['employeeId'],
                    'branchId' => $value['branchId'],
                    'positionId' => $value['positionId'],
                    'divisionId' => $value['divisionId'],
                    'startDate' => $timeApply,
                    'type' => 'TRANFER',
                    'modelId' => $transferDetail->Id,
                    'modelType' => TransferDetail::class,
                ];

                $positionLevelRepository = resolve(PositionLevelRepositoryEloquent::class);

                if (!is_null($positionLevel)) {
                    $positionLevelRepository->update($dataPosition, $positionLevel->Id);
                } else {
                    $positionLevelRepository->create($dataPosition);
                }

                $divisionShift = \GGPHP\ShiftSchedule\Models\DivisionShift::where('DivisionId', $value['divisionId'])->where([['StartDate', '<=', $timeApply->format('Y-m-d')], ['EndDate', '>=', $timeApply->format('Y-m-d')]])->first();

                if (!is_null($divisionShift)) {
                    $dataSchedule = [
                        'employeeId' => $value['employeeId'],
                        'shiftId' => $divisionShift->ShiftId,
                        'startDate' => $timeApply,
                        'endDate' => $timeApply->addYear()->format('Y-m-d'),
                        'interval' => 1,
                        'repeatBy' => 'daily',
                    ];

                    $scheduleRepositoryEloquent = resolve(ScheduleRepositoryEloquent::class);
                    $scheduleRepositoryEloquent->createOrUpdate($dataSchedule);
                }
            }
        }

        return true;
    }
}
