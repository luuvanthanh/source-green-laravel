<?php

namespace GGPHP\Crm\Marketing\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Marketing\Repositories\Contracts\ArticleCommentInfoRepository;

class ArticleCommentInfoController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $articleCommentRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(ArticleCommentInfoRepository $articleCommentRepository)
    {
        $this->articleCommentRepository = $articleCommentRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $articleComment = $this->articleCommentRepository->getArticleCommentInfo($request->all());

        return $this->success($articleComment, trans('lang::messages.common.getListSuccess'));
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

        $articleComment = $this->articleCommentRepository->create($credentials);

        return $this->success($articleComment, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $articleComment = $this->articleCommentRepository->find($id);

        return $this->success($articleComment, trans('lang::messages.common.getInfoSuccess'));
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

        $articleComment = $this->articleCommentRepository->update($credentials, $id);

        return $this->success($articleComment, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request)
    {
        $this->articleCommentRepository->deleteArticleCommentInfo($id, $request->all());

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
