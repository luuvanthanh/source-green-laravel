<?php
namespace GGPHP\WorkDeclaration\Services;

use GGPHP\RevokeShift\Models\RevokeShift;
use GGPHP\WorkDeclaration\Models\WorkDeclaration;
use GGPHP\WorkDeclaration\Models\WorkDeclarationDetail;

class WorkDeclarationDetailService
{
    /**
     * Add schedule repeat for schedule
     *
     * @param  Scheduel  $schedule
     * @param  Date  $date
     * @return date  $dayend
     */
    public static function add($idWorkDeclaration, array $attributes)
    {
        foreach ($attributes as $value) {
            switch ($value['Type']) {
                case 'invalid':
                    $value['Time'] = json_encode($value['Time']);
                    $value['WorkDeclarationId'] = $idWorkDeclaration;
                    $value['ModelType'] = WorkDeclarationDetail::MODEL['INVALID'];
                    WorkDeclaration::where('Id', $value['ModelId'])->update(['StatusWorkDeclaration' => 'PROCESS']);
                    WorkDeclarationDetail::create($value);
                    break;
                case 'revoke_shift':
                    $value['Time'] = json_encode($value['Time']);
                    $value['WorkDeclarationId'] = $idWorkDeclaration;
                    $value['ModelType'] = WorkDeclarationDetail::MODEL['REVOKESHIFT'];
                    RevokeShift::where('Id', $value['ModelId'])->update(['StatusWorkDeclaration' => 'PROCESS']);
                    WorkDeclarationDetail::create($value);
                    break;
                case 'default':
                    $value['Time'] = json_encode($value['Time']);
                    $value['WorkDeclarationId'] = $idWorkDeclaration;
                    $value['ModelType'] = WorkDeclarationDetail::MODEL['DEFAULT'];
                    WorkDeclarationDetail::create($value);
                    break;
            }
        }

        return true;
    }

    /**
     *
     * @param  Scheduel  $schedule
     * @param  Date  $date
     * @return date  $dayend
     */
    public static function update(array $attributes)
    {
        foreach ($attributes as $value) {
            $workDeclarationDetail = WorkDeclarationDetail::findOrFail($value['Id']);
            $value['Time'] = json_encode($value['Time']);
            $workDeclarationDetail->update($value);
        }

        return true;
    }

}
