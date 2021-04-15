<?php

namespace GGPHP\RevokeShift\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\RevokeShift\Http\Requests\RevokeShiftCreateRequest;
use GGPHP\RevokeShift\Http\Requests\RevokeShiftUpdateRequest;
use GGPHP\RevokeShift\Repositories\Contracts\RevokeShiftRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RevokeShiftController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $revokeShiftRepository;

    /**
     * UserController constructor.
     * @param RevokeShiftRepository $revokeShiftRepository
     */
    public function __construct(RevokeShiftRepository $revokeShiftRepository)
    {
        $this->revokeShiftRepository = $revokeShiftRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $revokeShifts = $this->revokeShiftRepository->getRevokeShift($request->all());

        return $this->success($revokeShifts, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(RevokeShiftCreateRequest $request)
    {
        $credentials = $request->all();
        $revokeShift = $this->revokeShiftRepository->create($credentials);
        return $this->success($revokeShift, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $revokeShift = $this->revokeShiftRepository->find($id);
        return $this->success($revokeShift, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param RevokeShiftUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(RevokeShiftUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $revokeShift = $this->revokeShiftRepository->update($credentials, $id);
        return $this->success($revokeShift, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->revokeShiftRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function loadRevokeShift(Request $request)
    {
        $credentials = $request->all();
        $revokeShift = $this->revokeShiftRepository->loadRevokeShift($credentials);

        return $this->success($revokeShift, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
