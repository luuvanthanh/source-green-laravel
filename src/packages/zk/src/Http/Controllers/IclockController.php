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

        if (!$model) {
            $return = 'OK';
            if (in_array($modelSync->SubjectType, ['GGPHP\MagneticCard\Models\MagneticCard'])) {
                $obj = json_decode($modelSync->Payload);
                $employee = User::find($obj->EmployeeId);
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
            } else {
                $modelSync->delete();
            }

            return response($return, 200)->header('Content-Type', 'text/plain');
        }

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
                \Log::info('abc', []);
                if ($modelSync->action === 'deleted') {
                    $array = [
                        $modelSync->id,
                        $model->employee->FingerprintId,
                        $model->FingerIndex,
                    ];
                    $template = "C:%d:DATA DEL_FP PIN=%d\tFID=%d\r\n";
                } else {
                    $template = "C:YUEOI:DATA DEL_FP PIN=%d\tFID=%d\r\nC:%d:DATA UPDATE FINGERTMP PIN=%d\tFID=%d\tSize=%d\tValid=%d\tTMP=%s\r\n";
                    $array = [
                        $model->employee->FingerprintId,
                        $model->FingerIndex,
                        $modelSync->id,
                        $model->employee->FingerprintId,
                        $model->FingerIndex,
                        (int) $model->Size,
                        $model->Valid,
                        (string) $model->Finger,
                    ];
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
        ];

        foreach ($data as $value) {
            if (empty($value)) {
                continue;
            }
            foreach ($haystack as $str) {
                if (preg_match('/^{$str}/i', $value, $m)) {
                    $stringAttributes = trim(str_replace($str, '', $value));
                    switch ($m[0]) {
                        case $haystack['employee']:
                            $arrayAttributes = preg_split('/\t/', $stringAttributes);
                            $result = array_map(function ($item) {
                                $pos = strpos($item, '=');
                                return [substr($item, 0, $pos) => substr($item, $pos + 1)];
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

                            //call service add magnetic card to user
                            \GGPHP\MagneticCard\Services\MagneticCardServices::addOrUpdate($employee, [
                                'magneticCard' => !empty($magneticCard) ? (int) $magneticCard : 0,
                                'magneticCardPatch' => !empty($magneticCardPatch) ? $magneticCardPatch : 0,
                                'magneticCardToken' => !empty($magneticCard) ? \Hash::make($magneticCard) : '',
                                'deviceId' => $device->Id,
                                'card' => !empty($card) ? $card : '',
                            ]);

                            break;
                        case $haystack['fingerprint']:
                            $arrayAttributes = preg_split('/\t/', $stringAttributes);
                            $result = array_map(function ($item) {
                                $pos = strpos($item, '=');
                                return [substr($item, 0, $pos) => substr($item, $pos + 1)];
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
                        default:
                            break;
                    }
                    break;
                }
            }
            if (empty($attributes)) {

                $attributes = array_slice(preg_split('/\t/', $value), 0, 4);
                \Log::info('ac', $attributes);
                $keyAttributes = ['EmployeeId', 'AttendedAt', 'TrackingType', 'Type'];
                $attributes = array_combine($keyAttributes, $attributes);

                $employee = User::where('FingerprintId', $attributes['EmployeeId'])->first();

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
