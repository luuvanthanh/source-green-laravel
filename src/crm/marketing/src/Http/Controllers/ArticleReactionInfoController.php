<?php

namespace GGPHP\Crm\Marketing\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Marketing\Repositories\Contracts\ArticleReactionInfoRepository;

class ArticleReactionInfoController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $articleReactionInfoRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(ArticleReactionInfoRepository $articleReactionInfoRepository)
    {
        $this->articleReactionInfoRepository = $articleReactionInfoRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $articleReactionInfo = $this->articleReactionInfoRepository->getArticleReactionInfo($request->all());

        return $this->success($articleReactionInfo, trans('lang::messages.common.getListSuccess'));
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

        $articleReactionInfo = $this->articleReactionInfoRepository->create($credentials);

        return $this->success($articleReactionInfo, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $articleReactionInfo = $this->articleReactionInfoRepository->find($id);

        return $this->success($articleReactionInfo, trans('lang::messages.common.getInfoSuccess'));
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

        $articleReactionInfo = $this->articleReactionInfoRepository->update($credentials, $id);

        return $this->success($articleReactionInfo, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request)
    {
        $this->articleReactionInfoRepository->deleteArticleReactionInfo($id, $request->all());

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
