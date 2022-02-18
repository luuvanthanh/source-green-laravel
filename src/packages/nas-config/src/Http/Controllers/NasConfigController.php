<?php

namespace GGPHP\NasConfig\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\NasConfig\Http\Requests\NasConfigCreateRequest;
use GGPHP\NasConfig\Http\Requests\NasConfigUpdateRequest;
use GGPHP\NasConfig\Repositories\Contracts\NasConfigRepository;
use GGPHP\NasConfig\Models\NasConfig;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NasConfigController extends Controller
{
    /**
     * @var $nasConfigrRepository
     */
    protected $nasConfigrRepository;

    /**
     * NasConfigController constructor.
     * @param NasConfigRepository $NasConfigRepository
     */
    public function __construct(NasConfigRepository $nasConfigRepository)
    {
        $this->nasConfigRepository = $nasConfigRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $nasConfigs = $this->nasConfigRepository->getNasConfig(['id' => '2ed4a57e-6643-48ab-a5ed-84afe73a84f4']);

        return $this->success($nasConfigs, trans('lang::messages.common.getListSuccess'));
    }

    /**
     *
     * @param NasConfigCreateRequest $request
     *
     * @return Response
     */
    public function store(NasConfigCreateRequest $request)
    {

        $attributes = $request->all();

        $nasConfigs = $this->nasConfigRepository->createOrUpdate($attributes);

        return $this->success($nasConfigs, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
