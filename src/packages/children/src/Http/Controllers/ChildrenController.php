<?php

namespace GGPHP\Children\Http\Controllers;

use GGPHP\Children\Http\Requests\ChildrenCreateRequest;
use GGPHP\Children\Http\Requests\ChildrenUpdateRequest;
use GGPHP\Children\Repositories\Contracts\ChildrenRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ChildrenController extends Controller
{
    protected $childrenRepository;

    /**
     * ChildrenController constructor.
     * @param ChildrenRepository $childrenRepository
     */
    public function __construct(ChildrenRepository $childrenRepository)
    {
        $this->childrenRepository = $childrenRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(ChildrenCreateRequest $request)
    {
        $children = $this->childrenRepository->createMany($request->all());

        return $this->success($children, trans('lang-program::messages.children.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $child = $this->childrenRepository->find($id);

        return $this->success($child, trans('lang-program::messages.children.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $children = $this->childrenRepository->index($request);

        return $this->success($children, trans('lang-program::messages.children.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(ChildrenUpdateRequest $request, $id)
    {
        $child = $this->childrenRepository->update($request->all(), $id);

        return $this->success($child, trans('lang-program::messages.children.updateSuccess'), ['isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $this->childrenRepository->delete($id);

        return $this->success([], '', ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    /**
     * @param Request $request
     *
     * @return Response
     */
    public function export(Request $request)
    {
        \DB::enableQueryLog();
        $result = $this->childrenRepository->export($request);

        if (is_string($result)) {
            return $this->error('Export failed', trans('lang-program::messages.children.export.template-not-found'), 400);
        }

        return $result;
    }
}
