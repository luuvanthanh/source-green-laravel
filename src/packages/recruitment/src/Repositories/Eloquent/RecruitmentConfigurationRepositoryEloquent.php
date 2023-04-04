<?php

namespace GGPHP\Recruitment\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Recruitment\Models\ConfigureThank;
use GGPHP\Recruitment\Models\RecruitmentConfiguration;
use GGPHP\Recruitment\Models\RecruitmentQuestion;
use GGPHP\Recruitment\Presenters\RecruitmentConfigurationPresenter;
use GGPHP\Recruitment\Repositories\Contracts\RecruitmentConfigurationRepository;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class LevelRepositoryEloquent.
 *
 * @package namespace GGPHP\Recruitment\Repositories\Eloquent;
 */
class RecruitmentConfigurationRepositoryEloquent extends CoreRepositoryEloquent implements RecruitmentConfigurationRepository
{
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return RecruitmentConfiguration::class;
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
        return RecruitmentConfigurationPresenter::class;
    }

    public function getRecruitmentConfiguration(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Code', $attributes['key']);
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Note', $attributes['key']);
            })->orWhereHas('level', function ($query) use ($attributes) {
                $query->whereLike('Name', $attributes['key']);
            })->orWhereHas('division', function ($query) use ($attributes) {
                $query->whereLike('Name', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $recruitmentConfigurations = $this->paginate($attributes['limit']);
        } else {
            $recruitmentConfigurations = $this->get();
        }

        return $recruitmentConfigurations;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {

            $attributes = $this->creating($attributes);

            $result = RecruitmentConfiguration::create($attributes);

            if (!empty($attributes['data'])) {
                $this->createRecruitmentQuestion($attributes['data'], $result->Id);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();

            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($result);
    }

    public function creating($attributes)
    {
        $code = RecruitmentConfiguration::latest()->first();

        if (is_null($code)) {
            $code = RecruitmentConfiguration::CODE . '001';
        } else {
            $stt = substr($code->Code, 4);
            $stt += 1;

            if (strlen($stt) == 1) {
                $code = RecruitmentConfiguration::CODE . '00' . $stt;
            } elseif (strlen($stt) == 2) {
                $code = RecruitmentConfiguration::CODE . '0' . $stt;
            } else {
                $code = RecruitmentConfiguration::CODE . $stt;
            }
        }
        $attributes['Code'] = $code;

        return $attributes;
    }

    public function createRecruitmentQuestion($data, $recruitmentConfigurationId)
    {
        foreach ($data as $key => $value) {
            $value['RecruitmentConfigurationId'] = $recruitmentConfigurationId;

            RecruitmentQuestion::create($value);
        }
    }

    public function update(array $attributes, $id)
    {
        $recruitmentConfiguration = RecruitmentConfiguration::findOrfail($id);

        $this->updating($recruitmentConfiguration, $attributes);

        $recruitmentConfiguration->update($attributes);

        return parent::find($id);
    }

    public function updating($recruitmentConfiguration, $attributes)
    {
        $recruitmentConfiguration->question()->delete();

        $this->createRecruitmentQuestion($attributes['data'], $recruitmentConfiguration->Id);
    }

    public function getConfigureThanks(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $configureThanks = ConfigureThank::paginate($attributes['limit']);
        } else {
            $configureThanks = ConfigureThank::get();
        }
        return parent::parserResult($configureThanks);
    }

    public function storeConfigureThanks(array $attributes)
    {
        DB::table('ConfigureThanks')->delete();

        $result = ConfigureThank::create($attributes);

        return parent::parserResult($result);
    }
}
