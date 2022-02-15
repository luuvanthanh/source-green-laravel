<?php

namespace GGPHP\Clover\Imports;

use Carbon\Carbon;
use GGPHP\Clover\Models\Classes;
use GGPHP\Clover\Models\Parents;
use GGPHP\Clover\Models\Student;
use GGPHP\Clover\Models\StudentParent;
use Maatwebsite\Excel\Concerns\ToModel;
use Webpatser\Uuid\Uuid;

class StudentImport implements ToModel
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
                'FullName' => $row[9],
                'DayOfBirth' => Carbon::parse($row[10])->format('Y-m-d'),
                'Sex' => 1,
                'Email' => $row[13],
                'Phone' => $row[12],
                'Address' => $row[8],
                'JobTile' => $row[11],
                'FaceBook' => $row[26],
                'Hobby' => $row[22],
                'Status' => 0,
            ];
            $papa = Parents::create($dataPapa);

            $dataMama = [
                'FullName' => $row[14],
                'DayOfBirth' => Carbon::parse($row[15])->format('Y-m-d'),
                'Sex' => 0,
                'Email' => $row[18],
                'Phone' => $row[17],
                'Address' => $row[8],
                'JobTile' => $row[16],
                'FaceBook' => $row[25],
                'Hobby' => $row[23],
                'Status' => 0,
            ];
            $mama = Parents::create($dataMama);

            $class = Classes::where('Code', $row[5])->whereHas('branch', function ($query) use ($row) {
                $query->where('Code', $row[6]);
            })->first();

            $dataStudent = [
                'FullName' => $row[0],
                'Code' => $row[0],
                'RegisterDate' => Carbon::parse($row[3])->format('Y-m-d'),
                'DayOfBirth' => Carbon::parse($row[1])->format('Y-m-d'),
                'Age' => $row[2],
                'Sex' => $row[4],
                'ClassId' => $class->Id,
            ];
            $student = Student::create($dataStudent);

            $studentParentPapa = StudentParent::insert([
                'Id' => Uuid::generate(4)->string,
                'StudentId' => $student->Id,
                'ParentId' => $papa->Id,
                'RelationType' => 0,
                'CreationTime' => Carbon::now()->format('Y-m-d'),
            ]);

            $studentParentMama = StudentParent::insert([
                'Id' => Uuid::generate(4)->string,
                'StudentId' => $student->Id,
                'ParentId' => $mama->Id,
                'RelationType' => 1,
                'CreationTime' => Carbon::now()->format('Y-m-d'),
            ]);
        }

        return true;
    }
}
