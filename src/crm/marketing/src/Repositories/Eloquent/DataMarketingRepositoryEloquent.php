<?php

namespace GGPHP\Crm\Marketing\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Crm\Marketing\Models\DataMarketing;
use GGPHP\Crm\Marketing\Models\DataMarketingProgram;
use GGPHP\Crm\Marketing\Models\Marketing;
use GGPHP\Crm\Marketing\Presenters\DataMarketingPresenter;
use GGPHP\Crm\Marketing\Presenters\MarketingPresenter;
use GGPHP\Crm\Marketing\Repositories\Contracts\DataMarketingRepository;
use GGPHP\Crm\Marketing\Repositories\Contracts\MarketingRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class MarketingRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class DataMarketingRepositoryEloquent extends BaseRepository implements DataMarketingRepository
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
        return DataMarketing::class;
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
        return DataMarketingPresenter::class;
    }

    public function getDataMarketing(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key'])
                ->orWhereLike('phone', $attributes['key'])->orWhereLike('phone', $attributes['key']);
        }

        if (!empty($attributes['search_source_id'])) {
            $this->model = $this->model->where('search_source_id', $attributes['search_source_id']);
        }

        if (!empty($attributes['marketing_program_id'])) {
            $this->model = $this->model->whereIn('id',function ($query) use ($attributes){
                $query->select('data_marketing_program.data_marketing_id')->from('data_marketing_program')->where('marketing_program_id',$attributes['marketing_program_id'])->get();
            });
        }

        if (!empty($attributes['limit'])) {
            $dataMarketing = $this->paginate($attributes['limit']);
        } else {
            $dataMarketing = $this->get();
        }

        return $dataMarketing;
    }

    public function create(array $attributes)
    {
        $now = Carbon::now()->setTimezone('GMT+7')->format('Ymd');
        $data_marketing_code = DataMarketing::max('code');

        if (is_null($data_marketing_code)) {
            $attributes['code'] = DataMarketing::CODE . $now . "01";
        } else {

            if (substr($data_marketing_code, 2, 8)  != $now) {
                $attributes['code'] = DataMarketing::CODE . $now . "01";
            } else {
                $stt = substr($data_marketing_code, 2) + 1;
                $attributes['code'] = DataMarketing::CODE . $stt;
            }
        }
        $dataMarketing = DataMarketing::create($attributes);

        return $this->parserResult($dataMarketing);
    }

    public function storeProgram($attributes)
    {
        $dataMarketing = DataMarketing::find($attributes['data_marketing_id']);
        $dataMarketing->marketingProgram()->attach($attributes['marketing_program_id']);

        return parent::parserResult($dataMarketing);
    }

    public function deleteProgram($attributes)
    {
        DataMarketingProgram::where('data_marketing_id',$attributes['data_marketing_id'])->where('marketing_program_id',$attributes['marketing_program_id'])->delete();
    
        return;
    }
}
