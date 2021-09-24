<?php

namespace GGPHP\Crm\Category\Http\Controllers;

use GGPHP\Crm\Category\Repositories\Contracts\TagRepository;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Category\Http\Requests\TagCreateOrUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TagController extends Controller
{

    protected $tagRepository;

    public function __construct(TagRepository $tagRepository)
    {
        $this->tagRepository = $tagRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $tag = $this->tagRepository->all();

        return $this->success($tag, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TagCreateOrUpdateRequest $request)
    {
        $credentials = $request->all();

        $tag = $this->tagRepository->create($credentials);

        return $this->success($tag, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

}
