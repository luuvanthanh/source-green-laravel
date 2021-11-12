<?php

namespace GGPHP\Crm\Category\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Category\Http\Requests\CategoryRelationshipCreateRequest;
use GGPHP\Crm\Category\Http\Requests\CategoryRelationshipUpdateRequest;
use GGPHP\Crm\Category\Repositories\Contracts\CategoryRelationshipRepository;

class CategoryRelationshipController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $categoryRelationshipRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(CategoryRelationshipRepository $categoryRelationshipRepository)
    {
        $this->categoryRelationshipRepository = $categoryRelationshipRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $categoryRelationShip = $this->categoryRelationshipRepository->getAll($request->all());

        return $this->success($categoryRelationShip, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CategoryRelationshipCreateRequest $request)
    {

        $credentials = $request->all();

        $categoryRelationShip = $this->categoryRelationshipRepository->create($credentials);

        return $this->success($categoryRelationShip, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $categoryRelationship = $this->categoryRelationshipRepository->find($id);

        return $this->success($categoryRelationship, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CategoryRelationshipUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $categoryRelationship = $this->categoryRelationshipRepository->update($credentials, $id);

        return $this->success($categoryRelationship, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->categoryRelationshipRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
