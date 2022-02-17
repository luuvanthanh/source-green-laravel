<?php

namespace GGPHP\Crm\Category\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Category\Http\Requests\CategoryEventCreateRequest;
use GGPHP\Crm\Category\Http\Requests\CategoryEventUpdateRequest;
use GGPHP\Crm\Category\Repositories\Contracts\CategoryEventRepository;

class CategoryEventController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $categoryEventRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(CategoryEventRepository $categoryEventRepository)
    {
        $this->categoryEventRepository = $categoryEventRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $categoryEvent = $this->categoryEventRepository->getAll($request->all());

        return $this->success($categoryEvent, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CategoryEventCreateRequest $request)
    {
        
        $credentials = $request->all();

        $categoryEvent = $this->categoryEventRepository->create($credentials);

        return $this->success($categoryEvent, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $categoryEvent = $this->categoryEventRepository->find($id);

        return $this->success($categoryEvent, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CategoryEventUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $categoryEvent = $this->categoryEventRepository->update($credentials, $id);

        return $this->success($categoryEvent, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->categoryEventRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
