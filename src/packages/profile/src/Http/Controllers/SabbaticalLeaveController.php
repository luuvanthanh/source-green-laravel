<?php

namespace GGPHP\Profile\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Profile\Http\Requests\UpdateOrCreateSabbaticalLeaveRequest;
use GGPHP\Profile\Repositories\Contracts\SabbaticalLeaveRepository;
use Illuminate\Http\Request;

class SabbaticalLeaveController extends Controller
{
    /**
     * @var $sabbaticalLeaveRepository
     */
    protected $sabbaticalLeaveRepository;

    /**
     * SabbaticalLeavesController constructor.
     * @param SabbaticalLeaveRepository $sabbaticalLeaveRepository
     */
    public function __construct(SabbaticalLeaveRepository $sabbaticalLeaveRepository)
    {
        $this->sabbaticalLeaveRepository = $sabbaticalLeaveRepository;
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = config('constants-absent.SEARCH_VALUES_DEFAULT.LIMIT');

        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        if ($limit == config('constants-absent.SEARCH_VALUES_DEFAULT.LIMIT_ZERO')) {
            $sabbaticalLeave = $this->sabbaticalLeaveRepository->all();
        } else {
            $sabbaticalLeave = $this->sabbaticalLeaveRepository->paginate($limit);
        }

        return $this->success($sabbaticalLeave, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param UpdateOrCreateSabbaticalLeaveRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(UpdateOrCreateSabbaticalLeaveRequest $request)
    {
        $sabbaticalLeave = $this->sabbaticalLeaveRepository->updateOrCreate(['EmployeeId' => $request->employeeId], $request->all());
        return $this->success($sabbaticalLeave, trans('lang-profile::messages.common.modifySuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $sabbaticalLeave = $this->sabbaticalLeaveRepository->find($id);
        if ($sabbaticalLeave) {
            return $this->success($sabbaticalLeave, trans('lang-profile::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function destroy($id)
    {
        $this->sabbaticalLeave->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
