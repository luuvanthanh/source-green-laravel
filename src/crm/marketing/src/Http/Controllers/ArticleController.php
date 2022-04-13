<?php

namespace GGPHP\Crm\Marketing\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Marketing\Http\Requests\CreateArticleRequest;
use GGPHP\Crm\Marketing\Http\Requests\DeleteArticleRequest;
use GGPHP\Crm\Marketing\Http\Requests\PostArticleFacebookRequest;
use GGPHP\Crm\Marketing\Http\Requests\UpdateArticleRequest;
use GGPHP\Crm\Marketing\Repositories\Contracts\ArticleRepository;

class ArticleController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $articleRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(ArticleRepository $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $article = $this->articleRepository->getAll($request->all());

        return $this->success($article, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateArticleRequest $request)
    {
        $credentials = $request->all();

        $article = $this->articleRepository->create($credentials);

        return $this->success($article, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $article = $this->articleRepository->find($id);

        return $this->success($article, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateArticleRequest $request, $id)
    {
        $credentials = $request->all();

        $article = $this->articleRepository->update($credentials, $id);

        return $this->success($article, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, DeleteArticleRequest $request)
    {
        $this->articleRepository->deleteArticle($id, $request->all());

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function postArticleFacebook(PostArticleFacebookRequest $request)
    {
        try {
            $attributes = $request->all();
            $response = $this->articleRepository->postArticleFacebook($attributes);

            return $this->success((array) $response, trans('Đăng bài viết lên facebook thành công'));
        } catch (\Throwable $th) {
            $statusCode = 500;
            
            if ($th instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface) {
                $statusCode = $th->getStatusCode();
            }

            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $statusCode);
        }
    }
}
