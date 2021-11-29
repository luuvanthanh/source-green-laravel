<?php

namespace GGPHP\Crm\Icon\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Icon\Http\Requests\CreateIconRequest;
use GGPHP\Crm\Icon\Http\Requests\UpdateIconRequest;
use GGPHP\Crm\Icon\Repositories\Contracts\IconRepository;

class IconController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $iconRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(IconRepository $iconRepository)
    {
        $this->iconRepository = $iconRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $icon = $this->iconRepository->getAll($request->all());

        return $this->success($icon, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $credentials = $request->all();

        $icon = $this->iconRepository->create($credentials);

        return $this->success($icon, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $icon = $this->iconRepository->find($id);

        return $this->success($icon, trans('lang::messages.common.getInfoSuccess'));
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

        $icon = $this->iconRepository->update($credentials, $id);

        return $this->success($icon, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->iconRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
