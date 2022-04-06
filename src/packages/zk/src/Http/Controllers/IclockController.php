<?php

namespace ZK\Http\Controllers;

use App\Models\User;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class IclockController extends Controller
{
    public function sentToDevice()
    {
        $sn = request()->get('SN');
        $device = \GGPHP\FingerprintTimekeeper\Models\FingerprintTimekeeper::where('SerialNumber', $sn)->first();
        $syncTime = $device->syncTime()->firstOrCreate([]);

        if (!$syncTime->ZkSyncId) {
            $modelSync = \ZK\Models\ZKSync::first();
        } else {
            $modelSync = \ZK\Models\ZKSync::where('id', '>', $syncTime->ZkSyncId)->first();
        }

        if (!$modelSync) {
            return response('OK', 200)->header('Content-Type', 'text/plain');
        }

        $model = $modelSync->subject()->withTrashed()->first();

        $return = '';

        if (!in_array($modelSync->SubjectType, array_values(config('zk.subject_supporteds')))) {
            return response('OK', 200)->header('Content-Type', 'text/plain');
        }

        $employee = $model->employee;

        if (!$employee) {
            $employee = $model;
        }
        if (!$employee) {
            $modelSync->delete();
            return response('OK', 200)->header('Content-Type', 'text/plain');
        }

        switch ($modelSync->SubjectType) {
            case config('zk.subject_supporteds')['USER']:
                $array = [
                    $modelSync->id,
                    $employee->FingerprintId,
                    $employee->FullName,
                    0,
                    rand(9999, 5),
                    0,
                    14,
                    1,
                ];
                $template = "C:%d:DATA USER PIN=%d\tName=%s\tPri=%d\tPasswd=%s\tCard=%s\tGrp=%d\tTZ=%d\r\n";
                $return = vsprintf($template, $array);
                break;
            case config('zk.subject_supporteds')['FINGERPRINT']:
                if ($modelSync->Action === 'deleted') {
                    $array = [
                        $modelSync->id,
                        $model->employee->FingerprintId,
                        $model->FingerIndex,
                    ];
                    $template = "C:%d:DATA DEL_FP PIN=%d\tFID=%d\r\n";
                } else {
                    $template = "C:%d:DATA UPDATE FINGERTMP PIN=%d\tFID=%d\tSize=%d\tValid=%d\tTMP=%s\r\n";

                    $array = [
                        $modelSync->id,
                        $model->employee->FingerprintId,
                        (int) $model->FingerIndex,
                        (int) $model->Size,
                        $model->Valid,
                        (string) $model->Finger,
                    ];
                }

                $return = vsprintf($template, $array);
                break;
            case config('zk.subject_supporteds')['BIO']:
                if ($device->IsBio) {
                    if ($modelSync->Action === 'deleted') {
                        $array = [
                            $modelSync->id,
                            $model->employee->FingerprintId,
                            $model->Index,
                        ];
                        $template = "C:%d:DATA DELETE BIODATA PIN=%d\tType=%d\tNo=%d\r\n";
                    } else {

                        $template = "C:%d:DATA UPDATE BIODATA Pin=%d\tNo=%d\tIndex=%d\tValid=%d\tDuress=%d\tType=%d\tMajorVer=%d\tMinorVer=%d\tFormat=%d\tTmp=%s\r\n";
                        $array = [
                            $modelSync->id,
                            $model->employee->FingerprintId,
                            $model->No,
                            $model->Index,
                            $model->Valid,
                            $model->Duress,
                            $model->Type,
                            $model->MajorVer,
                            $model->MinorVer,
                            $model->Format,
                            (string) $model->Tmp,
                        ];
                    }

                    $return = vsprintf($template, $array);
                } else {
                    $array = [
                        $modelSync->id,
                        $model->employee->FingerprintId,
                        $model->employee->FullName,
                        0,
                        rand(9999, 5),
                        14,
                        1,
                    ];
                    $template = "C:%d:DATA USER PIN=%d\tName=%s\tPri=%d\tPasswd=%s\tGrp=%d\tTZ=%d\r\n";
                    $return = vsprintf($template, $array);
                }
                break;
            case config('zk.subject_supporteds')['MAGNETICCARD']:
                if ($modelSync->Action === 'deleted') {
                    $array = [
                        $modelSync->id,
                        $model->employee->FingerprintId,
                        $model->employee->FullName,
                        0,
                        rand(9999, 5),
                        0,
                        14,
                        1,
                    ];

                    $template = "C:%d:DATA USER PIN=%d\tName=%s\tPri=%d\tPasswd=%s\tCard=%s\tGrp=%d\tTZ=%d\r\n";
                } else {
                    $array = [
                        $modelSync->id,
                        $model->employee->FingerprintId,
                        $model->employee->FullName,
                        0,
                        rand(9999, 5),
                        (int) $model->Card,
                        14,
                        1,
                    ];

                    $template = "C:%d:DATA USER PIN=%d\tName=%s\tPri=%d\tPasswd=%s\tCard=%s\tGrp=%d\tTZ=%d\r\n";
                }

                $return = vsprintf($template, $array);
                break;
            default:
                break;
        }

        return response($return, 200)->header('Content-Type', 'text/plain');
    }

    public function deviceGetCommand()
    {
        $dataFromClient = (array) request()->getContent();
        $data = preg_split('/\n/', $dataFromClient[0]);

        foreach ($data as $value) {
            if (empty($value)) {
                continue;
            }
            $stringAttributes = trim($value);
            $arrayAttributes = preg_split('/&/', $stringAttributes);
            $result = array_map(function ($item) {
                $pos = strpos($item, '=');
                return [substr($item, 0, $pos) => substr($item, $pos + 1)];
            }, array_values($arrayAttributes));
            $attributes = \Arr::collapse($result);

            $sync = \ZK\Models\ZKSync::find((int) $attributes['ID']);
            if (!$sync) {
                continue;
            }
            if (!in_array($attributes['Return'], [0, -12])) {
                continue;
            }
            $sn = request()->get('SN');
            $device = \GGPHP\FingerprintTimekeeper\Models\FingerprintTimekeeper::where('SerialNumber', $sn)->first();
            $syncTime = $device->SyncTime;
            $syncTime->ZkSyncId = $sync->id;
            $syncTime->save();
        }
        return response('ok', 200)->header('Content-Type', 'text/plain');
    }

    public function deviceGetSetting()
    {

        $sn = request()->get('SN');
        if (request()->get('options') == 'all') {
            $return = 'GET OPTION FROM : {' . $sn . '}';
            $array = [
                'Stamp' => time(),
                'OpStamp' => time(),
                'PhotoStamp' => time(),
                'ErrorDelay' => 30,
                'Delay' => 30,
                'TransFlag' => '111111111',
                'Realtime' => 1,
                'TransInterval' => 1,
                'Encrypt' => 'None',
                'ServerVer' => '2.32 ' . date('Y-m-d'),
                'ATTLOGStamp' => time(),
                'ATTPHOTOStamp' => time(),
                'TimeZone' => 7,
                'ADMSSyncTime' => 1,
                'OPERLOGStamp' => 9999,
            ];
            foreach ($array as $key => $val) {
                $return .= $key . '=' . $val . PHP_EOL;
            }
            return response($return, 200)->header('Content-Type', 'text/plain');
        }
    }

    /**
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function receiveFromDevice()
    {
        $serialNumber = request()->get('SN');
        $device = \GGPHP\FingerprintTimekeeper\Models\FingerprintTimekeeper::where(['SerialNumber' => $serialNumber])->firstOrFail();

        if (empty($device)) {
            return response('ok', 200)->header('Content-Type', 'text/plain');
        }

        $dataFromClient = (array) request()->getContent();
        $data = preg_split('/\n/', $dataFromClient[0]);
        $haystack = [
            'employee' => 'USER',
            'fingerprint' => 'FP',
            'operationLog' => 'OPLOG',
            'biodata' => 'BIODATA',
        ];

        foreach ($data as $value) {
            if (empty($value)) {
                continue;
            }

            foreach ($haystack as $str) {
                if (preg_match("/^{$str}/i", $value, $m)) {
                    $stringAttributes = trim($value);
                    switch ($m[0]) {
                        case $haystack['employee']:
                            $arrayAttributes = preg_split('/\t/', $stringAttributes);
                            $result = array_map(function ($item) use ($str) {
                                $pos = strpos($item, '=');
                                return [trim(str_replace($str, '', substr($item, 0, $pos))) => substr($item, $pos + 1)];
                            }, array_values($arrayAttributes));
                            $attributes = \Arr::collapse($result);

                            $employee = User::where('FingerprintId', $attributes['PIN'])->first();

                            if (!$employee) {
                                break;
                            }

                            if (!empty($attributes['Card'])) {
                                $card = (int) $attributes['Card'];
                                $middle = floor(strlen($card) / 2);
                                $magneticCard = substr($card, 0, $middle);
                                $magneticCardPatch = substr($card, $middle);
                            }
                            if (empty($magneticCard) && empty($magneticCardPatch)) {
                                break;
                            }

                            // //call service add magnetic card to user
                            \GGPHP\MagneticCard\Services\MagneticCardServices::addOrUpdate($employee, [
                                'MagneticCard' => !empty($magneticCard) ? (int) $magneticCard : 0,
                                'MagneticCardPatch' => !empty($magneticCardPatch) ? $magneticCardPatch : 0,
                                'MagneticCardToken' => !empty($magneticCard) ? \Hash::make($magneticCard) : '',
                                'DeviceId' => $device->Id,
                                'Card' => !empty($card) ? $card : '',
                            ]);

                            break;
                        case $haystack['fingerprint']:
                            $arrayAttributes = preg_split('/\t/', $stringAttributes);

                            $result = array_map(function ($item) use ($str) {
                                $pos = strpos($item, '=');
                                return [trim(str_replace($str, '', substr($item, 0, $pos))) => substr($item, $pos + 1)];
                            }, array_values($arrayAttributes));
                            $attributes = \Arr::collapse($result);

                            //find employee
                            $employee = User::where('FingerprintId', $attributes['PIN'])->first();

                            if (!$employee) {
                                break;
                            }

                            //call service add fingerprint to employee
                            \GGPHP\Fingerprint\Services\UserFingerprint::addOrUpdate($employee, [
                                'Valid' => $attributes['Valid'],
                                'Size' => $attributes['Size'],
                                'Finger' => $attributes['TMP'],
                                'FingerIndex' => $attributes['FID'],
                                'DeviceId' => $device->Id,
                            ]);

                            break;
                        case $haystack['operationLog']:
                            $attributes = preg_split('/\t/', $stringAttributes);
                            break;
                        case $haystack['biodata']:
                            $arrayAttributes = preg_split('/\t/', $stringAttributes);

                            $result = array_map(function ($item) use ($str) {
                                $pos = strpos($item, '=');
                                return [trim(str_replace($str, '', substr($item, 0, $pos))) => substr($item, $pos + 1)];
                            }, array_values($arrayAttributes));
                            $attributes = \Arr::collapse($result);
                            // find employee
                            $employee = User::where('FingerprintId', $attributes['Pin'])->first();

                            if (!$employee) {
                                break;
                            }

                            $employee->bios()->updateOrCreate(
                                [
                                    'EmployeeId' => $employee->Id,
                                    'Index' => $attributes['Index']
                                ],
                                [
                                    'Pin' => $attributes['Pin'],
                                    'No' => $attributes['No'],
                                    'Valid' => $attributes['Valid'],
                                    'Duress' => $attributes['Duress'],
                                    'Type' => $attributes['Type'],
                                    'MajorVer' => $attributes['MajorVer'],
                                    'MinorVer' => $attributes['MinorVer'],
                                    'Format' => $attributes['Format'],
                                    'Tmp' => $attributes['Tmp'],
                                ]
                            );
                            break;
                        default:
                            break;
                    }
                    break;
                }
            }
            if (empty($attributes)) {

                $attributes = array_slice(preg_split('/\t/', $value), 0, 4);

                if (count($attributes) < 4) {
                    continue;
                }

                $keyAttributes = ['EmployeeId', 'AttendedAt', 'TrackingType', 'Type'];

                if (count($attributes) < 4) {
                    continue;
                }

                $attributes = array_combine($keyAttributes, $attributes);
                $employee = User::where('FingerprintId', (int) $attributes['EmployeeId'])->first();

                if (!$employee) {
                    continue;
                }

                $fields = \Arr::only($attributes, ['Type', 'AttendedAt', 'TrackingType']);

                if (empty(\GGPHP\Timekeeping\Models\Timekeeping::TYPE_COLLECTION[$fields['Type']])) {
                    continue;
                }

                $fields['Type'] = \GGPHP\Timekeeping\Models\Timekeeping::TYPE_COLLECTION[$fields['Type']];

                \GGPHP\Timekeeping\Services\UserAttendence::attend($employee, array_merge(['DeviceId' => $device->Id], $fields));
            }
        }
        return response('ok', 200)->header('Content-Type', 'text/plain');
    }
}
