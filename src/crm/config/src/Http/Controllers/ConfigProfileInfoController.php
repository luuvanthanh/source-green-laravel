<?php

namespace GGPHP\Crm\Config\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Config\Repositories\Contracts\ConfigMedicalDeclareRepository;
use GGPHP\Crm\Config\Repositories\Contracts\ConfigProfileInfoRepository;

class ConfigProfileInfoController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $configProfileInfoRepository;

    /**
     * UserController constructor.
     * @param ConfigMedicalDeclareRepository $inOutHistoriesRepository
     */
    public function __construct(ConfigProfileInfoRepository $configProfileInfoRepository)
    {
        $this->configProfileInfoRepository = $configProfileInfoRepository;
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

        $configProfileInfo = $this->configProfileInfoRepository->getAll($attributes);

        return $this->success($configProfileInfo, trans('lang::messages.common.getListSuccess'));
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

        $configProfileInfo = $this->configProfileInfoRepository->createOrUpdate($attributes);

        return $this->success($configProfileInfo, trans('lang::messages.common.createSuccess'));
    }
}
