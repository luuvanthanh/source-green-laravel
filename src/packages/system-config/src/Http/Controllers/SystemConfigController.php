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
     * @param Request $request
     * @param  SystemConfig $systemConfig
     * @return Response
     */
    public function show(Request $request, SystemConfig $systemConfig)
    {
        $systemConfig = $this->systemConfigRepository->parserResult($systemConfig);

        return $this->success($systemConfig, trans('lang::messages.common.getInfoSuccess'));
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

    /**
     *
     * @param SystemConfig $systemConfig
     *
     * @return Response
     */
    public function destroy($id)
    {
        if ($this->systemConfigRepository->delete($id)) {
            return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
        }

        return response()->json(null, Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
