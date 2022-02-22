<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\ParamaterFormulaCreateRequest;
use GGPHP\Category\Http\Requests\ParamaterFormulaUpdateRequest;
use GGPHP\Category\Repositories\Contracts\ParamaterFormulaRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ParamaterFormulaController extends Controller
{
    /**
     * @var $paramaterFormulaRepository
     */
    protected $paramaterFormulaRepository;

    /**
     * UserController constructor.
     * @param ParamaterFormulaRepository $paramaterFormulaRepository
     */
    public function __construct(ParamaterFormulaRepository $paramaterFormulaRepository)
    {
        $this->paramaterFormulaRepository = $paramaterFormulaRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $paramaterFormulas = $this->paramaterFormulaRepository->getParamaterFormula($request->all());

        return $this->success($paramaterFormulas, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(ParamaterFormulaCreateRequest $request)
    {
        $credentials = $request->all();
        $paramaterFormula = $this->paramaterFormulaRepository->create($credentials);
        return $this->success($paramaterFormula, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $paramaterFormula = $this->paramaterFormulaRepository->find($id);
        return $this->success($paramaterFormula, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ParamaterFormulaUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(ParamaterFormulaUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $paramaterFormula = $this->paramaterFormulaRepository->update($credentials, $id);
        return $this->success($paramaterFormula, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->paramaterFormulaRepository->delete($id);
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
        $paramaterFormula = $this->paramaterFormulaRepository->loadCategory($credentials);

        return $this->success($paramaterFormula, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
