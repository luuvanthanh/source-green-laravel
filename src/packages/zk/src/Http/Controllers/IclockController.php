<?php

namespace ZK\Http\Controllers;

use App\Models\User;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class IclockController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function sync(Request $request)
    {
        $array = [
            123,
            "agagagag",
            "agagagagag",
            rand(9999, 5),
            1231231231,
            1,
            0,
            1,
        ];
        $template = "C:%d:DATA USER PIN=%d\tName=%s\tPri=%d\tPasswd=%s\tCard=%s\tGrp=%d\tTZ=%d";
        $return = vsprintf($template, $array);
        dd($return);
        $device = \GGPHP\FingerprintTimekeeper\Models\FingerprintTimekeeper::first();
        $syncTime = $device->syncTime()->firstOrCreate([]);

        $collection = \ZK\Models\ZKSync::whereDate('created_at', '>=', $syncTime->updated_at)->get();
        if ($collection->isEmpty()) {
            return response('OK', 200)->header('Content-Type', 'text/plain');
        }
        $syncTime->touch();
        $return = "C:10:DATA FP ";

        foreach ($collection as $key => $value) {
            $model = $value->subject;
            $text = "PIN=%d\tFID=%d\tValid=%d\tTMP=%s\r\n";
            $returnText .= sprintf($text, $model->user->id, $model->finger_index, $model->valid, (string) $model->finger);

        }
        $collection->each(function ($item) use (&$returnText) {
            $model = $item->subject;
            if (!in_array($item->subject_type, array_values(config('zk.subject_supporteds')))) {
                return;
            }
            switch ($item->subject_type) {
                case config('zk.subject_supporteds')['USER']:
                    $return = "C:8:DATA USER ";
                    $user = $model->user;
                    $card = $user->magneticCards()->where('status', "ON")->first();
                    $array = [
                        'PIN' => $user->id,
                        'Name' => $user->full_name,
                        'Passwd' => rand(9999, 5),
                        'Card' => empty($card->cardNumber) ? 0 : $card->cardNumber,
                        'Grp' => 14,
                        'TZ' => 1,
                        'Pri' => 0,
                    ];

                    foreach ($array as $key => $val) {
                        $return .= "{$key}={$val}\t";
                    }

                    break;
                case config('zk.subject_supporteds')['FINGERPRINT']:
                    $user = $model->user;
                    $return = "C:10 FP PIN=%d\tFID=%d\tSize=%d\tValid=%d\tTMP=%s";
                    $array = [
                        'PIN' => (int) $model->user->id,
                        'FID' => (int) $model->finger_index,
                        'Size' => (int) $model->size,
                        'Valid' => (int) $model->valid,
                        'TMP' => (string) $model->finger,
                    ];

                    \Log::debug('DATAUPDATEFIN:', $array);

                    $return = sprintf($return, $model->user->id, $model->finger_index, $model->size, $model->valid, $model->finger);
                    dd($return);
                    break;
                default:
                    break;
            }
            $returnText .= "$return\n";
        });

        dd($returnText);
    }

    public function sentToDevice()
    {
        $sn = request()->get('SN');
        $device = \GGPHP\FingerprintTimekeeper\Models\FingerprintTimekeeper::where('serial_number', $sn)->first();
        $syncTime = $device->syncTime()->firstOrCreate([]);
        if (!$syncTime->zk_sync_id) {
            $modelSync = \ZK\Models\ZKSync::first();
        } else {
            $modelSync = \ZK\Models\ZKSync::where('id', '>', $syncTime->zk_sync_id)->first();
        }

        if (!$modelSync) {
            return response('OK', 200)->header('Content-Type', 'text/plain');
        }

        $model = $modelSync->subject()->withTrashed()->first();

        if (!$model) {
            $return = 'OK';
            if (in_array($modelSync->subject_type, ['GGPHP\MagneticCard\Models\MagneticCard'])) {
                $obj = json_decode($modelSync->payload);
                $user = User::find($obj->user_id);
                $array = [
                    $modelSync->id,
                    $user->id,
                    $user->full_name,
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

        if (!in_array($modelSync->subject_type, array_values(config('zk.subject_supporteds')))) {
            return response('OK', 200)->header('Content-Type', 'text/plain');
        }

        $user = $model->user;

        if (!$user) {
            $user = $model;

        }
        if (!$user) {
            $modelSync->delete();
            return response('OK', 200)->header('Content-Type', 'text/plain');
        }

        switch ($modelSync->subject_type) {
            case config('zk.subject_supporteds')['MAGNETIC_CARD']:
            case config('zk.subject_supporteds')['USER']:
                $card = $user->magneticCards()->first();
                $array = [
                    $modelSync->id,
                    $user->id,
                    $user->full_name,
                    0,
                    rand(9999, 5),
                    empty($card->cardNumber) || $card->deleted_at ? 0 : $card->cardNumber,
                    14,
                    1,
                ];
                $template = "C:%d:DATA USER PIN=%d\tName=%s\tPri=%d\tPasswd=%s\tCard=%s\tGrp=%d\tTZ=%d\r\n";
                $return = vsprintf($template, $array);
                break;
            case config('zk.subject_supporteds')['FINGERPRINT']:
                if ($modelSync->action === 'deleted') {
                    $array = [
                        $modelSync->id,
                        $model->user->id,
                        $model->finger_index,
                    ];
                    $template = "C:%d:DATA DEL_FP PIN=%d\tFID=%d\r\n";
                } else {
                    $template = "C:YUEOI:DATA DEL_FP PIN=%d\tFID=%d\r\nC:%d:DATA UPDATE FINGERTMP PIN=%d\tFID=%d\tSize=%d\tValid=%d\tTMP=%s\r\n";
                    $array = [
                        $model->user->id,
                        $model->finger_index,
                        $modelSync->id,
                        $model->user->id,
                        $model->finger_index,
                        (int) $model->size,
                        $model->valid,
                        (string) $model->finger,
                    ];
                }

                $return = vsprintf($template, $array);
                break;
            default:
                break;
        }

        \Log::info($return);

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
            \Log::debug('GOTOTO:', $attributes);

            $sync = \ZK\Models\ZKSync::find($attributes['ID']);
            if (!$sync) {
                continue;
            }
            if (!in_array($attributes['Return'], [0, -12])) {
                continue;
            }
            $sn = request()->get('SN');
            $device = \GGPHP\FingerprintTimekeeper\Models\FingerprintTimekeeper::where('serial_number', $sn)->first();
            $syncTime = $device->syncTime;
            $syncTime->zk_sync_id = $sync->id;
            $syncTime->save();
        }
        return response('ok', 200)->header('Content-Type', 'text/plain');
    }

    public function deviceGetSetting()
    {
        $sn = request()->get('SN');
        if (request()->get('options') == 'all') {
            $return = "GET OPTION FROM : {$sn}";
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
        $device = \GGPHP\FingerprintTimekeeper\Models\FingerprintTimekeeper::where(['serial_number' => $serialNumber])->firstOrFail();

        if (empty($device)) {
            return response('ok', 200)->header('Content-Type', 'text/plain');
        }

        $devices = $device->store->fingerprintTimekeepers()->where('id', '!=', $device->id)->get();

        $dataFromClient = (array) request()->getContent();
        \Log::debug('GOT INFO 404:', $dataFromClient);
        $data = preg_split('/\n/', $dataFromClient[0]);
        $haystack = [
            'user' => 'USER',
            'fingerprint' => 'FP',
            'operationLog' => 'OPLOG',
        ];

        foreach ($data as $value) {
            if (empty($value)) {
                continue;
            }
            foreach ($haystack as $str) {
                if (preg_match("/^{$str}/i", $value, $m)) {
                    $stringAttributes = trim(str_replace($str, '', $value));
                    switch ($m[0]) {
                        case $haystack['user']:
                            $arrayAttributes = preg_split('/\t/', $stringAttributes);
                            $result = array_map(function ($item) {
                                $pos = strpos($item, '=');
                                return [substr($item, 0, $pos) => substr($item, $pos + 1)];
                            }, array_values($arrayAttributes));
                            $attributes = \Arr::collapse($result);

                            $user = User::find($attributes['PIN']);

                            if (!$user) {
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
                            \GGPHP\MagneticCard\Services\MagneticCardServices::addOrUpdate($user, [
                                'magnetic_card' => !empty($magneticCard) ? (int) $magneticCard : 0,
                                'magnetic_card_patch' => !empty($magneticCardPatch) ? $magneticCardPatch : 0,
                                'magnetic_card_token' => !empty($magneticCard) ? \Hash::make($magneticCard) : '',
                                'device_id' => $device->id,
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
                            //find user
                            $user = User::find($attributes['PIN']);

                            if (!$user) {
                                break;
                            }

                            //call service add fingerprint to user
                            \GGPHP\Fingerprint\Services\UserFingerprint::addOrUpdate($user, [
                                'valid' => $attributes['Valid'],
                                'size' => $attributes['Size'],
                                'finger' => $attributes['TMP'],
                                'finger_index' => $attributes['FID'],
                                'device_id' => $device->id,
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
                \Log::debug('GOT INFO SNDEVE:', preg_split('/\t/', $value));

                $attributes = array_slice(preg_split('/\t/', $value), 0, 4);
                $keyAttributes = ['user_id', 'attended_at', 'tracking_type', 'type'];
                $attributes = array_combine($keyAttributes, $attributes);
                $user = User::find($attributes['user_id']);

                if (!$user) {
                    continue;
                }

                $fields = \Arr::only($attributes, ['type', 'attended_at', 'tracking_type']);
                \Log::debug('GOT INFO:', [$fields['type']]);

                if (empty(\GGPHP\Timekeeping\Models\Timekeeping::TYPE_COLLECTION[$fields['type']])) {
                    continue;
                }

                $fields['type'] = \GGPHP\Timekeeping\Models\Timekeeping::TYPE_COLLECTION[$fields['type']];
                \GGPHP\Timekeeping\Services\UserAttendence::attend($user, array_merge(['device_id' => $device->id], $fields));
                \Log::debug('GOT INFO:', $attributes);
            }
            \Log::debug('GOT INFO:', $attributes);
        }
        return response('ok', 200)->header('Content-Type', 'text/plain');
    }
}
