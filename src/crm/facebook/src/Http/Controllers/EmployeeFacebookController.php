<?php

namespace GGPHP\Crm\Facebook\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Facebook\Repositories\Contracts\EmployeeFacebookRepository;
use Illuminate\Http\Request;

class EmployeeFacebookController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $employeeFacebookRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(EmployeeFacebookRepository $employeeFacebookRepository)
    {
        $this->employeeFacebookRepository = $employeeFacebookRepository;
    }

    public function index(Request $request)
    {
        $userFacebookInfoTag = $this->employeeFacebookRepository->getEmployeeFacebook($request->all());

        return $this->success($userFacebookInfoTag, trans('lang::messages.common.getListSuccess'));
    }

    public function store(Request $request)
    {
        $credentials = $request->all();

        $userFacebookInfoTag = $this->employeeFacebookRepository->create($credentials);

        return $this->success($userFacebookInfoTag, trans('lang::messages.common.modifySuccess'));
    }

    public function destroyAllEmployeeFacebook()
    {
        $this->employeeFacebookRepository->destroyAllEmployeeFacebook();

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
