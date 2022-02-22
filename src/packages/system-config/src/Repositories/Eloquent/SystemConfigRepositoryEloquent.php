<?php

namespace GGPHP\SystemConfig\Repositories\Eloquent;

use GGPHP\Camera\Models\Camera;
use GGPHP\SystemConfig\Models\EmailVariable;
use GGPHP\SystemConfig\Models\SystemConfig;
use GGPHP\SystemConfig\Models\TeamplateEmail;
use GGPHP\SystemConfig\Presenters\SystemConfigPresenter;
use GGPHP\SystemConfig\Repositories\Contracts\SystemConfigRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class SystemConfigRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SystemConfigRepositoryEloquent extends BaseRepository implements SystemConfigRepository
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
        return SystemConfig::class;
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
        return SystemConfigPresenter::class;
    }

    /**
     * Get video walls
     *
     * @param array $attributes
     */
    public function getSystemConfigs(array $attributes)
    {
        if (empty($attributes['limit'])) {
            $result = $this->all();
        } else {
            $result = $this->paginate($attributes['limit']);
        }

        return $result;
    }

    public function create($attributes)
    {
        $systemConfig = SystemConfig::first();
        $systemConfig->update([
            'language' => 'vi',
            'account_send_email' => 'sdl@egov.vn'
        ]);

        $systemConfig->receiveEmail()->detach();

        foreach ($systemConfig->teamplateEmail as $key => $teamplateEmail) {
            $teamplateEmail->update([
                'is_on' => false
            ]);
        }

        return parent::parserResult($systemConfig);
    }

    public function updateReceiveEmail($attributes)
    {
        $systemConfig = SystemConfig::first();

        $systemConfig->receiveEmail()->sync($attributes['receive_email']);

        return parent::parserResult($systemConfig);
    }

    public function onOffTeamplateEmail($attributes, $id)
    {
        $teamplateEmail = TeamplateEmail::find($id);

        $teamplateEmail->update([
            'is_on' => $attributes['is_on']
        ]);

        return true;
    }

    public function updateTeamplateEmail($attributes, $id)
    {
        $teamplateEmail = TeamplateEmail::find($id);

        $teamplateEmail->update($attributes);

        return true;
    }
}
