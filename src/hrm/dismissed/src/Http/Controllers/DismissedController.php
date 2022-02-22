<?php

namespace GGPHP\Dismissed\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Dismissed\Http\Requests\DismissedCreateRequest;
use GGPHP\Dismissed\Http\Requests\DismissedUpdateRequest;
use GGPHP\Dismissed\Repositories\Contracts\DismissedRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DismissedController extends Controller
{
    /**
     * @var $dismissedRepository
     */
    protected $dismissedRepository;

    /**
     * UserController constructor.
     * @param DismissedRepository $dismissedRepository
     */
    public function __construct(DismissedRepository $dismissedRepository)
    {
        $this->dismissedRepository = $dismissedRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(DismissedCreateRequest $request)
    {
        $dismissed = $this->dismissedRepository->create($request->all());

        return $this->success($dismissed, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $dismissed = $this->dismissedRepository->find($id);

        return $this->success($dismissed, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $dismissed = $this->dismissedRepository->getDismissed($request->all());

        return $this->success($dismissed, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(DismissedUpdateRequest $request, $id)
    {
        $dismissed = $this->dismissedRepository->update($request->all(), $id);

        return $this->success($dismissed, trans('lang::messages.common.modifySuccess'));
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
        $this->dismissedRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function exportWord($id)
    {
        $result = $this->dismissedRepository->exportWord($id);

        if (is_string($result)) {
            return $this->error('Export failed', trans('lang::messages.export.template-not-found'), 400);
        }

        return $result;
    }
}
