<?php

namespace GGPHP\AddSubTime\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\AddSubTime\Http\Requests\AddSubTimeCreateRequest;
use GGPHP\AddSubTime\Repositories\Contracts\AddSubTimeRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AddSubTimeController extends Controller
{
    /**
     * @var $addSubTimeRepository
     */
    protected $addSubTimeRepository;

    /**
     * UserController constructor.
     * @param addSubTimeRepository $addSubTimeRepository
     */
    public function __construct(AddSubTimeRepository $addSubTimeRepository)
    {
        $this->addSubTimeRepository = $addSubTimeRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $addSubTimes = $this->addSubTimeRepository->filterAdditionalByMonth($request->all());

        return $this->success($addSubTimes, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function generalAddSubTime(Request $request)
    {
        $addSubTimes = $this->addSubTimeRepository->generalAddSubTime($request->all());

        return $this->success($addSubTimes, trans('lang::messages.common.getListSuccess'));
    }

    /**
     *
     * @param AddSubTimeCreateRequest $request
     *
     * @return Response
     */
    public function store(AddSubTimeCreateRequest $request)
    {
        $addSubTimes = $this->addSubTimeRepository->createAddSubTime($request->all());

        return $this->success($addSubTimes, trans('lang::messages.common.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function show(Request $request, $id)
    {
        $addSubTimes = $this->addSubTimeRepository->find($id);

        return $this->success($addSubTimes, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     *
     * @param Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(Request $request, $id)
    {
        $addSubTimes = $this->addSubTimeRepository->update($request->all(), $id);

        return $this->success($addSubTimes, trans('lang::messages.common.modifySuccess'));
    }

    /**
     *
     * @param  int $id
     *
     * @return Response
     */
    public function destroy($id)
    {
        $this->addSubTimeRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
