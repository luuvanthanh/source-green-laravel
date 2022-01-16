<?php

namespace GGPHP\Crm\ChildDevelop\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\ChildDevelop\Http\Requests\CategoryQuestionParentCreateRequest;
use GGPHP\Crm\ChildDevelop\Repositories\Contracts\CategoryQuestionParentRepository;

class CategoryQuestionParentController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $categoryQuestionParentRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(CategoryQuestionParentRepository $categoryQuestionParentRepository)
    {
        $this->categoryQuestionParentRepository = $categoryQuestionParentRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $categoryQuestionParent = $this->categoryQuestionParentRepository->getAll($request->all());

        return $this->success($categoryQuestionParent, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CategoryQuestionParentCreateRequest $request)
    {
        $credentials = $request->all();

        $categoryQuestionParent = $this->categoryQuestionParentRepository->create($credentials);

        return $this->success($categoryQuestionParent, trans('lang::messages.common.createSuccess'));
    }
}
