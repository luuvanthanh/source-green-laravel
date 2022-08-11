<?php

namespace GGPHP\Core\Traits;

use Carbon\Carbon;
use GGPHP\ApiShare\Models\AccessApi;
use GGPHP\ApiShare\Models\ApiShare;

trait ResponseTrait
{
    /**
     * Return success response
     *
     * @param any $result
     * @param string $message
     * @param array $options
     * @return \Illuminate\Http\Response
     */
    public function success($result, $message = '', $options = [])
    {

        $isContainByDataString = false;
        $code = 200;
        if (!empty($options) && array_key_exists('isShowData', $options)) {
            $isShowData = $options['isShowData'];
        }
        if (!empty($options) && array_key_exists('isContainByDataString', $options)) {
            $isContainByDataString = $options['isContainByDataString'];
        }
        if (!empty($options) && array_key_exists('code', $options)) {
            $code = $options['code'];
        }
        $response = [
            'status' => $code,
            'title' => $message,
        ];

        $routeName = request()->route()->getName();
        $apiShare = ApiShare::where('name_route', $routeName)->first();

        if (!is_null($apiShare)) {
            $dataAccessApi = [
                'api_share_id' => $apiShare->id,
                'time' => Carbon::now()->format('Y-m-d H:i:s'),
                'status' => $code,
                'response' => json_encode($result)
            ];
            AccessApi::create($dataAccessApi);
        }

        if ($isContainByDataString) {
            $result = ['data' => $result];
        }

        $response = array_merge($response, $result);


        return response()->json($response, $code);
    }

    /**
     * Return error response
     *
     * @param string $error
     * @param array/string $errorMessages
     * @param integer $code
     * @return \Illuminate\Http\Response
     */
    public function error($error, $message = [], $code = 404)
    {
        $response = [
            'status' => $code,
            'title' => $error,
            'errors' => [],
        ];
        if (!empty($message) && is_string($message)) {
            $response['errors'][] = [
                'title' => $error,
                'detail' => $message,
            ];
        } else {
            $detailErrors = array_unique(array_flatten(is_array($message) ? $message : $message->toArray()));
            foreach ($detailErrors as $detailError) {
                $response['errors'][] = [
                    'title' => $error,
                    'detail' => $detailError,
                ];
            }
        }
        if (empty($message)) {
            $response['errors'][] = [
                'title' => $error,
                'detail' => $error,
            ];
        }
        return response()->json($response, $code);
    }
}
