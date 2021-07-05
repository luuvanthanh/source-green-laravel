<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\ParameterTaxCreateRequest;
use GGPHP\Category\Http\Requests\ParameterTaxUpdateRequest;
use GGPHP\Category\Repositories\Contracts\ParameterTaxRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ParameterTaxController extends Controller
{
    /**
     * @var $paramaterTaxRepository
     */
    protected $paramaterTaxRepository;

    /**
     * UserController constructor.
     * @param ParameterTaxRepository $paramaterTaxRepository
     */
    public function __construct(ParameterTaxRepository $paramaterTaxRepository)
    {
        $this->paramaterTaxRepository = $paramaterTaxRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $paramaterTaxs = $this->paramaterTaxRepository->getParameterTax($request->all());

        return $this->success($paramaterTaxs, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(ParameterTaxCreateRequest $request)
    {
        $credentials = $request->all();
        $paramaterTax = $this->paramaterTaxRepository->create($credentials);
        return $this->success($paramaterTax, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $paramaterTax = $this->paramaterTaxRepository->find($id);
        return $this->success($paramaterTax, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ParameterTaxUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(ParameterTaxUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $paramaterTax = $this->paramaterTaxRepository->update($credentials, $id);
        return $this->success($paramaterTax, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->paramaterTaxRepository->delete($id);
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
        $paramaterTax = $this->paramaterTaxRepository->loadCategory($credentials);

        return $this->success($paramaterTax, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
