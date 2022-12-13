<?php

namespace GGPHP\Arkki\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Arkki\Repositories\Contracts\TeachingShiftRepository;
use Illuminate\Http\Request;

class TeachingShiftController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $teachingShiftRepository;

    /**
     * UserController constructor.
     * @param teachingShiftRepository $teachingShiftRepository
     */
    public function __construct(TeachingShiftRepository $teachingShiftRepository)
    {
        $this->teachingShiftRepository = $teachingShiftRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $employees = $this->teachingShiftRepository->all();

        return $this->success($employees, trans('lang::messages.common.getListSuccess'));
    }
}
