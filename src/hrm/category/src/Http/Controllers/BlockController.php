<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\BlockCreateRequest;
use GGPHP\Category\Http\Requests\BlockDeleteRequest;
use GGPHP\Category\Http\Requests\BlockUpdateRequest;
use GGPHP\Category\Repositories\Contracts\BlockRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BlockController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $blockRepository;

    /**
     * UserController constructor.
     * @param BlockRepository $blockRepository
     */
    public function __construct(BlockRepository $blockRepository)
    {
        $this->blockRepository = $blockRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $blocks = $this->blockRepository->getBlock($request->all());

        return $this->success($blocks, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(BlockCreateRequest $request)
    {
        $credentials = $request->all();
        $block = $this->blockRepository->create($credentials);
        return $this->success($block, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $block = $this->blockRepository->find($id);
        return $this->success($block, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param BlockUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(BlockUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $block = $this->blockRepository->update($credentials, $id);
        return $this->success($block, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(BlockDeleteRequest $request, $id)
    {
        $this->blockRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function loadCategory(Request $request)
    {
        $credentials = $request->all();
        $block = $this->blockRepository->loadCategory($credentials);

        return $this->success($block, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
