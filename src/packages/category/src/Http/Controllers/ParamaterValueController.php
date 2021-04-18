<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\ParamaterValueCreateRequest;
use GGPHP\Category\Http\Requests\ParamaterValueUpdateRequest;
use GGPHP\Category\Repositories\Contracts\ParamaterValueRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ParamaterValueController extends Controller
{
    /**
     * @var $paramaterValueRepository
     */
    protected $paramaterValueRepository;

    /**
     * UserController constructor.
     * @param ParamaterValueRepository $paramaterValueRepository
     */
    public function __construct(ParamaterValueRepository $paramaterValueRepository)
    {
        $this->paramaterValueRepository = $paramaterValueRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $paramaterValues = $this->paramaterValueRepository->getParamaterValue($request->all());

        return $this->success($paramaterValues, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(ParamaterValueCreateRequest $request)
    {
        $credentials = $request->all();
        $paramaterValue = $this->paramaterValueRepository->create($credentials);
        return $this->success($paramaterValue, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $paramaterValue = $this->paramaterValueRepository->find($id);
        return $this->success($paramaterValue, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ParamaterValueUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(ParamaterValueUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $paramaterValue = $this->paramaterValueRepository->update($credentials, $id);
        return $this->success($paramaterValue, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->paramaterValueRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function loadCategory(Request $request)
    {
        $credentials = $request->all();
        $paramaterValue = $this->paramaterValueRepository->loadCategory($credentials);

        return $this->success($paramaterValue, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
