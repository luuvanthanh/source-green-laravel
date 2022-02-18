<?php

namespace GGPHP\NasConfig\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Camera\Models\Camera;
use GGPHP\NasConfig\Models\NasConfig;
use GGPHP\NasConfig\Presenters\NasConfigPresenter;
use GGPHP\NasConfig\Repositories\Contracts\NasConfigRepository;
use Illuminate\Support\Facades\Http;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class NasConfigRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class NasConfigRepositoryEloquent extends BaseRepository implements NasConfigRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at'
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return NasConfig::class;
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
        return NasConfigPresenter::class;
    }

    public function createOrUpdate(array $attributes)
    {
        NasConfig::updateOrCreate(['id' => '2ed4a57e-6643-48ab-a5ed-84afe73a84f4'], $attributes);

        return parent::first();
    }

    public function getNasConfig($attributes)
    {
        $nasConfig = NasConfig::find($attributes['id']);

        if (is_null($nasConfig)) {
            $nasConfig = NasConfig::insert([
                'id' => '2ed4a57e-6643-48ab-a5ed-84afe73a84f4',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        return parent::find($attributes['id']);
    }
}
