<?php

namespace GGPHP\ChildDevelop\Category\Http\Controllers;

use GGPHP\ChildDevelop\Category\Http\Requests\LogoCreateRequest;
use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\ChildDevelop\Category\Repositories\Contracts\LogoRepository;

class LogoController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $logoRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(LogoRepository $logoRepository)
    {
        $this->logoRepository = $logoRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $logo = $this->logoRepository->get($request->all());

        return $this->success($logo, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(LogoCreateRequest $request)
    {
        $logo = $this->logoRepository->createAll($request->all());

        return $this->success($logo, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $logo = $this->logoRepository->find($id);

        return $this->success($logo, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $credentials = $request->all();

        $logo = $this->logoRepository->update($credentials, $id);

        return $this->success($logo, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $this->logoRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
