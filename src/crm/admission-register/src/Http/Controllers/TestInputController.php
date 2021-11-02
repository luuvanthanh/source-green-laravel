<?php

namespace GGPHP\Crm\AdmissionRegister\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\AdmissionRegister\Http\Requests\CreateTestInputRequest;
use GGPHP\Crm\AdmissionRegister\Http\Requests\UpdateTestInputRequest;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\TestInputRepository;

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

        $testInput = $this->testInputRepository->create($attributes);

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
}
