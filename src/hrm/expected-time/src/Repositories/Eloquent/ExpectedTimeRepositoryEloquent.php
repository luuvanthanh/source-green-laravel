<?php

namespace GGPHP\ExpectedTime\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\ExpectedTime\Models\ExpectedTime;
use GGPHP\ExpectedTime\Models\ExpectedTimeDetail;
use GGPHP\ExpectedTime\Presenters\ExpectedTimePresenter;
use GGPHP\ExpectedTime\Repositories\Contracts\ExpectedTimeRepository;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class UserRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ExpectedTimeRepositoryEloquent extends CoreRepositoryEloquent implements ExpectedTimeRepository
{
    protected $employeeRepositoryEloquent;

    public function __construct(
        UserRepositoryEloquent $employeeRepositoryEloquent,
        ExcelExporterServices $excelExporterServices,
        Application $app
    ) {
        parent::__construct($app);
        $this->employeeRepositoryEloquent = $employeeRepositoryEloquent;
        $this->excelExporterServices = $excelExporterServices;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ExpectedTime::class;
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
        return ExpectedTimePresenter::class;
    }

    /**
     * getAll
     *
     * @param  mixed $attribute
     * @return void
     */
    public function getAll(array $attribute)
    {
        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->where('Category', User::CATEGORY['TEACHER']);

        if (!empty($attribute['employeeId'])) {
            $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->where('Id', $attribute['employeeId']);
        }

        if (!empty($attribute['fullName'])) {
            $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->whereLike('FullName', $attribute['fullName']);
        }

        if (!empty($attribute['limit'])) {
            $result = $this->employeeRepositoryEloquent->paginate($attribute['limit']);
        } else {
            $result = $this->employeeRepositoryEloquent->get();
        }

        return $result;
    }

    public function createAll($attribute)
    {
        DB::beginTransaction();
        try {

            $data = $this->model()::create($attribute);

            if (!empty($attribute['detail'])) {
                $this->createDetail($data, $attribute['detail']);
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($data);
    }

    public function createDetail($model, $attribute)
    {
        foreach ($attribute as $key => $value) {
            foreach ($value['week'] as $valueChildren) {

                if (!empty($valueChildren['id'])) {
                    $expectedTimeDetail = ExpectedTimeDetail::find($valueChildren['id']);

                    if (!is_null($expectedTimeDetail)) {
                        $valueChildren['type'] = ExpectedTimeDetail::WEEK[$valueChildren['type']];
                        $expectedTimeDetail->update($valueChildren);
                    }
                } else {
                    $valueChildren['teachingShiftId'] = $value['teachingShiftId'];
                    $valueChildren['expectedTimeId'] = $model->Id;
                    $valueChildren['type'] = ExpectedTimeDetail::WEEK[$valueChildren['type']];

                    ExpectedTimeDetail::create($valueChildren);
                }
            }
        }
    }

    public function updateAll($attribute, $id)
    {
        $data = $this->model()::findOrFail($id);
        DB::beginTransaction();
        try {
            $data->update($attribute);

            if (!empty($attribute['detail'])) {
                $this->createDetail($data, $attribute['detail']);
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($data);
    }

    public function exportExcelTeacherProfile($attributes)
    {
        $attributes['isExport'] = true;
        $teacherProfiles = $this->getAll($attributes);
        // dd($teacherProfiles['data']);

        $params['[number]'] = [];
        $params['[code]'] = [];
        $params['[fullName]'] = [];
        $params['[dateOfBirth]'] = [];
        $params['[gender]'] = [];
        $params['[phone]'] = [];
        $params['[email]'] = [];
        $params['[taxCode]'] = [];
        $params['[address]'] = [];
        $params['[categoryId]'] = [];
        $params['[typeTeacherId]'] = [];
        $stt = 0;

        if (!empty($teacherProfiles)) {
            foreach ($teacherProfiles['data'] as $teacherProfile) {
                // dd($teacherProfiles);
                $stt += 1;
                $params['[number]'][] = $stt;
                $params['[code]'][] =  $teacherProfile['attributes']['code'];
                $params['[fullName]'][] = $teacherProfile['attributes']['fullName'];
                $params['[dateOfBirth]'][] = Carbon::parse($teacherProfile['attributes']['dateOfBirth'])->format('d/m/Y');
                $params['[gender]'][] = $teacherProfile['attributes']['gender'] == 'FEMALE' ? 'Nữ' : 'Nam';
                $params['[phone]'][] = $teacherProfile['attributes']['phoneNumber'];
                $params['[email]'][] = $teacherProfile['attributes']['email'];
                $params['[taxCode]'][] = $teacherProfile['attributes']['taxCode'];
                $params['[address]'][] = $teacherProfile['attributes']['address'];
                $params['[categoryId]'][] = $teacherProfile['attributes']['category'] == 'TEACHER' ? 'Giáo viên' : 'Nhân viên';
                if (!empty($teacherProfile['attributes']['typeTeacherId'])) {
                    foreach ($teacherProfile['attributes']['employeeTeacherPivot'] as $key => $value) {
                        $arr[] = $value->Id;
                        // if ($teacherProfile['attributes']['typeTeacherId'] == $value->Id) {
                        //     $params['[typeTeacherId]'][] = $value->Name;
                        // }
                    }
                    dd($arr);
                } else {
                    $params['[typeTeacherId]'][] = '';
                }
            }
        }

        return $this->excelExporterServices->export('teacher_profile', $params);
    }
}
