<?php

namespace GGPHP\ThirdPartyService\Repositories\Eloquent;

use GGPHP\Camera\Models\Camera;
use GGPHP\ThirdPartyService\Models\ThirdPartyService;
use GGPHP\ThirdPartyService\Presenters\ThirdPartyServicePresenter;
use GGPHP\ThirdPartyService\Repositories\Contracts\ThirdPartyServiceRepository;
use Illuminate\Support\Facades\Http;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class ThirdPartyServiceRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ThirdPartyServiceRepositoryEloquent extends BaseRepository implements ThirdPartyServiceRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ThirdPartyService::class;
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
        return ThirdPartyServicePresenter::class;
    }

    /**
     * Get video walls
     *
     * @param array $attributes
     */
    public function getThirdPartyServices(array $attributes)
    {
        if (empty($attributes['limit'])) {
            $result = $this->all();
        } else {
            $result = $this->paginate($attributes['limit']);
        }

        return $result;
    }

    public function update($attributes, $id)
    {
        $thirdPartyService = ThirdPartyService::findOrFail($id);

        $thirdPartyService->update([
            'value' => $attributes['value']
        ]);

        return parent::find($id);
    }
}
