<?php

namespace GGPHP\BusRegistration\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\BusRegistration\Http\Requests\CreatBusRegistrationRequest;
use GGPHP\BusRegistration\Http\Requests\UpdateBusRegistrationRequest;
use GGPHP\BusRegistration\Repositories\Contracts\BusRegistrationRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BusRegistrationController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $busRegistrationRepository;

    /**
     * UserController constructor.
     * @param BusRegistrationRepository $busRegistrationRepository
     */
    public function __construct(BusRegistrationRepository $busRegistrationRepository)
    {
        $this->busRegistrationRepository = $busRegistrationRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $employees = $this->busRegistrationRepository->filterBusRegistration($request->all());

        return $this->success($employees, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatBusRegistrationRequest $request)
    {
        $busRegistrations = $this->busRegistrationRepository->create($request->all());
        return $this->success($busRegistrations, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\BusRegistration  $busRegistration
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $busRegistration = $this->busRegistrationRepository->find($id);
        if ($busRegistration) {
            return $this->success($busRegistration, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\BusRegistration  $busRegistration
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateBusRegistrationRequest $request, $id)
    {
        $credentials = $request->all();
        $busRegistration = $this->busRegistrationRepository->update($credentials, $id);
        return $this->success($busRegistration, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\BusRegistration  $busRegistration
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->busRegistrationRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    public function busRegistrationSummary(Request $request)
    {
        $request->isBusRegistrationSummary = true;
        $busRegistrations = $this->busRegistrationRepository->busRegistrationSummary($request->all());

        return $this->success($busRegistrations, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function exportBusRegistrationReport(Request $request)
    {
        $result = $this->busRegistrationRepository->exportBusRegistrationReport($request->all());

        if (is_string($result)) {
            return $this->error('Export failed', trans('Template not found'), 400);
        }

        return $result;
    }
}
