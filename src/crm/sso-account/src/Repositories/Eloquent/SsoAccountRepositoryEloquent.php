<?php

namespace GGPHP\Crm\SsoAccount\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Crm\Category\Models\StatusParentPotential;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotential;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialStatusCare;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialTag;
use GGPHP\Crm\CustomerPotential\Models\PotentialStudentInfo;
use GGPHP\Crm\SsoAccount\Models\CustomerTag;
use GGPHP\Crm\SsoAccount\Models\SsoAccount;
use GGPHP\Crm\SsoAccount\Models\SsoAccountMarketingProgram;
use GGPHP\Crm\SsoAccount\Models\StudentInfo;
use GGPHP\Crm\SsoAccount\Presenters\SsoAccountPresenter;
use GGPHP\Crm\SsoAccount\Repositories\Contracts\SsoAccountRepository;
use Illuminate\Support\Facades\Http;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class SsoAccountRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SsoAccountRepositoryEloquent extends BaseRepository implements SsoAccountRepository
{

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return SsoAccount::class;
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
        return SsoAccountPresenter::class;
    }

    public function getSsoAccount(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $ssoAccount = $this->paginate($attributes['limit']);
        } else {
            $ssoAccount = $this->get();
        }

        return $ssoAccount;
    }
}
