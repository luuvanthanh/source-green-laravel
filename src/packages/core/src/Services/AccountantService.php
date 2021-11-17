<?php

namespace GGPHP\Core\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AccountantService
{
    public static function createOrUpdateProduct (array $attributes)
    {
        $url = env('ACCOUNTANT_URL') . '/api/app/item/master';
        $bearerToken = request()->bearerToken();

        $response = Http::withToken("$bearerToken")->put("$url",$attributes);

        if($response->failed()) {
            $message = "Có lỗi từ api kế toán";
            if(isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "Kế toán: ". json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function deleteProduct($id)
    {
        $bearerToken = request()->bearerToken();
        $url = env('ACCOUNTANT_URL') . '/api/app/item/'. $id;

        $response = Http::withToken("$bearerToken")->delete("$url");

        if($response->failed()) {
            $message = "Có lỗi từ api kế toán";
            if(isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "Kế toán: ". json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return true;
    }

    public static function stockOut(array $attributes)
    {
        $bearerToken = request()->bearerToken();
        $url = env('ACCOUNTANT_URL') . '/api/app/stock-out/master';

        $response = Http::withToken("$bearerToken")->put("$url",$attributes);

        if($response->failed()) {
            $message = "Có lỗi từ api kế toán";
            if(isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "Kế toán: ". json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function stockOutDelete($id)
    {
        $bearerToken = request()->bearerToken();
        $url = env('ACCOUNTANT_URL') . '/api/app/stock-out/'. $id;
        
        $response = Http::withToken("$bearerToken")->delete("$url");

        if($response->failed()) {
            $message = "Có lỗi từ api kế toán";
            if(isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "Kế toán: ". json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return true;
    }

    public static function createOrUpdateReceipt(array $attributes)
    {
        $bearerToken = request()->bearerToken();

         $url = env('ACCOUNTANT_URL') . '/api/app/receipt/master';
         $response = Http::withToken("$bearerToken")->put("$url",$attributes);

         if($response->failed()) {
            $message = "Có lỗi từ api kế toán";
            if(isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "Kế toán: ". json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

         return json_decode($response->body());
    }

    public static function inventoryCheck($id)
    {
        $url = env('ACCOUNTANT_URL') . '​/api/app/stock-transaction/datainventorystockbylistItemId';

        $response = Http::get("$url",[
            'listItemId' => $id
        ]);

        if($response->failed()) {
            $message = "Có lỗi từ api kế toán";
            if(isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "Kế toán: ". json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        $quantity = 0;

        if(!empty(json_decode($response->body()))){
            $quantity = json_decode($response->body())[0]->quantity;
        }
       return $quantity;
    }

    public static function aggregateInventory(array $attributes)
    {
        $bearerToken = request()->bearerToken();
        
        $url = env('ACCOUNTANT_URL') . '​/api/app/report/financebycondition';
        $response = Http::withToken("$bearerToken")->get("$url",$attributes);

        if($response->failed()) {
            $message = "Có lỗi từ api kế toán";
            if(isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "Kế toán: ". json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

       return json_decode($response->body());
    }

    public static function createOrUpdateMeasureUnit($attributes)
    {
        $bearerToken = request()->bearerToken();

        $url = env('ACCOUNTANT_URL') . '​/api/app/measure-unit/data-or-create-by-name-list?listname='. $attributes;
        $response = Http::withToken("$bearerToken")->get("$url");

        if($response->failed()) {
            $message = "Có lỗi từ api kế toán";
            if(isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "Kế toán: ". json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

       return json_decode($response->body())[0];
    }

    public static function createSupplier($attributes)
    {
        $url = env('ACCOUNTANT_URL') . '/api/app/business-object/sync-master';
        $bearerToken = request()->bearerToken();

        $response = Http::withToken("$bearerToken")->post("$url", $attributes);

        if($response->failed()) {
            $message = "Có lỗi từ api kế toán";
            if(isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "Kế toán: ". json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function updateSupplier($attributes)
    {
        $url = env('ACCOUNTANT_URL') . '/api/app/business-object/sync-master';
        $bearerToken = request()->bearerToken();

        $response = Http::withToken("$bearerToken")->put("$url", $attributes);

        if($response->failed()) {
            $message = "Có lỗi từ api kế toán";
            if(isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "Kế toán: ". json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function deleteSupplier($id)
    {
        $url = env('ACCOUNTANT_URL') . '/api/app/business-object/'.$id;
        $bearerToken = request()->bearerToken();

        $response = Http::withToken("$bearerToken")->delete("$url");

        if($response->failed()) {
            $message = "Có lỗi từ api kế toán";
            if(isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "Kế toán: ". json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function createOrUpdatePayment(array $attributes)
    {
        $bearerToken = request()->bearerToken();

         $url = env('ACCOUNTANT_URL') . '/api/app/payment/master';
         $response = Http::withToken("$bearerToken")->put("$url",$attributes);

         if($response->failed()) {
            $message = "Có lỗi từ api kế toán";
            if(isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "Kế toán: ". json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

         return json_decode($response->body());
    }

    public static function checkStatusStockOut($id)
    {
        $bearerToken = request()->bearerToken();

        $url = env('ACCOUNTANT_URL') . '/api/app/stock-out/statusCodeById/'. $id;
        $response = Http::withToken("$bearerToken")->get("$url");

        if($response->failed()) {
            $message = "Có lỗi từ api kế toán";
            if(isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "Kế toán: ". json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

       return $response->body();
    }
}
