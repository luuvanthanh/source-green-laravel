<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\KnowledgeToTeachChildren\Http\Requests\GetBmiChildrenRequest;
use GGPHP\Crm\KnowledgeToTeachChildren\Http\Requests\PostKnowledgeToTeachChildrenCreateRequest;
use GGPHP\Crm\KnowledgeToTeachChildren\Http\Requests\PostKnowledgeToTeachChildrenUpdateRequest;
use GGPHP\Crm\KnowledgeToTeachChildren\Repositories\Contracts\PostKnowledgeToTeachChildrenRepository;

class PostKnowledgeToTeachChildrenController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $postKnowledgeToTeachChildrenRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(PostKnowledgeToTeachChildrenRepository $postKnowledgeToTeachChildrenRepository)
    {
        $this->postKnowledgeToTeachChildrenRepository = $postKnowledgeToTeachChildrenRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $result = $this->postKnowledgeToTeachChildrenRepository->getAll($request->all());

        return $this->success($result, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PostKnowledgeToTeachChildrenCreateRequest $request)
    {
        
        $credentials = $request->all();

        $result = $this->postKnowledgeToTeachChildrenRepository->create($credentials);

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
        $result = $this->postKnowledgeToTeachChildrenRepository->find($id);

        return $this->success($result, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(PostKnowledgeToTeachChildrenUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $result = $this->postKnowledgeToTeachChildrenRepository->update($credentials, $id);

        return $this->success($result, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->postKnowledgeToTeachChildrenRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getBmiChildren(GetBmiChildrenRequest $request)
    {
        $credentials = $request->all();

        $result = $this->postKnowledgeToTeachChildrenRepository->getBmiChildren($credentials);

        return $this->success(['data' => [$result]], trans('lang::messages.common.getInfoSuccess'));
    }
}
