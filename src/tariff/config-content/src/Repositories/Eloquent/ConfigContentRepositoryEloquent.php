<?php

namespace GGPHP\Tariff\ConfigContent\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Tariff\ConfigContent\Models\ConfigContent;
use GGPHP\Tariff\ConfigContent\Models\ConfigContentDetail;
use GGPHP\Tariff\ConfigContent\Presenters\ConfigContentPresenter;
use GGPHP\Tariff\ConfigContent\Repositories\ConfigContentRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ConfigContentRepositoryEloquent extends CoreRepositoryEloquent implements ConfigContentRepository
{
    protected $fieldSearchable = [
        'Id', 'CreationTime'
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ConfigContent::class;
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
        return ConfigContentPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $configContent = $this->paginate($attributes['limit']);
        } else {
            $configContent = $this->get();
        }

        return $configContent;
    }
    
    public function create(array $attributes)
    {
        $configContent = ConfigContent::first();

        if (!empty($configContent)) {
            $configContent->update($attributes);
        } else {
            $configContent = ConfigContent::create($attributes);
        }

        if (!empty($attributes['detail'])) {
            $configContent->configContentDetail()->delete();

            foreach ($attributes['detail'] as $value) {
                $value['ConfigContentId'] = $configContent->Id;
                ConfigContentDetail::create($value);
            }
        }

        return parent::find($configContent->Id);
    }
}
