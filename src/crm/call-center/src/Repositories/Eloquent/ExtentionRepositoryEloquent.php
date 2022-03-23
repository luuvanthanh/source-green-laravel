<?php

namespace GGPHP\Crm\CallCenter\Repositories\Eloquent;

use Exception;
use GGPHP\Crm\CallCenter\Models\EmployeeExtension;
use GGPHP\Crm\CallCenter\Models\Extension;
use GGPHP\Crm\CallCenter\Presenters\ExtensionPresenter;
use GGPHP\Crm\CallCenter\Repositories\Contracts\ExtensionRepository;
use GGPHP\Crm\CallCenter\Services\CMCExtensionService;
use GGPHP\Crm\Employee\Models\Employee;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ExtensionRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ExtensionRepositoryEloquent extends BaseRepository implements ExtensionRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Extension::class;
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
        return ExtensionPresenter::class;
    }

    public function getExtension(array $attributes)
    {
        if (!empty($attributes['employee_id_hrm'])) {
            $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
                $query->where('employee_id_hrm', $attributes['employee_id_hrm']);
            })->with(['employee' => function ($query) use ($attributes) {
                $query->where('employee_id_hrm', $attributes['employee_id_hrm']);
            }]);
        }

        $this->model = $this->model->withCount('employee');

        if (!empty($attributes['limit'])) {
            $callCenter = $this->paginate($attributes['limit']);
        } else {
            $callCenter = $this->get();
        }

        return $callCenter;
    }


    public function create(array $attributes)
    {
        $data = CMCExtensionService::createExtension($attributes);
        $data = json_decode($data, true);

        if (isset($data['data']['item'])) {
            foreach ($data as $items) {
                foreach ($items as $value) {
                    $attributes = [
                        'password' => $value[0]['password'],
                        'domain' =>  $value[0]['domain'],
                        'id_cmc' =>  $value[0]['id'],
                        'caller' =>  $value[0]['caller'],
                        'state' => $value[0]['state'],
                        'user_id_cmc' =>  $value[0]['userId']
                    ];
                    return $this->parserResult($this->model->create($attributes));
                }
            }
        }

        throw new Exception('Số máy lẻ bị giới hạn', 500);
    }

    public function delete($id)
    {
        $model = $this->model->find($id);

        $data = CMCExtensionService::deleteExtension($model);

        if ($data->status() == 200) {
            $model->delete();
            return [];
        }

        throw new Exception('Lỗi khi xóa mấy lẻ', 500);
    }

    public function update(array $attributes, $id)
    {
        $model = $this->model->find($id);

        $params = [
            'phoneId' => $attributes['phone_id_cmc'],
        ];

        $data = CMCExtensionService::updateExtension($model, $params);

        if ($data->status() == 200) {
            $attributes['phone_number'] = env('PHONE_CMC');

            $model->update($attributes);

            return [];
        }

        throw new Exception($data->body(), 500);
    }

    public function employeeExtension(array $attributes)
    {
        EmployeeExtension::where('extension_id', $attributes['extension_id'])->delete();

        $extension = $this->model->find($attributes['extension_id']);

        $extension->employee()->attach($attributes['employee_id']);

        return [];
    }
}
