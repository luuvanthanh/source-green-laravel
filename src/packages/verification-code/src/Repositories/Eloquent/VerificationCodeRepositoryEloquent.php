<?php

namespace GGPHP\VerificationCode\Repositories\Eloquent;

use GGPHP\Camera\Models\Camera;
use GGPHP\VerificationCode\Models\VerificationCode;
use GGPHP\VerificationCode\Presenters\VerificationCodePresenter;
use GGPHP\VerificationCode\Repositories\Contracts\VerificationCodeRepository;
use Illuminate\Support\Facades\Http;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class VerificationCodeRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class VerificationCodeRepositoryEloquent extends BaseRepository implements VerificationCodeRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return VerificationCode::class;
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
        return VerificationCodePresenter::class;
    }

    /**
     * Get video walls
     *
     * @param array $attributes
     */
    public function getVerificationCodes(array $attributes)
    {
        if (empty($attributes['limit'])) {
            $result = $this->all();
        } else {
            $result = $this->paginate($attributes['limit']);
        }

        return $result;
    }
}
