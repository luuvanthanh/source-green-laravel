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
    protected $postFacebookInfoRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(ArticleReactionInfoRepository $postFacebookInfoRepository)
    {
        $this->postFacebookInfoRepository = $postFacebookInfoRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $postFacebookInfo = $this->postFacebookInfoRepository->getArticleReactionInfo($request->all());

        return $this->success($postFacebookInfo, trans('lang::messages.common.getListSuccess'));
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

        $postFacebookInfo = $this->postFacebookInfoRepository->create($credentials);

        return $this->success($postFacebookInfo, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $postFacebookInfo = $this->postFacebookInfoRepository->find($id);

        return $this->success($postFacebookInfo, trans('lang::messages.common.getInfoSuccess'));
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

        $postFacebookInfo = $this->postFacebookInfoRepository->update($credentials, $id);

        return $this->success($postFacebookInfo, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request)
    {
        $this->postFacebookInfoRepository->deleteArticleReactionInfo($id, $request->all());

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
