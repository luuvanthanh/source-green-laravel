<?php

namespace GGPHP\Core\Models;

use Illuminate\Database\Eloquent\Model;
use Prettus\Repository\Contracts\Presentable;
use Prettus\Repository\Traits\PresentableTrait;
use GGPHP\Core\Traits\CastDatetimeFormatTrait;
use Illuminate\Database\Eloquent\Builder;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\Traits\CausesActivity;

class CoreModel extends Model implements Presentable
{
    use PresentableTrait, LogsActivity, CausesActivity, CastDatetimeFormatTrait;

    protected static $logFillable = true;

    /**
     * Anonymous scope
     */
    protected static function boot()
    {
        parent::boot();


        static::addGlobalScope('exclude', function (Builder $builder) {

            if (!is_null(request()->exclude_field)) {
                $excludeField = explode(',', request()->exclude_field);

                $model =  $builder->getModel();
                $fillables = $model->getFillable();

                if (method_exists($model, 'getDateTimeFields')) {
                    $fillables = array_merge($fillables, $model->getDateTimeFields());
                }


                $builder->select(array_diff($fillables, $excludeField));
            }
        });
    }

    public function scopeWhereLike($query, $key, $value)
    {
        $value = mb_strtoupper($this->convert_vi_to_en($value));

        $key = '"' . $key . '"';

        return $query->orWhereRaw('public.unaccent(' . $key . ') ILIKE ' . "'" . '%' . $value . '%' . "'");
    }

    public function scopeOrWhereLike($query, $key, $value)
    {
        $value = mb_strtoupper($this->convert_vi_to_en($value));

        $key = '"' . $key . '"';

        return $query->orWhereRaw('public.unaccent(' . $key . ') ILIKE ' . "'" . '%' . $value . '%' . "'");
    }

    public function convert_vi_to_en($str)
    {
        $str = preg_replace('/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/', 'a', $str);
        $str = preg_replace('/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/', 'e', $str);
        $str = preg_replace('/(ì|í|ị|ỉ|ĩ)/', 'i', $str);
        $str = preg_replace('/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/', 'o', $str);
        $str = preg_replace('/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/', 'u', $str);
        $str = preg_replace('/(ỳ|ý|ỵ|ỷ|ỹ)/', 'y', $str);
        $str = preg_replace('/(đ)/', 'd', $str);
        $str = preg_replace('/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/', 'A', $str);
        $str = preg_replace('/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/', 'E', $str);
        $str = preg_replace('/(Ì|Í|Ị|Ỉ|Ĩ)/', 'I', $str);
        $str = preg_replace('/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/', 'O', $str);
        $str = preg_replace('/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/', 'U', $str);
        $str = preg_replace('/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/', 'Y', $str);
        $str = preg_replace('/(Đ)/', 'D', $str);
        return $str;
    }
}
