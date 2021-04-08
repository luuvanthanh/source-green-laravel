<?php
namespace GGPHP\WorkDeclaration\Services;

use GGPHP\Absent\Models\RevokeShift;
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
            switch ($value['type']) {
                case 'invalid':
                    $value['time'] = json_encode($value['time']);
                    $value['work_declaration_id'] = $idWorkDeclaration;
                    $value['model_type'] = WorkDeclarationDetail::MODEL['INVALID'];
                    WorkDeclaration::where('id', $value['model_id'])->update(['status_work_declaration' => 'PROCESS']);
                    WorkDeclarationDetail::create($value);
                    break;
                case 'revoke_shift':
                    $value['time'] = json_encode($value['time']);
                    $value['work_declaration_id'] = $idWorkDeclaration;
                    $value['model_type'] = WorkDeclarationDetail::MODEL['REVOKESHIFT'];
                    RevokeShift::where('id', $value['model_id'])->update(['status_work_declaration' => 'PROCESS']);
                    WorkDeclarationDetail::create($value);
                    break;
                case 'default':
                    $value['time'] = json_encode($value['time']);
                    $value['work_declaration_id'] = $idWorkDeclaration;
                    $value['model_type'] = WorkDeclarationDetail::MODEL['DEFAULT'];
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
            $workDeclarationDetail = WorkDeclarationDetail::findOrFail($value['id']);
            $value['time'] = json_encode($value['time']);
            $workDeclarationDetail->update($value);
        }

        return true;
    }

}
