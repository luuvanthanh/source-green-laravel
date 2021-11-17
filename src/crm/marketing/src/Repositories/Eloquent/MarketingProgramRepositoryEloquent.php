<?php

namespace GGPHP\Crm\Marketing\Repositories\Eloquent;

use GGPHP\Crm\Marketing\Models\MarketingProgram;
use GGPHP\Crm\Marketing\Presenters\MarketingProgramPresenter;
use GGPHP\Crm\Marketing\Repositories\Contracts\MarketingProgramRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class MarketingProgramRepositoryEloquent extends BaseRepository implements MarketingProgramRepository
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
        return MarketingProgram::class;
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
        return MarketingProgramPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key']);
        }

        if (isset($attributes['status'])) {
            $this->model = $this->model->where('status', $attributes['status']);
        }

        if (!empty($attributes['limit'])) {
            $marketingProgram = $this->paginate($attributes['limit']);
        } else {
            $marketingProgram = $this->get();
        }

        return $marketingProgram;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {

            $code = MarketingProgram::max('code');

            if (is_null($code)) {
                $attributes['code'] = MarketingProgram::CODE . "1";
            } else {
                $getNumber = substr($code, 2) + 1;
                $attributes['code'] = MarketingProgram::CODE . "$getNumber";
            }

            $marketingProgram = MarketingProgram::create($attributes);
            $marketingProgram->link_web_form = env('LINK_WEB_FORM') . $marketingProgram->id;
            $marketingProgram->update();

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($marketingProgram);
    }
}
