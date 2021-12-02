<?php

namespace GGPHP\Crm\Config\Repositories\Eloquent;

use GGPHP\Crm\Config\Models\ConfigMedicalDeclare;
use GGPHP\Crm\Config\Models\ConfigMedicalDeclareDetail;
use GGPHP\Crm\Config\Presenters\ConfigMedicalDeclarePresenter;
use GGPHP\Crm\Config\Repositories\Contracts\ConfigMedicalDeclareRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ConfigMedicalDeclareRepositoryEloquent extends BaseRepository implements ConfigMedicalDeclareRepository
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
        return ConfigMedicalDeclare::class;
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
        return ConfigMedicalDeclarePresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $configMedicalDeclare = $this->paginate($attributes['limit']);
        } else {
            $configMedicalDeclare = $this->get();
        }

        return $configMedicalDeclare;
    }

    public function createOrUpdate(array $attributes)
    {
        if (!empty($attributes['createRows'])) {
            foreach ($attributes['createRows'] as $value) {
                $value['type'] = ConfigMedicalDeclare::TYPE[$value['type']];
                $medicalDeclare = ConfigMedicalDeclare::create($value);

                foreach ($value['detail'] as $valueDetail) {
                    $valueDetail['config_madical_declare_id'] = $medicalDeclare->id;
                    ConfigMedicalDeclareDetail::create($valueDetail);
                }
            }
        }

        if (!empty($attributes['updateRows'])) {
            foreach ($attributes['updateRows'] as $value) {
                ConfigMedicalDeclareDetail::where('config_madical_declare_id', $value['id'])->delete();
                $medicalDeclare = ConfigMedicalDeclare::find($value['id']);
                $value['type'] = ConfigMedicalDeclare::TYPE[$value['type']];
                $medicalDeclare->update($value);

                foreach ($value['detail'] as $valueDetail) {
                    $valueDetail['config_madical_declare_id'] = $medicalDeclare->id;
                    ConfigMedicalDeclareDetail::create($valueDetail);
                }
            }
        }

        if (!empty($attributes['deleteRows'])) {
            ConfigMedicalDeclare::whereIn('id', $attributes['deleteRows'])->delete();
        }

        return parent::all();
    }
}
