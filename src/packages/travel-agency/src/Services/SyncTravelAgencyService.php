<?php

namespace GGPHP\TravelAgency\Services;

use Carbon\Carbon;
use DateInterval;
use DateTime;
use Exception;
use GGPHP\LogTimes\Models\LogTime;
use GGPHP\TravelAgency\Models\TravelAgency;
use GGPHP\Users\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Webpatser\Uuid\Uuid;

class SyncTravelAgencyService
{
    private static function getUrl()
    {
        return env('URL_SYNC_DATA') . '/nghiepvu/dichvudulich/ds/LUHA/';
    }

    private static function getLoaiHinhDichVu($id, $token)
    {
        $url = env('URL_SYNC_DATA') . '/dungchung/loaihinhdichvudulich/id/' . $id;

        $source = Http::withToken($token)->get($url);
        if ($source->status() != 200) {
            throw new Exception($source->body(), $source->status());
        }

        $data = json_decode($source->body(), true);

        return $data;
    }

    private static function getDiaBan($id, $token)
    {
        $url = env('URL_SYNC_DATA') . '/dungchung/diaban/quanhuyen/' . $id;
        $source = Http::withToken($token)->get($url);
        if ($source->status() != 200) {
            throw new Exception($source->body(), $source->status());
        }
        $data = json_decode($source->body(), true);

        return $data;
    }

    public static function result($page, $limit, $token)
    {

        $listTravelAgencys = self::getDataTravelAgency($page, $limit, $token);

        $result = self::processData($listTravelAgencys, $token);

        self::insertTravelAgency($result);
    }

    public static function getPage($limit, $token)
    {
        $params = [
            'page' => 1,
            'isMaSort' => true,
            'isNameSort' => true,
            'search' => '',
            'itemPerPage' => $limit,
            'isNameEngSort' => true,
        ];


        $source = Http::withToken($token)->get(self::getUrl(), $params);
        if ($source->status() != 200) {
            throw new Exception($source->body(), $source->status());
        }

        $data = json_decode($source->body(), true);

        $totalLogTime = $data['pagination']['totalItemsCount'];
        $pages = round($totalLogTime / $limit + 1);

        return $pages;
    }

    public static function getDataTravelAgency($page, $limit, $token)
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


        $source = Http::withToken($token)->get(self::getUrl(), $params);

        $data = json_decode($source->body(), true);

        return $data;
    }

    public static function processData($listTravelAgencys, $token)
    {
        if (empty($listTravelAgencys['result'])) {
            return [];
        }

        $result = [];

        foreach ($listTravelAgencys['result'] as $key => $item) {

            $idTravelAgency = $item['id'];

            $travelAgency = TravelAgency::where('sync_data_id', $idTravelAgency)->first();

            if (is_null($travelAgency)) {
                $now = Carbon::now()->format('Y-m-d H:m:s');
                $loaihinhdichvu = self::getLoaiHinhDichVu($item['loaiHinhDichVu'], $token);

                $diaban = null;
                if (!empty($item['diaBan'])) {
                    $diaban = self::getDiaBan($item['diaBan'], $token);
                }

                $itemDetail = [
                    'id' => Uuid::generate(4)->string,
                    'name' => $item['ten'],
                    'representative_name' => $item['tenDaiDien'],
                    'representative_phone' => $item['sdtDaiDien'],
                    'english_name' => $item['tenTiengAnh'],
                    'number_of_seasonal_worker' => $item['soLuongNhanLucThoiVu'],
                    'travel_permit' => $item['giayPhepKinhDoanh'],
                    'account_name' => $item['taiKhoan'],
                    'service_type' => $loaihinhdichvu['result']['ma'],
                    'license_date' => $item['ngayCapGpkd'],
                    'phone' => $item['sdt'],
                    'status' => $item['trangThai'],
                    'operator_name' => $item['tenDieuHanh'],
                    'operator_phone' => $item['sdtDieuHanh'],
                    'address' => $item['diaChi'],
                    'license_number' => $item['giayPhepLuHanh'],
                    'email' => $item['email'],
                    'date_range' => $item['ngayCapGiayPhepLuHanh'],
                    'reporter_name' => $item['tenBaoCao'],
                    'reporter_phone' => $item['sdtBaoCao'],
                    'fax' => $item['fax'],
                    'website' => $item['website'],
                    'number_of_regular_employee' => $item['soLuongNhanLucThuongXuyen'],
                    'total_number_of_registered_vehicle' => $item['tongSoXeDangKy'],
                    'locality' =>  $diaban ? $diaban['result']['ten'] : null,
                    'tax_code' => $item['mst'],
                    'note' => $item['ghiChu'],
                    'sync_data_id' => $item['id'],
                    'created_at' => $now,
                    'updated_at' => $now
                ];

                $result[] = $itemDetail;
            }
        }

        return $result;
    }

    public static function insertTravelAgency($listTravelAgencys)
    {
        TravelAgency::insert($listTravelAgencys);
    }
}
