<?php

namespace GGPHP\ChildDevelop\TestSemester\Http\Controllers;

use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluate;
use GGPHP\ChildDevelop\TestSemester\Http\Requests\TestSemesterCreateRequest;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemester;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemesterDetail;
use GGPHP\ChildDevelop\TestSemester\Repositories\Contracts\TestSemesterRepository;
use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use PhpOffice\PhpSpreadsheet\Reader\Xls\RC4;

class TestSemesterController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $testSemesterRepository;

    /**
     * UserController constructor.
     * @param TestSemesterRepository $testSemesterRepository
     */
    public function __construct(TestSemesterRepository $testSemesterRepository)
    {
        $this->testSemesterRepository = $testSemesterRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['status'])) {
            $status = explode(',', $attributes['status']);
            $newStatus = [];
            foreach ($status as $value) {
                $newStatus[] = TestSemester::STATUS[$value];
            }

            $attributes['status'] = array_values($newStatus);
        }

        if (!empty($attributes['type'])) {
            $type = explode(',', $attributes['type']);
            $valueType = [];
            foreach ($type as $value) {
                $valueType[] = TestSemester::TYPE[$value];
            }

            $attributes['type'] = array_values($valueType);
        }

        if (!empty($attributes['age'])) {
            $attributes['age'] = ChildEvaluate::MONTH[$attributes['age']];
        }

        if (!empty($attributes['approvalStatus'])) {
            $approvalStatus = explode(',', $attributes['approvalStatus']);
            $newApprovalStatus = [];
            foreach ($approvalStatus as $value) {
                $newApprovalStatus[] = TestSemester::APPROVAL_STATUS[$value];
            }

            $attributes['approvalStatus'] = array_values($newApprovalStatus);
        }

        $testSemester = $this->testSemesterRepository->getAll($attributes);

        return $this->success($testSemester, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TestSemesterCreateRequest $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['approvalStatus'])) {
            $attributes['approvalStatus'] = TestSemester::APPROVAL_STATUS[$attributes['approvalStatus']];
        }

        if (!empty($attributes['status'])) {
            $attributes['status'] = TestSemester::STATUS[$attributes['status']];
        }

        if (!empty($attributes['detail']) && $attributes['detail']['status']) {
            $attributes['detail']['status'] = TestSemesterDetail::STATUS[$attributes['detail']['status']];
        }

        $testSemester = $this->testSemesterRepository->create($attributes);

        return $this->success($testSemester, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $testSemester = $this->testSemesterRepository->find($id);

        return $this->success($testSemester, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $attributes = $request->all();

        if (!empty($attributes['approvalStatus'])) {
            $attributes['approvalStatus'] = TestSemester::APPROVAL_STATUS[$attributes['approvalStatus']];
        }

        $testSemester = $this->testSemesterRepository->update($attributes, $id);

        return $this->success($testSemester, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->testSemesterRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function officialStudent(Request $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['approvalStatus'])) {
            $attributes['approvalStatus'] = TestSemester::APPROVAL_STATUS[$attributes['approvalStatus']];
        }

        $data = $this->testSemesterRepository->officialStudent($attributes);

        return $this->success($data, trans('lang::messages.common.createSuccess'));
    }

    public function testSemesterStudent(Request $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['status'])) {
            $status = explode(',', $attributes['status']);
            $newStatus = [];
            foreach ($status as $value) {
                $newStatus[] = TestSemester::STATUS[$value];
            }

            $attributes['status'] = $newStatus;
        }

        $testSemester = $this->testSemesterRepository->testSemesterStudent($attributes);

        return $this->success($testSemester, trans('lang::messages.common.getListSuccess'));
    }

    public function reportTestSemester(Request $request)
    {
        $reportTestSemester = $this->testSemesterRepository->reportTestSemester($request->all());

        return $this->success($reportTestSemester, trans('lang::messages.common.getListSuccess'));
    }

    public function approvedTestSemester(Request $request)
    {
        $testSemester = $this->testSemesterRepository->approvedTestSemester($request->all());

        return $this->success($testSemester, trans('lang::messages.common.getInfoSuccess'));
    }

    public function updateMultiple(Request $request)
    {
        $testSemester = $this->testSemesterRepository->updateMultiple($request->all());

        return $this->success($testSemester, trans('lang::messages.common.createSuccess'));
    }

    public function updateScore(Request $request, $id)
    {
        $testSemester = $this->testSemesterRepository->updateScore($request->all(), $id);

        return $this->success($testSemester, trans('lang::messages.common.createSuccess'));
    }

    public function updateDataTestSemester(Request $request)
    {
        $testSemester = $this->testSemesterRepository->updateDataTestSemester($request->all());

        return $this->success($testSemester, trans('lang::messages.common.createSuccess'));
    }

    public function updateDataOldLastTestSemester(Request $request)
    {
        $testSemester = $this->testSemesterRepository->updateDataOldLastTestSemester($request->all());

        return $this->success($testSemester, trans('lang::messages.common.createSuccess'));
    }

    public function excelTestSemester(Request $request)
    {
        $result = $this->testSemesterRepository->excelTestSemester($request->all());

        if (is_string($result)) {
            return $this->error('Export failed', trans('lang::messages.export.template-not-found'), 400);
        }

        return $result;
    }
}
