<?php

namespace GGPHP\Tariff\ConfigContent\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Tariff\ConfigContent\Http\Requests\ConfigContentCreateRequest;
use GGPHP\Tariff\ConfigContent\Repositories\Contracts\ConfigContentRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ConfigContentController extends Controller
{
    /**
     * @var $parentRepository
     */
    protected $configContentRepository;

    /**
     * UserController constructor.
     * @param ConfigContentRepository $ConfigContentRepository
     */
    public function __construct(ConfigContentRepository $configContentRepository)
    {
        $this->configContentRepository = $configContentRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $configContent = $this->configContentRepository->getAll($request->all());

        return $this->success($configContent, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param $request
     * @return \Illuminate\Http\Response
     */
    public function store(ConfigContentCreateRequest $request)
    {
        $configContent = $this->configContentRepository->create($request->all());

        return $this->success($configContent, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    public function destroy($id)
    {
        $this->configContentRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
