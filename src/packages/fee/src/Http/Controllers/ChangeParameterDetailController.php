<?php

namespace GGPHP\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Fee\Repositories\Contracts\ChangeParameterDetailRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ChangeParameterDetailController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $changeParameterDetailRepository;

    /**
     * UserController constructor.
     * @param ChangeParameterDetailRepository $changeParameterDetailRepository
     */
    public function __construct(ChangeParameterDetailRepository $changeParameterDetailRepository)
    {
        $this->changeParameterDetailRepository = $changeParameterDetailRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $changeParameterDetails = $this->changeParameterDetailRepository->filterchangeParameterDetail($request->all());

        return $this->success($changeParameterDetails, trans('lang::messages.common.getListSuccess'));
    }
}
