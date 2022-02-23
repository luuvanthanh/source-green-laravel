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
        if (!empty($attributes['create_rows'])) {
            foreach ($attributes['create_rows'] as $value) {
                $medicalDeclare = ConfigMedicalDeclare::create($value);
            }
        }

        if (!empty($attributes['update_rows'])) {
            foreach ($attributes['update_rows'] as $value) {
                $medicalDeclare = ConfigMedicalDeclare::find($value['id']);
                $medicalDeclare->update($value);
            }
        }

        if (!empty($attributes['delete_rows'])) {
            ConfigMedicalDeclare::whereIn('id', $attributes['delete_rows'])->delete();
        }

        return parent::all();
    }
}
