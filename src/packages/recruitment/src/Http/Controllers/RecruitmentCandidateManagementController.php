<?php

namespace GGPHP\Recruitment\Http\Controllers;

use GGPHP\Recruitment\Http\Requests\RecruitmentLevelCreateRequest;
use GGPHP\Recruitment\Repositories\Contracts\RecruitmentLevelRepository;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Recruitment\Http\Requests\RecruitmentManagerCreateRequest;
use GGPHP\Recruitment\Repositories\Contracts\RecruitmentCandidateManagementRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RecruitmentCandidateManagementController extends Controller
{
    /**
     * @var $recruitmentLevelRepository
     */
    protected $recruitmentMRepository;

    /**
     * RecruitmentLevelController constructor.
     * @param RecruitmentLevelRepository $recruitmentLevelRepository
     */
    public function __construct(RecruitmentCandidateManagementRepository $recruitmentMRepository)
    {
        $this->recruitmentMRepository = $recruitmentMRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $recruitmentManager = $this->recruitmentMRepository->getCandidate($request->all());

        return $this->success($recruitmentManager, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param RecruitmentLevelCreateRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(RecruitmentManagerCreateRequest $request)
    {
        $credentials = $request->all();
        $level = $this->recruitmentMRepository->create($credentials);
        return $this->success($level, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $level = $this->recruitmentMRepository->find($id);
        return $this->success($level, trans('lang::messages.common.getInfoSuccess'));
    }

    // /**
    //  * Update the specified resource in storage.
    //  *
    //  * @param RecruitmentLevelUpdateRequest $request
    //  * @param $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function update(RecruitmentManagerUpdateRequest $request, $id)
    // {
    //     $credentials = $request->all();
    //     $block = $this->recruitmentMRepository->update($credentials, $id);
    //     return $this->success($block, trans('lang::messages.common.modifySuccess'));
    // }

    // /**
    //  * Remove the specified resource from storage.
    //  *
    //  * @param $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function destroy(RecruitmentManagerDeleteRequest $request, $id)
    // {
    //     $this->recruitmentMRepository->delete($id);
    //     return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    // }

    //  /**
    //  * Display a listing of the resource.
    //  *
    //  * @param Request $request
    //  * @return \Illuminate\Http\Response
    //  */
    // public function getLink(Request $request)
    // {
    //     $recruitmentManager = $this->recruitmentMRepository->getLink($request->all());

    //     return $this->success($recruitmentManager, trans('lang::messages.common.getListSuccess'));
    // }
}
