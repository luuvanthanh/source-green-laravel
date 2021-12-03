<?php

namespace GGPHP\Crm\Config\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Config\Http\Requests\ConfigMedicalDeclareCreateRequest;
use GGPHP\Crm\Config\Repositories\Contracts\ConfigMedicalDeclareRepository;

class ConfigMedicalDeclareController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $configMedicalDeclareRepository;

    /**
     * UserController constructor.
     * @param ConfigMedicalDeclareRepository $inOutHistoriesRepository
     */
    public function __construct(ConfigMedicalDeclareRepository $configMedicalDeclareRepository)
    {
        $this->configMedicalDeclareRepository = $configMedicalDeclareRepository;
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

        $configMedicalDeclare = $this->configMedicalDeclareRepository->getAll($attributes);

        return $this->success($configMedicalDeclare, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ConfigMedicalDeclareCreateRequest $request)
    {
        $attributes = $request->all();

        $configMedicalDeclare = $this->configMedicalDeclareRepository->createOrUpdate($attributes);

        return $this->success($configMedicalDeclare, trans('lang::messages.common.createSuccess'));
    }
}
