<?php

namespace GGPHP\Crm\Employee\Repositories\Eloquent;

use GGPHP\Crm\CallCenter\Models\ManagerCall;
use GGPHP\Crm\CustomerLead\Models\StatusLead;
use GGPHP\Crm\Employee\Models\Employee;
use GGPHP\Crm\Employee\Presenters\EmployeePresenter;
use GGPHP\Crm\Employee\Repositories\Contracts\EmployeeRepository;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class EmployeeRepositoryEloquent extends BaseRepository implements EmployeeRepository
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
        return Employee::class;
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
        return EmployeePresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['employee_id_hrm'])) {
            $this->model = $this->model->where('employee_id_hrm', $attributes['employee_id_hrm']);
        }

        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('full_name', $attributes['key']);
        }

        if (isset($attributes['sale'])) {
            $this->model = $this->model->has('extension');
        }

        if (!empty($attributes['limit'])) {
            $employee = $this->paginate($attributes['limit']);
        } else {
            $employee = $this->get();
        }

        return $employee;
    }

    public function syncEmployee($attributes)
    {
        $employeeId = [];
        foreach ($attributes as $value) {
            $data = [
                'full_name' => $value['FullName'],
                'employee_id_hrm' => $value['Id'],
                'file_image' => $value['FileImage'],
                'code' => $value['Code']
            ];

            $employee = Employee::where('employee_id_hrm', $value['Id'])->first();

            if (is_null($employee)) {
                $employee = Employee::create($data);
            } else {
                $employee->update($data);
            }

            $employeeId[] = $employee->id;
        }

        $employee = Employee::whereIn('id', $employeeId)->get();

        return $this->parserResult($employee);
    }

    public function reportCall(array $attributes)
    {
        if (!empty($attributes['employee_id'])) {
            $this->model = $this->model->where('id', $attributes['employee_id']);
        }

        $this->model = $this->model->has('extension')->withCount([
            'managerCall as total_lead' => function ($query) use ($attributes) {
                $query->select(DB::raw('count(distinct(customer_lead_id))'));
                $query->whereDate('created_at', '>=', $attributes['start_date']);
                $query->whereDate('created_at', '<=', $attributes['end_date']);
            },
            'managerCall as lead_new' => function ($query) use ($attributes) {
                $query->select(DB::raw('count(distinct(customer_lead_id))'));
                $query->whereDate('created_at', '>=', $attributes['start_date']);
                $query->whereDate('created_at', '<=', $attributes['end_date']);
                $query->where('expected_date', null);

                $query->whereHas('customerLead.statusLeadLatest', function ($query) {
                    $query->where(function ($query) {
                        $query->select('status');
                        $query->from('status_lead');
                        $query->whereColumn('customer_lead_id', 'customer_leads.id');
                        $query->latest();
                        $query->limit(1);
                    }, StatusLead::STATUS_LEAD['LEAD_NEW']);
                });
            },
            'managerCall as lead_potential' => function ($query) use ($attributes) {
                $query->select(DB::raw('count(distinct(customer_lead_id))'));
                $query->whereDate('created_at', '>=', $attributes['start_date']);
                $query->whereDate('created_at', '<=', $attributes['end_date']);

                $query->whereHas('customerLead.statusLeadLatest', function ($query) {
                    $query->where(function ($query) {
                        $query->select('status');
                        $query->from('status_lead');
                        $query->whereColumn('customer_lead_id', 'customer_leads.id');
                        $query->latest();
                        $query->limit(1);
                    }, StatusLead::STATUS_LEAD['POTENTIAL']);
                });
            },
            'managerCall as lead_not_potential' => function ($query) use ($attributes) {
                $query->select(DB::raw('count(distinct(customer_lead_id))'));
                $query->whereDate('created_at', '>=', $attributes['start_date']);
                $query->whereDate('created_at', '<=', $attributes['end_date']);

                $query->whereHas('customerLead.statusLeadLatest', function ($query) {
                    $query->where(function ($query) {
                        $query->select('status');
                        $query->from('status_lead');
                        $query->whereColumn('customer_lead_id', 'customer_leads.id');
                        $query->latest();
                        $query->limit(1);
                    }, StatusLead::STATUS_LEAD['NOT_POTENTIAL']);
                });
            },
            'managerCall as out_of_date' => function ($query) use ($attributes) {
                $query->whereDate('created_at', '>=', $attributes['start_date']);
                $query->whereDate('created_at', '<=', $attributes['end_date']);
                $query->whereDate('expected_date', '<', now()->toDateString());
                $query->where('status', ManagerCall::STATUS['CALLYET']);
            },
            'managerCall as first_call' => function ($query) use ($attributes) {
                $query->whereDate('created_at', '>=', $attributes['start_date']);
                $query->whereDate('created_at', '<=', $attributes['end_date']);
                $query->where('call_times', ManagerCall::CALLTIME['FIRST']);
            },
            'managerCall as second_call' => function ($query) use ($attributes) {
                $query->whereDate('created_at', '>=', $attributes['start_date']);
                $query->whereDate('created_at', '<=', $attributes['end_date']);
                $query->where('call_times', ManagerCall::CALLTIME['SECOND']);
            },
            'managerCall as third_call' => function ($query) use ($attributes) {
                $query->whereDate('created_at', '>=', $attributes['start_date']);
                $query->whereDate('created_at', '<=', $attributes['end_date']);
                $query->where('call_times', ManagerCall::CALLTIME['THIRD']);
            },
            'managerCall as fourth_call' => function ($query) use ($attributes) {
                $query->whereDate('created_at', '>=', $attributes['start_date']);
                $query->whereDate('created_at', '<=', $attributes['end_date']);
                $query->where('call_times', ManagerCall::CALLTIME['FOURTH']);
            },
            'managerCall as fiveth_call' => function ($query) use ($attributes) {
                $query->whereDate('created_at', '>=', $attributes['start_date']);
                $query->whereDate('created_at', '<=', $attributes['end_date']);
                $query->where('call_times', ManagerCall::CALLTIME['FIVETH']);
            },
            'managerCall as called' => function ($query) use ($attributes) {
                $query->whereDate('created_at', '>=', $attributes['start_date']);
                $query->whereDate('created_at', '<=', $attributes['end_date']);
                $query->where('status', ManagerCall::STATUS['CALLED']);
            }
        ]);

        $result = $this->model->get();

        request()->total = [
            'lead' => $result->sum('total_lead'),
            'lead_new' => $result->sum('lead_new'),
            'lead_potential' => $result->sum('lead_potential'),
            'lead_not_potential' => $result->sum('lead_not_potential'),
            'called' => $result->sum('called'),
            'out_of_date' => $result->sum('out_of_date'),
            'first_call' => $result->sum('first_call'),
            'second_call' => $result->sum('second_call'),
            'third_call' => $result->sum('third_call'),
            'fourth_call' => $result->sum('fourth_call'),
            'fiveth_call' => $result->sum('fiveth_call'),
        ];

        if (!empty($attributes['limit'])) {
            $employee = $this->paginate($attributes['limit']);
        } else {
            $employee = $this->get();
        }

        return $employee;
    }
}
