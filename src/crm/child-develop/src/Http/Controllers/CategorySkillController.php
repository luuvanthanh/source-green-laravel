<?php

namespace GGPHP\Crm\ChildDevelop\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\ChildDevelop\Http\Requests\CreateCategorySkillRequest;
use GGPHP\Crm\ChildDevelop\Http\Requests\DeleteCategorySkillRequest;
use GGPHP\Crm\ChildDevelop\Http\Requests\UpdateCategorySkillRequest;
use GGPHP\Crm\ChildDevelop\Repositories\Contracts\CategorySkillRepository;

class CategorySkillController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $categorySkillRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(CategorySkillRepository $categorySkillRepository)
    {
        $this->categorySkillRepository = $categorySkillRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $categorySkill = $this->categorySkillRepository->getAll($request->all());

        return $this->success($categorySkill, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateCategorySkillRequest $request)
    {
        $credentials = $request->all();

        $categorySkill = $this->categorySkillRepository->create($credentials);

        return $this->success($categorySkill, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $categorySkill = $this->categorySkillRepository->find($id);

        return $this->success($categorySkill, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCategorySkillRequest $request, $id)
    {
        $credentials = $request->all();

        $categorySkill = $this->categorySkillRepository->update($credentials, $id);

        return $this->success($categorySkill, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(DeleteCategorySkillRequest $request, $id)
    {
        $this->categorySkillRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function sort(Request $request)
    {
        $categorySkill = $this->categorySkillRepository->sort($request->all());

        return $this->success($categorySkill, trans('lang::messages.common.getListSuccess'));
    }
}
