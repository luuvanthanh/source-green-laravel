<?php

namespace GGPHP\SurveyForm\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\SurveyForm\Http\Requests\SurveyFormResultCreateRequest;
use GGPHP\SurveyForm\Http\Requests\SurveyFormResultUpdateRequest;
use GGPHP\SurveyForm\Repositories\Contracts\SurveyFormResultRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SurveyFormResultController extends Controller
{
    /**
     * @var $surveyFormResultRepository
     */
    protected $surveyFormResultRepository;

    /**
     * @var $surveyFormResultRepository
     */
    protected $videoWallRepository;

    /**
     * SurveyFormResultController constructor.
     * @param SurveyFormResultRepository $surveyFormResultRepository
     */
    public function __construct(SurveyFormResultRepository $surveyFormResultRepository)
    {
        $this->surveyFormResultRepository = $surveyFormResultRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $surveyFormResults = $this->surveyFormResultRepository->getSurveyFormResult($request->all());

        return $this->success($surveyFormResults, trans('lang::messages.common.getListSuccess'));
    }

    /**
     *
     * @param SurveyFormResultCreateRequest $request
     *
     * @return Response
     */
    public function store(SurveyFormResultCreateRequest $request)
    {
        $credentials = $request->all();
        $surveyFormResult = $this->surveyFormResultRepository->create($credentials);

        return $this->success($surveyFormResult, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function show(Request $request, $id)
    {
        $surveyFormResult = $this->surveyFormResultRepository->find($id);

        return $this->success($surveyFormResult, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     *
     * @param SurveyFormResultUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(SurveyFormResultUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $surveyFormResult = $this->surveyFormResultRepository->update($credentials, $id);

        return $this->success($surveyFormResult, trans('lang::messages.common.modifySuccess'));
    }

    /**
     *
     * @param  int $id
     *
     * @return Response
     */
    public function destroy($id)
    {
        if ($this->surveyFormResultRepository->delete($id)) {
            return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
        }

        return response()->json(null, 422);
    }
}
