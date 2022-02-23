<?php

namespace GGPHP\Crm\AdmissionRegister\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\AdmissionRegister\Http\Requests\CreateTestInputDetailRequest;
use GGPHP\Crm\AdmissionRegister\Http\Requests\CreateTestInputRequest;
use GGPHP\Crm\AdmissionRegister\Http\Requests\UpdateTestInputRequest;
use GGPHP\Crm\AdmissionRegister\Models\TestInput;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\TestInputRepository;
use GGPHP\Crm\ChildDevelop\Models\ChildEvaluate;

class TestInputController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $testInputRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(TestInputRepository $testInputRepository)
    {
        $this->testInputRepository = $testInputRepository;
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
                $newStatus[] = TestInput::STATUS[$value];
            }

            $attributes['status'] = array_values($newStatus);
        }

        if (!empty($attributes['age'])) {
            $attributes['age'] = ChildEvaluate::MONTH[$attributes['age']];
        }

        if (!empty($attributes['approval_status'])) {
            $attributes['approval_status'] = TestInput::APPROVAL_STATUS[$attributes['approval_status']];
        }

        $testInput = $this->testInputRepository->getAll($attributes);

        return $this->success($testInput, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateTestInputRequest $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['approval_status'])) {
            $attributes['approval_status'] = TestInput::APPROVAL_STATUS[$attributes['approval_status']];
        }
        $testInput = $this->testInputRepository->createOrUpdate($attributes);

        return $this->success($testInput, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $testInput = $this->testInputRepository->find($id);

        return $this->success($testInput, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateTestInputRequest $request, $id)
    {
        $attributes = $request->all();

        $testInput = $this->testInputRepository->update($attributes, $id);

        return $this->success($testInput, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->testInputRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function testInputDetail(CreateTestInputDetailRequest $request)
    {
        $attributes = $request->all();

        $testInput = $this->testInputRepository->testInputDetail($attributes);

        return $this->success($testInput, trans('lang::messages.common.createSuccess'));
    }

    public function moveStudentToOfficial($id)
    {
        $testInput = $this->testInputRepository->moveStudentToOfficial($id);

        return $this->success(['data' => $testInput], trans('lang::messages.common.getInfoSuccess'));
    }
}
