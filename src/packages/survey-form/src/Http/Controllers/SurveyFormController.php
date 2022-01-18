<?php

namespace GGPHP\SurveyForm\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use GGPHP\SurveyForm\Http\Requests\SurveyFormCreateRequest;
use GGPHP\SurveyForm\Http\Requests\SurveyFormUpdateRequest;
use GGPHP\SurveyForm\Repositories\Contracts\SurveyFormRepository;
use Illuminate\Http\Request;

class SurveyFormController extends Controller
{
    /**
     * @var $surveyFormRepository
     */
    protected $surveyFormRepository;

    /**
     * @var $surveyFormRepository
     */
    protected $videoWallRepository;

    /**
     * SurveyFormController constructor.
     * @param SurveyFormRepository $surveyFormRepository
     */
    public function __construct(SurveyFormRepository $surveyFormRepository)
    {
        $this->surveyFormRepository = $surveyFormRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function getSurveyFormBySlug($slug)
    {
        $surveyForms = $this->surveyFormRepository->getSurveyFormBySlug($slug);

        return $this->success($surveyForms, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $surveyForms = $this->surveyFormRepository->getSurveyForm($request->all());

        return $this->success($surveyForms, trans('lang::messages.common.getListSuccess'));
    }

    /**
     *
     * @param SurveyFormCreateRequest $request
     *
     * @return Response
     */
    public function store(SurveyFormCreateRequest $request)
    {
        $credentials = $request->all();
        $surveyForm = $this->surveyFormRepository->create($credentials);

        return $this->success($surveyForm, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function show(Request $request, $id)
    {
        $surveyForm = $this->surveyFormRepository->find($id);

        return $this->success($surveyForm, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     *
     * @param SurveyFormUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(SurveyFormUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $surveyForm = $this->surveyFormRepository->update($credentials, $id);

        return $this->success($surveyForm, trans('lang::messages.common.modifySuccess'));
    }

    /**
     *
     * @param  int $id
     *
     * @return Response
     */
    public function destroy($id)
    {
        if ($this->surveyFormRepository->delete($id)) {
            return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
        }

        return response()->json(null, 422);
    }

    public function summaryResultSurvey($id)
    {
        $surveyForm = $this->surveyFormRepository->summaryResultSurvey($id);

        return $this->success($surveyForm, trans('lang::messages.common.getInfoSuccess'));
    }
}
