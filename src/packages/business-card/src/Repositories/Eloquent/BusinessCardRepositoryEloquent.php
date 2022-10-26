<?php

namespace GGPHP\BusinessCard\Repositories\Eloquent;

use GGPHP\BusinessCard\Models\ApprovalEmployee;
use GGPHP\BusinessCard\Models\BusinessCard;
use GGPHP\BusinessCard\Presenters\BusinessCardPresenter;
use GGPHP\BusinessCard\Repositories\Contracts\BusinessCardRepository;
use GGPHP\BusinessCard\Services\BusinessCardDetailServices;
use GGPHP\Clover\Models\EmployeeAccount;
use GGPHP\Core\Jobs\SendNotiWithoutCode;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

use function PHPSTORM_META\type;

/**
 * Class BusinessCardRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class BusinessCardRepositoryEloquent extends CoreRepositoryEloquent implements BusinessCardRepository
{
    protected $fieldSearchable = [
        'Id',
        'employee.FullName',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return BusinessCard::class;
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
        return BusinessCardPresenter::class;
    }

    public function filterBusinessCard(array $attributes)
    {
        if (!empty($attributes['status'])) {
            $this->model = $this->model->where('Status', $attributes['status']);
        }

        if (!empty($attributes['absentTypeId'])) {
            $this->model = $this->model->where('AbsentTypeId', $attributes['absentTypeId']);
        }


        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['fullName'])) {
            $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['fullName']);
            });
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where(function ($q2) use ($attributes) {
                $q2->where([['StartDate', '<=', $attributes['startDate']], ['EndDate', '>=', $attributes['endDate']]])
                    ->orWhere([['StartDate', '>=', $attributes['startDate']], ['StartDate', '<=', $attributes['endDate']]])
                    ->orWhere([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<=', $attributes['endDate']]]);
            });
        }

        if (!empty($attributes['limit'])) {
            $businessCard = $this->paginate($attributes['limit']);
        } else {
            $businessCard = $this->get();
        }

        return $businessCard;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $attributes = $this->creating($attributes);
            $businessCard = BusinessCard::create($attributes);
            $this->created($businessCard, $attributes);
            BusinessCardDetailServices::add($businessCard->Id, $attributes['detail']);
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }
        $account = [];

        if (!empty($attributes['approvalEmployee'])) {
            $account = $this->getAccountEmployee($attributes);
        }

        if (!empty($account)) {
            $attributes['title'] = 'Phiếu đăng ký';

            switch ($attributes['type']) {
                case 'BUSINESS_TRAVEL':
                    $attributes['message'] = 'Bạn có phiếu đăng ký đi công tác cần duyệt';
                    break;
                case 'GO_OUT':
                    $attributes['message'] = 'Bạn có phiếu đăng ký đi ra ngoài cần duyệt';
                    break;
                case 'WORK_HOME':
                    $attributes['message'] = 'Bạn có phiếu đăng ký đi làm tại nhà cần duyệt';
                    break;
            }
            $this->sendNoti($account, $businessCard, $attributes);
        }

        return parent::find($businessCard->Id);
    }

    public function creating($attributes)
    {
        if (!empty($attributes['status'])) {
            $attributes['status'] = BusinessCard::STATUS[$attributes['status']];
        } else {
            $attributes['status'] = BusinessCard::STATUS['WAITING_APPROVAL'];
        }
        
        return $attributes;
    }

    public function created($businessCard, $attributes)
    {
        if (!empty($attributes['approvalEmployee'])) {
            foreach ($attributes['approvalEmployee'] as $key => $value) {

                $data = [
                    'businessCardId' => $businessCard->Id,
                    'employeeId' => $value
                ];

                ApprovalEmployee::create($data);
            }
        }

        return null;
    }

    public function getAccountEmployee($attributes)
    {
        $accountEmployee = EmployeeAccount::whereIn('EmployeeId', $attributes['approvalEmployee'])->get();

        $appUserId = $accountEmployee->map(function ($item) {
            return $item->AppUserId;
        })->toArray();

        return $appUserId;
    }

    public function sendNoti($account, $businessCard, $attributes)
    {
        $dataNoti = [
            'users' => $account,
            'title' => $attributes['title'],
            'imageURL' => 'image',
            'message' => $attributes['message'],
            'moduleType' => 23,
            'refId' => $businessCard->Id,
        ];

        dispatch(new SendNotiWithoutCode($dataNoti));
    }

    public function update(array $attributes, $id)
    {
        $businessCard = BusinessCard::findOrFail($id);

        \DB::beginTransaction();
        try {
            $businessCard->update($attributes);
            $this->updated($businessCard, $attributes);
            if (!empty($attributes['detail'])) {
                $businessCard->businessCardDetail()->delete();
                BusinessCardDetailServices::add($id, $attributes['detail']);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($id);
    }

    public function updated($businessCard, $attributes)
    {
        if (!empty($attributes['approvalEmployee'])) {
            $businessCard->approvalEmployee()->delete();
            foreach ($attributes['approvalEmployee'] as $key => $value) {

                $data = [
                    'businessCardId' => $businessCard->Id,
                    'employeeId' => $value
                ];

                ApprovalEmployee::create($data);
            }
        }

        return null;
    }

    public function updateStatusBusinessCard($attributes, $id)
    {
        $businessCard = BusinessCard::findOrFail($id);
        $type = $businessCard->absentType;
        $attributes['approvalEmployee'] = [$businessCard->EmployeeId];
        $account = $this->getAccountEmployee($attributes);
        $message = null;

        if (!empty($account) && !is_null($type)) {

            switch ($type->Type) {
                case 'BUSINESS_TRAVEL':
                    $message = 'Bạn có phiếu đăng ký đi công tác';
                    break;
                case 'GO_OUT':
                    $message = 'Bạn có phiếu đăng ký đi ra ngoài';
                    break;
                case 'WORK_HOME':
                    $message = 'Bạn có phiếu đăng ký đi làm tại nhà';
                    break;
            }
        }

        $businessCard->Status = $attributes['status'];
        $attributes['title'] = 'Phiếu đăng ký';

        if ($attributes['status'] == BusinessCard::STATUS['APPROVED']) {
            if (!is_null($message) && !empty($account)) {
                $attributes['message'] = $message . ' đã được duyệt';
                $this->sendNoti($account, $businessCard, $attributes);
            }
        }

        if ($attributes['status'] == BusinessCard::STATUS['NOT_APPROVED']) {
            if (!is_null($message) && !empty($account)) {
                $attributes['message'] = $message . ' không được duyệt';
                $this->sendNoti($account, $businessCard, $attributes);
            }

            $businessCard->ReasonNotApproved = $attributes['reasonNotApproved'];
        }

        $businessCard->update();

        return $this->parserResult($businessCard);
    }

    public function sendAgain($id)
    {
        $businessCard = BusinessCard::findOrFail($id);
        $type = $businessCard->absentType;
        $attributes['approvalEmployee'] = [$businessCard->EmployeeId];
        $account = $this->getAccountEmployee($attributes);

        if (!empty($account) && !is_null($type)) {

            $attributes['title'] = 'Phiếu đăng ký';

            switch ($type->Type) {
                case 'BUSINESS_TRAVEL':
                    $attributes['message'] = 'Bạn có phiếu đăng ký đi công tác cần duyệt';
                    break;
                case 'GO_OUT':
                    $attributes['message'] = 'Bạn có phiếu đăng ký đi ra ngoài cần duyệt';
                    break;
                case 'WORK_HOME':
                    $attributes['message'] = 'Bạn có phiếu đăng ký đi làm tại nhà cần duyệt';
                    break;
            }

            $this->sendNoti($account, $businessCard, $attributes);
        }

        return [];
    }
}
