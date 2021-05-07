<?php

namespace GGPHP\Users\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Users\Http\Requests\UserCreateRequest;
use GGPHP\Users\Http\Requests\UserUpdateRequest;
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
        $employees = $this->employeeRepository->getUser($request->all());

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

        $employee = $this->employeeRepository->update($attributes, $id);

        return $this->success($employee, trans('lang::messages.common.modifySuccess'));
    }
}
