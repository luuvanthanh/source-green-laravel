<?php

namespace GGPHP\TourGuide\Services;

use Carbon\Carbon;
use DateInterval;
use DateTime;
use Exception;
use GGPHP\LogTimes\Models\LogTime;
use GGPHP\TourGuide\Models\TourGuide;
use GGPHP\Users\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Webpatser\Uuid\Uuid;

class SyncTourGuideService
{
    private static function getUrl()
    {
        return env('URL_SYNC_DATA') . '/nghiepvu/huongdanvien/ds/';
    }
    private static function getUrlDetail($id)
    {
        return env('URL_SYNC_DATA') . '/nghiepvu/huongdanvien/idhdv/' . $id;
    }

    public static function result($page, $limit)
    {

        $listTourGuides = self::getDataTourGuide($page, $limit);

        $result = self::processData($listTourGuides);

        self::insertTourGuide($result);
    }

    public static function getPage($limit)
    {
        $params = [
            'page' => 1,
            'isMaSort' => false,
            'isNameSort' => false,
            'sortType' => 'asc',
            'search' => '',
            'itemPerPage' => $limit,
            'idDichvudulich' => '',
            'idChihoi' => '',
            'idLoaihuongdanvien' => '',
            'tuNgay' => '',
        ];

        $source = Http::get(self::getUrl(), $params);

        if ($source->status() != 200) {
            throw new Exception($source->body(), $source->status());
        }

        $data = json_decode($source->body(), true);
        $totalLogTime = $data['pagination']['totalItemsCount'];
        $pages = round($totalLogTime / $limit + 1);

        return $pages;
    }

    public static function getDataTourGuide($page, $limit)
    {
        $params = [
            'page' => $page,
            'isMaSort' => false,
            'isNameSort' => false,
            'sortType' => 'asc',
            'search' => '',
            'itemPerPage' => $limit,
            'idDichvudulich' => '',
            'idChihoi' => '',
            'idLoaihuongdanvien' => '',
            'tuNgay' => '',
        ];


        $source = Http::get(self::getUrl(), $params);

        $data = json_decode($source->body(), true);

        return $data;
    }

    public static function processData($listTourGuides)
    {
        if (empty($listTourGuides['result'])) {
            return [];
        }

        $result = [];

        foreach ($listTourGuides['result'] as $key => $item) {

            $idTourGuide = $item['id'];

            $tourGuide = TourGuide::where('sync_data_id', $idTourGuide)->first();

            if (is_null($tourGuide)) {
                $expirationDate = null;

                if (!is_null($item['hetHanMaThe'])) {
                    if (!date_create($item['hetHanMaThe'])) {
                        $expirationDate = Carbon::createFromFormat('d/m/Y', $item['hetHanMaThe'])->format('Y-m-d');
                    } else {
                        $expirationDate = Carbon::parse($item['hetHanMaThe'])->format('Y-m-d');
                    }
                }
                $cardTypeId =  $item['loai'] == 0 ? 'cb5aa272-6274-4f8e-8253-abe36e5cb5e4' : 'babee3af-d5a4-4906-80f3-a70f115e96f9';
                $now = Carbon::now()->format('Y-m-d H:m:s');

                $sourceDetail = Http::get(self::getUrlDetail($item['id']));
                $dataDetail = json_decode($sourceDetail->body(), true);


                $url = null;
                if (!empty($dataDetail['result']['hinhanh'])) {
                    $url = $dataDetail['result']['hinhanh'][0]['filePath'];

                    $handle = curl_init($url);
                    curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
                    curl_exec($handle);
                    /* Check for 404 (file not found). */
                    $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);

                    if ($httpCode != 404) {
                        if ($dataDetail['result']['hinhanh'][0]['filePath'] == trim($dataDetail['result']['hinhanh'][0]['filePath']) && strpos($dataDetail['result']['hinhanh'][0]['filePath'], ' ') !== false) {
                            $arrayImage = explode('/', $dataDetail['result']['hinhanh'][0]['filePath']);
                            $url = null;

                            for ($i = 0; $i < count($arrayImage) - 1; $i++) {
                                $url .= $arrayImage[$i] . '/';
                            }

                            $url .= rawurlencode(end($arrayImage));
                        }
                    }
                }


                $itemDetail = [
                    'id' => Uuid::generate(4)->string,
                    'full_name' => $item['ten'],
                    'date_of_birth' => $item['ngaySinh'],
                    'card_type_id' => $cardTypeId,
                    'sex' => $item['gioiTinh'] >= 0 ? $item['gioiTinh'] : 0,
                    'expiration_date' => $expirationDate,
                    'degree' => $item['bangCap'],
                    'professional_certificate' => $item['chungChiNghiepVu'],
                    'note' => $item['ghiChu'],
                    'type' => TourGuide::TYPE['LEGAL'],
                    'sync_data_id' => $item['id'],
                    'url_sso_image' => $url,
                    'created_at' => $now,
                    'updated_at' => $now
                ];


                $result[] = $itemDetail;
            }
        }

        return $result;
    }

    public static function insertTourGuide($listTourGuides)
    {
        TourGuide::insert($listTourGuides);
    }

    public static function insertImage($listTourGuides)
    {
        foreach ($listTourGuides as $key => $value) {
            if (!is_null($value->getAvatar())) {
                continue;
            }
            if (is_null($value->sync_data_id)) {
                continue;
            }

            $source = Http::get(self::getUrlDetail($value->sync_data_id));

            if ($source->status() != 200) {
                throw new Exception($source->body(), $source->status());
            }

            $data = json_decode($source->body(), true);

            if (empty($data['result']['hinhanh'])) {
                continue;
            }

            $url = $data['result']['hinhanh'][0]['filePath'];

            $handle = curl_init($url);
            curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
            curl_exec($handle);
            /* Check for 404 (file not found). */
            $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);

            if ($httpCode == 404) {
                continue;
            }

            if ($data['result']['hinhanh'][0]['filePath'] == trim($data['result']['hinhanh'][0]['filePath']) && strpos($data['result']['hinhanh'][0]['filePath'], ' ') !== false) {
                $arrayImage = explode('/', $data['result']['hinhanh'][0]['filePath']);
                $url = null;

                for ($i = 0; $i < count($arrayImage) - 1; $i++) {
                    $url .= $arrayImage[$i] . '/';
                }

                $url .= rawurlencode(end($arrayImage));
            }

            $value->update([
                'url_sso_image' => $url,
            ]);
            // $value->addMediaFromUrl($url)->usingName($data['result']['hinhanh'][0]['filename'])->preservingOriginal()->toMediaCollection('avatar');
        }

        return true;
    }
}
