<?php

namespace GGPHP\ChildDevelop\Category\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\ChildDevelop\Category\Http\Requests\CreateCategoryChildIssueRequest;
use GGPHP\ChildDevelop\Category\Http\Requests\UpdateCategoryChildIssueRequest;
use GGPHP\ChildDevelop\Category\Repositories\Contracts\CategoryChildIssueRepository;

class CategoryChildIssueController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $categoryChildIssueRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(CategoryChildIssueRepository $categoryChildIssueRepository)
    {
        $this->categoryChildIssueRepository = $categoryChildIssueRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $categoryIssue = $this->categoryChildIssueRepository->getAll($request->all());

        return $this->success($categoryIssue, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateCategoryChildIssueRequest $request)
    {
        $credentials = $request->all();

        $categoryIssue = $this->categoryChildIssueRepository->create($credentials);

        return $this->success($categoryIssue, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $categoryIssue = $this->categoryChildIssueRepository->find($id);

        return $this->success($categoryIssue, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCategoryChildIssueRequest $request, $id)
    {
        $credentials = $request->all();

        $categoryIssue = $this->categoryChildIssueRepository->update($credentials, $id);

        return $this->success($categoryIssue, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->categoryChildIssueRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
