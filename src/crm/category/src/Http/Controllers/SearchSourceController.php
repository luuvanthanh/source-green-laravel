<?php

namespace GGPHP\Crm\Category\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Category\Http\Requests\CreateSearchSourceRequest;
use GGPHP\Crm\Category\Http\Requests\UpdateSearchSourceRequest;
use GGPHP\Crm\Category\Repositories\Contracts\SearchSourceRepository;

class SearchSourceController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $searchSourceRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(SearchSourceRepository $searchSourceRepository)
    {
        $this->searchSourceRepository = $searchSourceRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $searchSource = $this->searchSourceRepository->getAll($request->all());

        return $this->success($searchSource, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateSearchSourceRequest $request)
    {
        try {
            $credentials = $request->all();

            $searchSource = $this->searchSourceRepository->create($credentials);

            return $this->success($searchSource, trans('lang::messages.common.createSuccess'));
        } catch (\Throwable $th) {

            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $searchSource = $this->searchSourceRepository->find($id);

        return $this->success($searchSource, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateSearchSourceRequest $request, $id)
    {
        $credentials = $request->all();

        $searchSource = $this->searchSourceRepository->update($credentials, $id);

        return $this->success($searchSource, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $this->searchSourceRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
