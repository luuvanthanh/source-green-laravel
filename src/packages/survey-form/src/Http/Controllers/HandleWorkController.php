<?php

namespace GGPHP\SurveyForm\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\SurveyForm\Http\Requests\HandleWorkCreateRequest;
use GGPHP\SurveyForm\Http\Requests\HandleWorkUpdateRequest;
use GGPHP\SurveyForm\Repositories\Contracts\HandleWorkRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HandleWorkController extends Controller
{
    /**
     * @var $handleWorkRepository
     */
    protected $handleWorkRepository;

    /**
     * HandleWorkController constructor.
     * @param HandleWorkRepository $handleWorkRepository
     */
    public function __construct(HandleWorkRepository $handleWorkRepository)
    {
        $this->handleWorkRepository = $handleWorkRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $handleWorks = $this->handleWorkRepository->getHandleWork($request->all());

        return $this->success($handleWorks, trans('lang::messages.common.getListSuccess'));
    }

    /**
     *
     * @param HandleWorkCreateRequest $request
     *
     * @return Response
     */
    public function store(HandleWorkCreateRequest $request)
    {
        $credentials = $request->all();
        $handleWork = $this->handleWorkRepository->create($credentials);

        return $this->success($handleWork, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function show(Request $request, $id)
    {
        $handleWork = $this->handleWorkRepository->find($id);

        return $this->success($handleWork, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     *
     * @param HandleWorkUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(HandleWorkUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $handleWork = $this->handleWorkRepository->update($credentials, $id);

        return $this->success($handleWork, trans('lang::messages.common.modifySuccess'));
    }

    /**
     *
     * @param  int $id
     *
     * @return Response
     */
    public function destroy($id)
    {
        if ($this->handleWorkRepository->delete($id)) {
            return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
        }

        return response()->json(null, 422);
    }
}
