<?php

namespace GGPHP\Recruitment\Http\Controllers;

use GGPHP\Recruitment\Http\Requests\LevelCreateRequest;
use GGPHP\Recruitment\Http\Requests\LevelDeleteRequest;
use GGPHP\Recruitment\Http\Requests\LevelUpdateRequest;
use GGPHP\Recruitment\Repositories\Contracts\LevelRepository;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Recruitment\Http\Requests\ConfigureThankCreateRequest;
use GGPHP\Recruitment\Http\Requests\ConfigureThankUpdateRequest;
use GGPHP\Recruitment\Http\Requests\RecruitmentConfigurationCreateRequest;
use GGPHP\Recruitment\Http\Requests\RecruitmentConfigurationDeleteRequest;
use GGPHP\Recruitment\Http\Requests\RecruitmentConfigurationUpdateRequest;
use GGPHP\Recruitment\Repositories\Contracts\RecruitmentConfigurationRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RecruitmentConfigurationController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $recruitmentConfigurationRepository;

    /**
     * UserController constructor.
     * @param LevelRepository $blockRepository
     */
    public function __construct(RecruitmentConfigurationRepository $recruitmentConfigurationRepository)
    {
        $this->recruitmentConfigurationRepository = $recruitmentConfigurationRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $recruitmentConfigurations = $this->recruitmentConfigurationRepository->getRecruitmentConfiguration($request->all());

        return $this->success($recruitmentConfigurations, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(RecruitmentConfigurationCreateRequest $request)
    {
        $credentials = $request->all();
        $recruitmentConfiguration = $this->recruitmentConfigurationRepository->create($credentials);
        return $this->success($recruitmentConfiguration, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $recruitmentConfiguration = $this->recruitmentConfigurationRepository->find($id);
        return $this->success($recruitmentConfiguration, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param LevelUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(RecruitmentConfigurationUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $recruitmentConfiguration = $this->recruitmentConfigurationRepository->update($credentials, $id);
        return $this->success($recruitmentConfiguration, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(RecruitmentConfigurationDeleteRequest $request, $id)
    {
        $this->recruitmentConfigurationRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getConfigureThanks(Request $request)
    {
        $recruitmentConfigurations = $this->recruitmentConfigurationRepository->getConfigureThanks($request->all());

        return $this->success($recruitmentConfigurations, trans('lang::messages.common.getListSuccess'));
    }

    public function storeConfigureThanks(ConfigureThankCreateRequest $request)
    {
        $credentials = $request->all();
        $configureThank = $this->recruitmentConfigurationRepository->storeConfigureThanks($credentials);

        return $this->success($configureThank, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    public function updateConfigureThanks(ConfigureThankUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $recruitmentConfiguration = $this->recruitmentConfigurationRepository->updateConfigureThanks($credentials, $id);

        return $this->success($recruitmentConfiguration, trans('lang::messages.common.modifySuccess'));
    }
}
