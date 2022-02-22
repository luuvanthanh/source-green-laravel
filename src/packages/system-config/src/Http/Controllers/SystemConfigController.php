<?php

namespace GGPHP\SystemConfig\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\SystemConfig\Http\Requests\SystemConfigCreateRequest;
use GGPHP\SystemConfig\Http\Requests\SystemConfigUpdateRequest;
use GGPHP\SystemConfig\Repositories\Contracts\SystemConfigRepository;
use GGPHP\SystemConfig\Models\SystemConfig;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SystemConfigController extends Controller
{
    /**
     * @var $systemConfigrRepository
     */
    protected $systemConfigrRepository;

    /**
     * SystemConfigController constructor.
     * @param SystemConfigRepository $SystemConfigRepository
     */
    public function __construct(SystemConfigRepository $systemConfigRepository)
    {
        $this->systemConfigRepository = $systemConfigRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $systemConfigs = $this->systemConfigRepository->getSystemConfigs($request->all());

        return $this->success($systemConfigs, trans('lang::messages.common.getListSuccess'));
    }

    /**
     *
     * @param SystemConfigCreateRequest $request
     *
     * @return Response
     */
    public function store(SystemConfigCreateRequest $request)
    {

        $attributes = $request->all();

        $systemConfigs = $this->systemConfigRepository->create($attributes);

        return $this->success($systemConfigs, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     *
     * @param SystemConfigUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(SystemConfigUpdateRequest $request, SystemConfig $systemConfig)
    {
        $attributes = $request->all();

        $systemConfig =  $this->systemConfigRepository->update($attributes, $systemConfig);

        return $this->success($systemConfig, trans('lang::messages.common.modifySuccess'));
    }

    public function updateReceiveEmail(Request $request)
    {
        $systemConfigs = $this->systemConfigRepository->updateReceiveEmail($request->all());

        return $this->success($systemConfigs, trans('lang::messages.common.modifySuccess'));
    }

    public function onOffTeamplateEmail(Request $request, $id)
    {
        $this->systemConfigRepository->onOffTeamplateEmail($request->all(), $id);

        return $this->success([], trans('lang::messages.common.modifySuccess'));
    }

    public function updateTeamplateEmail(Request $request, $id)
    {
        $systemConfigs = $this->systemConfigRepository->updateTeamplateEmail($request->all(), $id);

        return $this->success([], trans('lang::messages.common.modifySuccess'));
    }
}
