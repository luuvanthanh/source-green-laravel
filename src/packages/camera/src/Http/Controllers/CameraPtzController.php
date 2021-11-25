<?php

namespace GGPHP\Camera\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Camera\Http\Requests\CameraPtzRequest;
use Illuminate\Http\Response;
use GGPHP\Camera\Models\Camera;
use GuzzleHttp\Client;

class CameraPtzController extends Controller
{
    private $username;

    private $password;

    /**
     * PTZ
     *
     * @param  mixed $request
     * @param  mixed $camera
     * @return Response
     */
    public function ptz(CameraPtzRequest $request, Camera $camera)
    {
        // Set username, password
        $this->username = !empty($camera->generalProperties->user_name) ? $camera->generalProperties->user_name : null;
        $this->password = !empty($camera->generalProperties->password) ?  $camera->generalProperties->password : null;

        $ip = !empty($camera->generalProperties->ip) ? $camera->generalProperties->ip : null;
        if (empty($ip)) {
            $rtsp = !empty($camera->videoProperties->rtsp_url) ? $camera->videoProperties->rtsp_url : null;
            $ip = $this->getIpFromRtsp($rtsp);
        }

        $linkPtz = $this->getUrlPtz($ip);
        $body = '<PTZData version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">'.
            '<pan>{$pan}</pan>'.
            '<tilt>{$tilt}</tilt>'.
            '</PTZData>';

        $zoomActive = false;

        // Status: start
        switch ($request->action) {
            case config('constants.CAMERA.PTZ.ACTION.LEFT', ''):
                $pan  = -60;
                $tilt = 0;
                break;

            case config('constants.CAMERA.PTZ.ACTION.RIGHT', ''):
                $pan  = 60;
                $tilt = 0;
                break;

            case config('constants.CAMERA.PTZ.ACTION.UP', ''):
                $pan  = 0;
                $tilt = 60;
                break;

            case config('constants.CAMERA.PTZ.ACTION.DOWN', ''):
                $pan  = 0;
                $tilt = -60;
                break;

            case config('constants.CAMERA.PTZ.ACTION.SKEW_UP_LEFT', ''):
                $pan  = -60;
                $tilt = 60;
                break;

            case config('constants.CAMERA.PTZ.ACTION.SKEW_UP_RIGHT', ''):
                $pan  = 60;
                $tilt = 60;
                break;

            case config('constants.CAMERA.PTZ.ACTION.SKEW_DOWN_LEFT', ''):
                $pan  = -60;
                $tilt = -60;
                break;

            case config('constants.CAMERA.PTZ.ACTION.SKEW_DOWN_RIGHT', ''):
                $pan  = 60;
                $tilt = -60;
                break;

            case config('constants.CAMERA.PTZ.ACTION.ZOOM_IN', ''):
                $zoom = 60;
                $zoomActive = true;
                break;

            case config('constants.CAMERA.PTZ.ACTION.ZOOM_OUT', ''):
                $zoom = -60;
                $zoomActive = true;
                break;

            default:
                $pan  = 0;
                $tilt = 0;
                $zoom = 0;
        }

        if ($request->status == config('constants.CAMERA.PTZ.STATUS.STOP', '')) {
            $pan  = 0;
            $tilt = 0;
            $zoom = 0;
        }

        if ($zoomActive) {
            $body = str_replace(['<pan>{$pan}</pan>', '<tilt>{$tilt}</tilt>', '{$zoom}'], ['', '<zoom>{$zoom}</zoom>', $zoom], $body);
        } else {
            $body = str_replace(['{$pan}', '{$tilt}'], [$pan, $tilt], $body);
        }

        // Call API PTZ
        $response = $this->call('PUT', $linkPtz, $body);

        if (empty($response)) {
            return response()->json([], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json($response, !empty($response['status']) ? $response['status'] : Response::HTTP_OK);
    }

    /**
     * Preset
     * When leave page edit videowall & view detail:
     * If click save: call function create Preset
     * Then call function gotoPreset
     *
     * @param  mixed $camera
     * @return void
     */
    public function createPreset(Camera $camera)
    {
        // Set username, password
        $this->username = !empty($camera->generalProperties->user_name) ? $camera->generalProperties->user_name : null;
        $this->password = !empty($camera->generalProperties->password) ?  $camera->generalProperties->password : null;

        $ip = !empty($camera->generalProperties->ip) ? $camera->generalProperties->ip : null;
        if (empty($ip)) {
            $rtsp = !empty($camera->videoProperties->rtsp_url) ? $camera->videoProperties->rtsp_url : null;
            $ip = $this->getIpFromRtsp($rtsp);
        }

        $presetId = $camera->preset_id;
        // Check if empty preset, update preset
        if (empty($presetId)) {
            $presetId = $this->getPresetIdFromIp($ip);
            $camera->update(['preset_id' => $presetId]);
        }
        if ($presetId) {
            // Call API create preset
            $urlCreatPreset = $this->getUrlCreatePreset($ip, $presetId);
            $body = '<PTZPreset version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">'.
                '<id>'. $presetId. '</id>'.
                '</PTZPreset>';
            $response = $this->call('PUT', $urlCreatPreset, $body);
            if (empty($response)) {
                return response()->json([], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            return response()->json($response, !empty($response['status']) ? $response['status'] : Response::HTTP_OK);
        }

        return response()->json([], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    /**
     * Go to Preset
     * When leave page edit videowall & view detail:
     * If click save: call function create Preset
     * Then call function gotoPreset
     *
     * @param  mixed $camera
     * @return void
     */
    public function gotoPreset(Camera $camera)
    {
        // Set username, password
        $this->username = !empty($camera->generalProperties->user_name) ? $camera->generalProperties->user_name : null;
        $this->password = !empty($camera->generalProperties->password) ?  $camera->generalProperties->password : null;

        $ip = !empty($camera->generalProperties->ip) ? $camera->generalProperties->ip : null;
        if (empty($ip)) {
            $rtsp = !empty($camera->videoProperties->rtsp_url) ? $camera->videoProperties->rtsp_url : null;
            $ip = $this->getIpFromRtsp($rtsp);
        }

        // Call API goto preset
        $presetId = $camera->preset_id;
        if (empty($presetId)) {
            $presetId = $this->getPresetIdFromIp($ip);
            $camera->update(['preset_id' => $presetId]);
        }
        if ($presetId) {
            $urlCreatPreset = $this->getUrlGotoPreset($ip, $presetId);
            $response = $this->call('PUT', $urlCreatPreset, '');
            if ($response) {
                return response()->json($response, !empty($response['status']) ? $response['status'] : Response::HTTP_OK);
            }
        }

        return response()->json([], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function getPresetIdFromIp($ip)
    {
        $urlListPreset = $this->getUrlListPreset($ip);
        $dataPreset = $this->call('GET', $urlListPreset, '');
        $presets = !empty($dataPreset['data']['PTZPreset']) ? $dataPreset['data']['PTZPreset'] : [];
        $presetId = null;
        foreach ($presets as $key => $preset) {
            if (!empty($preset['enabled']) && $preset['enabled'] == 'true') {
                $presetId = !empty($preset['id']) ? $preset['id'] : null;
                break;
            }
        }

        return $presetId;
    }

    /**
     * Get info Device
     *
     * @param  mixed $camera
     * @return void
     */
    public function getInfoDevice(Camera $camera)
    {
        // Set username, password
        $this->username = !empty($camera->generalProperties->user_name) ? $camera->generalProperties->user_name : null;
        $this->password = !empty($camera->generalProperties->password) ?  $camera->generalProperties->password : null;

        $ip = !empty($camera->generalProperties->ip) ? $camera->generalProperties->ip : null;
        if (empty($ip)) {
            $rtsp = !empty($camera->videoProperties->rtsp_url) ? $camera->videoProperties->rtsp_url : null;
            $ip = $this->getIpFromRtsp($rtsp);
        }

        // Call API get info device
        $linkGetInfoDevice = $this->getUrlInfoDevice($ip);
        $response = $this->call('GET', $linkGetInfoDevice, '');

        return $response;
    }

    /**
     * Get info Device response json
     *
     * @param  mixed $camera
     * @return void
     */
    public function info(Camera $camera)
    {
        $response = $this->getInfoDevice($camera);

        if (empty($response)) {
            return response()->json([], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json($response, !empty($response['status']) ? $response['status'] : Response::HTTP_OK);
    }

    /**
     * Get Ip From Rtsp
     *
     * @return void
     */
    public function getIpFromRtsp($rtsp)
    {
        if (!is_string($rtsp)) {
            return;
        }

        return \Str::before(\Str::after($rtsp, '@'), '/');
    }

    /**
     * Get URL list PTZ
     *
     * @return void
     */
    public function getUrlPtz($ip)
    {
        $url = config('constants.CAMERA.PTZ.URL.PUT_PTZ', '');

        return $this->getLinkByIp($ip, $url);
    }

    /**
     * Get URL list Preset
     *
     * @return void
     */
    public function getUrlListPreset($ip)
    {
        $url = config('constants.CAMERA.PTZ.URL.GET_PRESET', '');

        return $this->getLinkByIp($ip, $url);
    }

    /**
     * Get URL Create Preset
     *
     * @return void
     */
    public function getUrlCreatePreset($ip, $idPreset)
    {
        $url = str_replace('$idPreset', $idPreset, config('constants.CAMERA.PTZ.URL.CREATE_PRESET', ''));

        return $this->getLinkByIp($ip, $url);
    }

    /**
     * Get URL Goto Preset
     *
     * @return void
     */
    public function getUrlGotoPreset($ip, $idPreset)
    {
        $url = str_replace('$idPreset', $idPreset, config('constants.CAMERA.PTZ.URL.GOTO_PRESET', ''));

        return $this->getLinkByIp($ip, $url);
    }

    /**
     * Get link
     *
     * @return void
     */
    public function getLinkByIp($ip, $url)
    {
        if (!is_string($ip)) {
            return;
        }

        return \Str::finish($ip, $url);
    }

    /**
     * Get URL list PTZ
     *
     * @return void
     */
    public function getUrlInfoDevice($ip)
    {
        $url = config('constants.CAMERA.PTZ.URL.GET_INFO', '');

        return $this->getLinkByIp($ip, $url);
    }

    /**
     * Call API camera
     *
     * @return void
     */
    public function call($method, $link, $body)
    {
        $client = new Client();

        $credentials = base64_encode($this->username. ':'. $this->password);

        try {
            $resClientRequest = $client->request($method, $link, [
                'headers' => [
                    'Content-Type'  => 'text/xml; charset=UTF8',
                    'Authorization' => ['Basic '. $credentials],
                ],
                'body' => $body
            ]);
            $xml = simplexml_load_string($resClientRequest->getBody(), 'SimpleXMLElement', LIBXML_NOCDATA);
            $data = json_decode(json_encode($xml), true);

            return [
                'status'  => $resClientRequest->getStatusCode(),
                'message' => '',
                'data'    => $data
            ];
        } catch (\Exception $e) {
            \Log::error($e);
            return [];
        }
    }

    /**
     * __set
     *
     * @param  mixed $key
     * @param  mixed $value
     * @return void
     */
    public function __set($key, $value)
    {
        if (property_exists($this, $key)) {
            $this->$key = $value;
        }

        return;
    }

    /**
     * __get
     *
     * @param  mixed $key
     * @return void
     */
    public function __get($key)
    {
        if (property_exists($this, $key)) {
            return $this->$key;
        }

        return;
    }
}
