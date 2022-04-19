<?php

namespace GGPHP\Crm\AdmissionRegister\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Crm\AdmissionRegister\Models\ConfirmTransporter;
use GGPHP\Crm\AdmissionRegister\Presenters\ConfirmTransporterPresenter;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\ConfirmTransporterRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ConfirmTransporterRepositoryEloquent extends BaseRepository implements ConfirmTransporterRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at',
    ];

    public function __construct(
        ExcelExporterServices $excelExporterServices,
        WordExporterServices $wordExporterServices,
        Application $app
    ) {
        parent::__construct($app);
        $this->wordExporterServices = $wordExporterServices;
        $this->excelExporterServices = $excelExporterServices;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ConfirmTransporter::class;
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
        return ConfirmTransporterPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['admission_register_id'])) {
            $this->model = $this->model->where('admission_register_id', $attributes['admission_register_id']);
        }

        if (!empty($attributes['limit'])) {
            $admissionRegister = $this->paginate($attributes['limit']);
        } else {
            $admissionRegister = $this->get();
        }

        return $admissionRegister;
    }

    public function create(array $attributes)
    {
        if (!empty($attributes['confirm_transporter'])) {
            $confirmTransporter = ConfirmTransporter::where('admission_register_id', $attributes['admission_register_id'])->delete();
            foreach ($attributes['confirm_transporter'] as $value) {
                $value['admission_register_id'] = $attributes['admission_register_id'];
                $confirmTransporter = ConfirmTransporter::create($value);
            }
        }

        return parent::parserResult($confirmTransporter);
    }

    public function exportConfirmTransporter($attributes)
    {
        $now = Carbon::now()->setTimezone('GMT+7');
        $data = [];
        $confirmTransporter = $this->model->where('admission_register_id', $attributes['admission_register_id'])->get();

        foreach ($confirmTransporter as $key => $value) {

            $data[]  = [
                'number' => $key + 1,
                'full_name' => $value->full_name,
                'id_card' => $value->id_card,
                'relationship' => is_null($value->categoryRelationship) ? '.....' : $value->categoryRelationship->name,
                'phone_number' =>  is_null($value->phone_number)  ? '.....' : $value->phone_number
            ];
        }

        $param = [
            'date' => $now->format('d'),
            'month' => $now->format('m'),
            'year' => $now->format('Y'),
            'detail'  => $data
        ];

        return $this->wordExporterServices->multipleExportWord('list_confirm_transporter', $param);
    }
}
