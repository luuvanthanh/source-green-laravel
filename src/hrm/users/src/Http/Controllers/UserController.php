<?php

namespace GGPHP\Users\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Users\Http\Requests\UserCreateRequest;
use GGPHP\Users\Http\Requests\UserUpdateRequest;
use GGPHP\Users\Http\Requests\UserUpdateStatusRequest;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $employeeRepository;

    /**
     * UserController constructor.
     * @param UserRepository $employeeRepository
     */
    public function __construct(UserRepository $employeeRepository)
    {
        $this->employeeRepository = $employeeRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['status'])) {
            $status = explode(',', $attributes['status']);
            $newStatus = [];
            foreach ($status as $value) {
                $newStatus[] = User::STATUS[$value];
            }

            $attributes['status'] = $newStatus;
        }

        if (!empty($attributes['category'])) {
            $attributes['category'] = User::CATEGORY[$attributes['category']];
        }

        $employees = $this->employeeRepository->getUser($attributes);

        return $this->success($employees, trans('lang::messages.common.getListSuccess'));
    }

    /**
     *
     * @param UserCreateRequest $request
     *
     * @return Response
     */
    public function store(UserCreateRequest $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['status'])) {
            $attributes['status'] = User::STATUS[$attributes['status']];
        }

        if (!empty($attributes['category'])) {
            $attributes['category'] = User::CATEGORY[$attributes['category']];
        }

        $employee = $this->employeeRepository->create($attributes);

        return $this->success($employee, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function show(Request $request, $id)
    {
        $employee = $this->employeeRepository->find($id);

        return $this->success($employee, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     *
     * @param UserUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(UserUpdateRequest $request, $id)
    {
        $attributes = $request->all();

        if (!empty($attributes['status'])) {
            $attributes['status'] = User::STATUS[$attributes['status']];
        }

        if (!empty($attributes['category'])) {
            $attributes['category'] = User::CATEGORY[$attributes['category']];
        }

        $employee = $this->employeeRepository->update($attributes, $id);

        return $this->success($employee, trans('lang::messages.common.modifySuccess'));
    }

    /**
     *
     * @param UserUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function storage(UserUpdateRequest $request, $id)
    {
        $attributes = $request->all();

        if (!empty($attributes['status'])) {
            $attributes['status'] = User::STATUS[$attributes['status']];
        }

        $employee = $this->employeeRepository->update([
            'Status' => $attributes['status'],
            'DateOff' => null
        ], $id);

        return $this->success($employee, trans('lang::messages.common.modifySuccess'));
    }

    public function sendEmployeeAccountant()
    {
        $employee = $this->employeeRepository->sendEmployeeAccountant();
        return $this->success(['data' => $employee], trans('lang::messages.common.getListSuccess'));
    }

    public function syncEmployee()
    {
        $employee = $this->employeeRepository->syncEmployee();

        return $this->success($employee, trans('lang::messages.common.modifySuccess'));
    }

    public function updateStatusEmployee(UserUpdateStatusRequest $request, $id)
    {
        $employee = $this->employeeRepository->updateStatusEmployee($request->all(), $id);

        return $this->success($employee, trans('lang::messages.common.modifySuccess'));
    }

    public function updateLastName()
    {
        $this->employeeRepository->updateLastName();
    }
}
