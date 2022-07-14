<?php

namespace GGPHP\Crm\Category\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use Illuminate\Database\Eloquent\SoftDeletes;

class SearchSource extends UuidModel
{
    use SoftDeletes;

    const CODE = 'N';
    const DATA_MKT = 'DATA_MKT';
    const WEBSITE = 'WEBSITE';
    const FANPAGE = 'FANPAGE';
    const KIDDIHUB = 'KIDDIHUB';
    const DI_NGANG = 'DI_NGANG';
    const NQGT = 'NQGT';
    const DATA_TIEM_NANG = 'DATA_TIEM_NANG';
    const DATA_KHAC = 'DATA_KHAC';
    const YOUTUBE = 'YOUTUBE';
    const TIKTOK = 'TIKTOK';
    const ZALO = 'ZALO';

    protected $table = 'search_sources';

    protected $fillable = ['code', 'name', 'type', 'data_default'];

    public function customerLead()
    {
        return $this->hasMany(CustomerLead::class);
    }
}
