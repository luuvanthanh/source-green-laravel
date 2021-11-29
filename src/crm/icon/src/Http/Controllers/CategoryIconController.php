<?php

namespace GGPHP\Crm\Icon\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Icon\Http\Requests\CreateIconRequest;
use GGPHP\Crm\Icon\Http\Requests\UpdateIconRequest;
use GGPHP\Crm\Icon\Repositories\Contracts\CategoryIconRepository;

class CategoryIconController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $CategoryIconRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(CategoryIconRepository $CategoryIconRepository)
    {
        $this->CategoryIconRepository = $CategoryIconRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $icon = $this->CategoryIconRepository->getAll($request->all());

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

        $icon = $this->CategoryIconRepository->create($credentials);

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
        $icon = $this->CategoryIconRepository->find($id);

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

        $icon = $this->CategoryIconRepository->update($credentials, $id);

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
        $this->CategoryIconRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
