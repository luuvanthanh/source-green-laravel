<?php

namespace GGPHP\Config\Http\Controllers;

use GGPHP\Config\Http\Requests\ConfigCreateRequest;
use GGPHP\Config\Http\Requests\ConfigUpdateRequest;
use GGPHP\Config\Repositories\Contracts\ConfigRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ConfigController extends Controller
{
    /**
     * @var $configRepository
     */
    protected $configRepository;

    /**
     * UserController constructor.
     * @param ConfigRepository $configRepository
     */
    public function __construct(ConfigRepository $configRepository)
    {
        $this->configRepository = $configRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(ConfigCreateRequest $request)
    {
        $config = $this->configRepository->create($request->all());

        return $this->success($config, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $config = $this->configRepository->find($id);

        return $this->success($config, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = config('constants.SEARCH_VALUES_DEFAULT.LIMIT');
        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        if ($limit == config('constants.SEARCH_VALUES_DEFAULT.LIMIT_ZERO')) {
            $config = $this->configRepository->all();
        } else {
            $config = $this->configRepository->paginate($limit);
        }

        return $this->success($config, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(ConfigUpdateRequest $request, $id)
    {
        $config = $this->configRepository->update($request->all(), $id);

        return $this->success($config, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->configRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

}
