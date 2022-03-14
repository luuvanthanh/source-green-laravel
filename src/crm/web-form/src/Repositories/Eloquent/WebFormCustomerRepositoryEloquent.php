<?php

namespace GGPHP\Crm\WebForm\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Crm\Category\Models\SearchSource;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\CustomerLead\Models\StatusLead;
use GGPHP\Crm\CustomerLead\Models\StudentInfo;
use GGPHP\Crm\Facebook\Services\FacebookService;
use GGPHP\Crm\WebForm\Models\WebFormCustomer;
use GGPHP\Crm\WebForm\Models\PostFacebookInfo;
use GGPHP\Crm\WebForm\Models\WebFormChildren;
use GGPHP\Crm\WebForm\Presenters\WebFormCustomerPresenter;
use GGPHP\Crm\WebForm\Repositories\Contracts\WebFormCustomerRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Illuminate\Container\Container as Application;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class WebFormCustomerRepositoryEloquent extends BaseRepository implements WebFormCustomerRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return WebFormCustomer::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return WebFormCustomerPresenter::class;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $webFormCustomerCustomer = WebFormCustomer::create($attributes);
            foreach ($attributes['web_form_childrens'] as $value) {
                $value['web_form_customer_id'] = $webFormCustomerCustomer->id;
                WebFormChildren::create($value);
            }

            $now = Carbon::now()->setTimezone('GMT+7')->format('Ymd');
            $customerLead_code = CustomerLead::max('code');

            if (is_null($customerLead_code)) {
                $attributes['code'] = CustomerLead::CODE . $now . '01';
            } else {

                if (substr($customerLead_code, 2, 8)  != $now) {
                    $attributes['code'] = CustomerLead::CODE . $now . '01';
                } else {
                    $stt = substr($customerLead_code, 2) + 1;
                    $attributes['code'] = CustomerLead::CODE . $stt;
                }
            }

            if (strpos($attributes['url'], 'fbclid') !== false) {
                $searchSource = SearchSource::where('type', SearchSource::FANPAGE)->first();
                $attributes['search_source_id'] = $searchSource->id;
            } elseif (strpos($attributes['url'], 'utm_source=zalo') !== false) {
                $searchSource = SearchSource::where('type', SearchSource::ZALO)->first();
                $attributes['search_source_id'] = $searchSource->id;
            }
            $customerLead = CustomerLead::create($attributes);
            $dataStatusLead = [
                'customer_lead_id' => $customerLead->id,
                'status' => StatusLead::STATUS_LEAD['LEAD_NEW']
            ];
            StatusLead::create($dataStatusLead);
            $customerLead->marketingProgram()->attach($attributes['marketing_program_id']);
            foreach ($attributes['web_form_childrens'] as $value) {
                $value['customer_lead_id'] = $customerLead->id;
                StudentInfo::create($value);
            }
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }


        return parent::parserResult($webFormCustomerCustomer);
    }
}
