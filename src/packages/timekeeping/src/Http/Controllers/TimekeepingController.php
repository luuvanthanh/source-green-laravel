<?php

namespace GGPHP\Timekeeping\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Timekeeping\Http\Requests\CreatTimekeepingRequest;
use GGPHP\Timekeeping\Http\Requests\GetTimekeepingRequest;
use GGPHP\Timekeeping\Http\Requests\UpdateTimekeepingRequest;
use GGPHP\Timekeeping\Repositories\Contracts\TimekeepingRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TimekeepingController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $timekeepingRepository;

    /**
     * UserController constructor.
     * @param TimekeepingRepository $timekeepingRepository
     */
    public function __construct(TimekeepingRepository $timekeepingRepository)
    {
        $this->timekeepingRepository = $timekeepingRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = config('constants.SEARCH_VALUES_DEFAULT.LIMIT');
        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        $employees = $this->timekeepingRepository->filterTimekeeping($request->all());
        return $this->success($employees, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatTimekeepingRequest $request)
    {
        $timekeepings = $this->timekeepingRepository->create($request->all());
        return $this->success($timekeepings, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Timekeeping  $timekeeping
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $timekeeping = $this->timekeepingRepository->find($id);

        if ($timekeeping) {
            return $this->success($timekeeping, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Timekeeping  $timekeeping
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateTimekeepingRequest $request, $id)
    {
        $credentials = $request->all();
        $timekeeping = $this->timekeepingRepository->update($credentials, $id);

        return $this->success($timekeeping, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Timekeeping  $timekeeping
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->timekeepingRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getTimekeepingReport(GetTimekeepingRequest $request)
    {
        $employeesByStore = $this->timekeepingRepository->timekeepingReport($request->all());

        return $this->success($employeesByStore, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function invalidTimekeeping(Request $request)
    {
        $employeesByStore = $this->timekeepingRepository->invalidTimekeeping($request->all());

        return $this->success($employeesByStore, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function exportTimekeeping(Request $request)
    {
        $result = $this->timekeepingRepository->exportTimekeeping($request->all());

        if (is_string($result)) {
            return $this->error('Export failed', trans('Template not found'), 400);
        }

        return $result;
    }
}
