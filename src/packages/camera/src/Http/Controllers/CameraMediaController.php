<?php

namespace GGPHP\Camera\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Camera\Http\Requests\CameraPlayBackRequest;
use GGPHP\Camera\Http\Requests\CameraExportVideoRequest;
use Illuminate\Http\Response;
use GGPHP\Camera\Models\Camera;
use GuzzleHttp\Client;

class CameraMediaController extends Controller
{
    /**
     * Play back
     *
     * @param  mixed $request
     * @param  mixed $camera
     * @return Response
     */
    public function playback(CameraPlayBackRequest $request, Camera $camera)
    {
        $url = $this->getUrlPLayBack();
        $date = $request->date ? date('d-m-Y', strtotime($request->date)) : '';

        $startTime = $request->start_time ? $request->date . ' ' . $request->start_time : '';
        $endTime = $request->end_time ? $request->date . ' ' . $request->end_time : '';

        $body = [
            'camera_id'  => !empty($camera->uuid) ? $camera->uuid : '',
            'server_id'  => !empty($camera->cameraServer->uuid) ? $camera->cameraServer->uuid : '',
            'start_time' => $startTime,
            'end_time'   => $endTime
        ];

        // Call API play back
        $response = $this->call('POST', $url, $body);

        if (empty($response)) {
            return response()->json([], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json($response, !empty($response['status']) ? $response['status'] : Response::HTTP_OK);
    }

    /**
     * Export video
     *
     * @param  mixed $request
     * @param  mixed $camera
     * @return Response
     */
    public function exportVideo(CameraExportVideoRequest $request, Camera $camera)
    {
        $url = $this->getUrlExportVideo();

        $startTime = $request->start_time ? $request->date . ' ' . $request->start_time : '';
        $endTime = $request->end_time ? $request->date . ' ' . $request->end_time : '';

        $body = [
            'camera_id'  => !empty($camera->uuid) ? $camera->uuid : '',
            'server_id'  => !empty($camera->cameraServer->uuid) ? $camera->cameraServer->uuid : '',
            'start_time' => $startTime,
            'end_time'   => $endTime
        ];

        // Call API Export video
        $response = $this->call('POST', $url, $body);

        if (empty($response)) {
            return response()->json([], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json($response, !empty($response['status']) ? $response['status'] : Response::HTTP_OK);
    }

    /**
     * Get URL Play back
     *
     * @return void
     */
    public function getUrlPLayBack()
    {
        return \Str::finish(env('MEDIA_SERVER', ''), '/api/videos/playback');
    }

    /**
     * Get URL Export video
     *
     * @return void
     */
    public function getUrlExportVideo()
    {
        return \Str::finish(env('MEDIA_SERVER', ''), '/api/videos/export');
    }

    /**
     * Call API
     *
     * @return void
     */
    public function call($method, $url, $body)
    {
        $client = new Client();
        try {
            $resClientRequest = $client->request($method, $url, [
                'headers' => ['Content-Type' => 'application/json'],
                'body' => json_encode($body)
            ]);

            $data = json_decode($resClientRequest->getBody()->getContents());

            return [
                'status'  => $resClientRequest->getStatusCode(),
                'message' => $data->message,
                'data'    => $data->data
            ];
        } catch (\Exception $e) {
            \Log::error($e);
            return [];
        }
    }
}
