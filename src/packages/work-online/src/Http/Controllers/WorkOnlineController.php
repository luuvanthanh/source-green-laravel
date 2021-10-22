<?php

namespace GGPHP\WorkOnline\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\WorkOnline\Http\Requests\WorkOnlineCreateRequest;
use GGPHP\WorkOnline\Http\Requests\WorkOnlineUpdateRequest;
use GGPHP\WorkOnline\Repositories\Contracts\WorkOnlineRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WorkOnlineController extends Controller
{
    protected $workOnlineRepository;

    /**
     * WorkOnlineController constructor.
     * @param WorkOnlineRepository $WorkOnlineRepository
     */
    public function __construct(WorkOnlineRepository $workOnlineRepository)
    {
        $this->workOnlineRepository = $workOnlineRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $attributes = $request->all();
        $workOnline = $this->workOnlineRepository->index($attributes);

        return $this->success($workOnline, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(WorkOnlineCreateRequest $request)
    {
        $attributes = $request->all();

        $workOnline = $this->workOnlineRepository->create($attributes);

        return $this->success($workOnline, trans('lang::messages.common.createSuccess'));
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
        $workOnline = $this->workOnlineRepository->find($id);

        return $this->success($workOnline, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(WorkOnlineUpdateRequest $request, $id)
    {
        $attributes = $request->all();

        $workOnline = $this->workOnlineRepository->update($attributes, $id);

        return $this->success($workOnline, trans('lang::messages.common.updateSuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->workOnlineRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
