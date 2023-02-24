<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\KnowledgeToTeachChildren\Http\Requests\CategoryKnowledgeToTeachChildrenCreateRequest;
use GGPHP\Crm\KnowledgeToTeachChildren\Http\Requests\CategoryKnowledgeToTeachChildrenDeleteRequest;
use GGPHP\Crm\KnowledgeToTeachChildren\Http\Requests\CategoryKnowledgeToTeachChildrenUpdateRequest;
use GGPHP\Crm\KnowledgeToTeachChildren\Repositories\Contracts\CategoryKnowledgeToTeachChildrenRepository;

class CategoryKnowledgeToTeachChildrenController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $categoryKnowledgeToTeachChildrenRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(CategoryKnowledgeToTeachChildrenRepository $categoryKnowledgeToTeachChildrenRepository)
    {
        $this->categoryKnowledgeToTeachChildrenRepository = $categoryKnowledgeToTeachChildrenRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $result = $this->categoryKnowledgeToTeachChildrenRepository->getAll($request->all());

        return $this->success($result, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CategoryKnowledgeToTeachChildrenCreateRequest $request)
    {
        
        $credentials = $request->all();

        $result = $this->categoryKnowledgeToTeachChildrenRepository->create($credentials);

        return $this->success($result, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $result = $this->categoryKnowledgeToTeachChildrenRepository->find($id);

        return $this->success($result, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CategoryKnowledgeToTeachChildrenUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $result = $this->categoryKnowledgeToTeachChildrenRepository->update($credentials, $id);

        return $this->success($result, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(CategoryKnowledgeToTeachChildrenDeleteRequest $request, $id)
    {
        $this->categoryKnowledgeToTeachChildrenRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
