<?php

namespace GGPHP\RolePermission\Imports;

use GGPHP\Category\Models\Province;
use GGPHP\RolePermission\Models\Permission;
use Maatwebsite\Excel\Concerns\ToModel;

class PermissionImport implements ToModel
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        if (!is_null($row[0])) {

            $dataPermission = [
                'name' => $row[0],
                'description' => $row[2],
                'guard_name' => 'api',
                'is_system' => false,
                'group' => $row[1],
            ];

            Permission::updateOrCreate(['name' => $dataPermission['name']], $dataPermission);
        }

        return null;
    }
}
