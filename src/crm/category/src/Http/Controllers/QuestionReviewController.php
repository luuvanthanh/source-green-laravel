<?php

namespace GGPHP\Crm\Category\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Category\Http\Requests\QuestionReviewCreateRequest;
use GGPHP\Crm\Category\Repositories\Contracts\QuestionReviewRepository;

class QuestionReviewController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $questionReviewRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(QuestionReviewRepository $questionReviewRepository)
    {
        $this->questionReviewRepository = $questionReviewRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $questionReview = $this->questionReviewRepository->getAll($request->all());

        return $this->success($questionReview, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function questionReview(QuestionReviewCreateRequest $request)
    {
        $credentials = $request->all();

        $questionReview = $this->questionReviewRepository->create($credentials);

        return $this->success($questionReview, trans('lang::messages.common.createSuccess'));
    }
}
