<?php

namespace GGPHP\Crm\WebForm\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\WebForm\Repositories\Contracts\WebFormCustomerRepository;

class WebFormCustomerController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $webFormCustomerRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(WebFormCustomerRepository $webFormCustomerRepository)
    {
        $this->webFormCustomerRepository = $webFormCustomerRepository;
    }

    public function store(Request $request)
    {
        $credentials = $request->all();

        $webFormCustomer = $this->webFormCustomerRepository->create($credentials);

        return $this->success([], trans('lang::messages.common.createSuccess'));
    }
}
