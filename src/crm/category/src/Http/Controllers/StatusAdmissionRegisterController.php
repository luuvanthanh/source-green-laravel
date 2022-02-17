<?php

namespace GGPHP\Crm\Category\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Category\Http\Requests\CreateStatusAdmissionRegisterRequest;
use GGPHP\Crm\Category\Http\Requests\UpdateStatusAdmissionRegisterRequest;
use GGPHP\Crm\Category\Repositories\Contracts\StatusAdmissionRegisterRepository;

class StatusAdmissionRegisterController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $statusAdmissionRegisterRepository;

    /**
     * UserController constructor.
     * @param admissionRegisterRepository $inOutHistoriesRepository
     */
    public function __construct(StatusAdmissionRegisterRepository $statusAdmissionRegisterRepository)
    {
        $this->statusAdmissionRegisterRepository = $statusAdmissionRegisterRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $statusAdmissionRegister = $this->statusAdmissionRegisterRepository->getAll($request->all());

        return $this->success($statusAdmissionRegister, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateStatusAdmissionRegisterRequest $request)
    {
        try {
            $credentials = $request->all();

            $statusAdmissionRegister = $this->statusAdmissionRegisterRepository->create($credentials);

            return $this->success($statusAdmissionRegister, trans('lang::messages.common.createSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $statusAdmissionRegister = $this->statusAdmissionRegisterRepository->find($id);

        return $this->success($statusAdmissionRegister, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateStatusAdmissionRegisterRequest $request, $id)
    {
        $credentials = $request->all();

        $statusAdmissionRegister = $this->statusAdmissionRegisterRepository->update($credentials, $id);

        return $this->success($statusAdmissionRegister, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->statusAdmissionRegisterRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
