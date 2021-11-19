<?php

namespace GGPHP\Category\Imports;

use GGPHP\Category\Models\Province;
use Maatwebsite\Excel\Concerns\ToModel;

class ProvinceImport implements ToModel
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        if (!is_null($row[0])) {
            $dataPapa = [
                'code' => trim($row[0]),
                'name' => trim($row[1]),
                'rank' => trim($row[2]),
            ];

            Province::create($dataPapa);
        }

        return;
    }
}
