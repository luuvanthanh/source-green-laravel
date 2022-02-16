<?php

namespace GGPHP\Crm\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Fee\Repositories\Contracts\TuitionRepository;
use Illuminate\Http\Request;

class TuitionController extends Controller
{
    /**
     * 
     * @var $employeeRepository
     */
    protected $tuition;

    /**
     * UserController constructor.
     * @param ReviewRepository $inOutHistoriesRepository
     */
    public function __construct(TuitionRepository $tuition)
    {
        $this->tuitionRepository = $tuition;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $tuition = $this->tuitionRepository->getTuition($request->all());

        return $this->success($tuition, trans('lang::messages.common.getListSuccess'));
    }
}
