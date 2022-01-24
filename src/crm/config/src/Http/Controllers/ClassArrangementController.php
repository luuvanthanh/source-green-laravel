<?php

namespace GGPHP\Crm\Config\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Config\Repositories\Contracts\ClassArrangementRepository;

class ClassArrangementController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $classArrangementRepository;

    /**
     * UserController constructor.
     * @param ClassArrangementRepository $inOutHistoriesRepository
     */
    public function __construct(ClassArrangementRepository $classArrangementRepository)
    {
        $this->classArrangementRepository = $classArrangementRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $attributes = $request->all();

        $classArrangement = $this->classArrangementRepository->getAll($attributes);

        return $this->success($classArrangement, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $attributes = $request->all();

        $classArrangement = $this->classArrangementRepository->createOrUpdate($attributes);

        return $this->success($classArrangement, trans('lang::messages.common.createSuccess'));
    }
}
