<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\TrainingSchoolCreateRequest;
use GGPHP\Category\Http\Requests\TrainingSchoolUpdateRequest;
use GGPHP\Category\Repositories\Contracts\TrainingSchoolRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TrainingSchoolController extends Controller
{
    /**
     * @var $userRepository
     */
    protected $trainingSchoolRepository;

    /**
     * UserController constructor.
     * @param TrainingSchoolRepository $trainingSchoolRepository
     */
    public function __construct(TrainingSchoolRepository $trainingSchoolRepository)
    {
        $this->trainingSchoolRepository = $trainingSchoolRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = config('constants.SEARCH_VALUES_DEFAULT.LIMIT');
        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        if ($limit == config('constants.SEARCH_VALUES_DEFAULT.LIMIT_ZERO')) {
            $trainingSchools = $this->trainingSchoolRepository->all();
        } else {
            $trainingSchools = $this->trainingSchoolRepository->paginate($limit);
        }

        return $this->success($trainingSchools, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(TrainingSchoolCreateRequest $request)
    {
        $credentials = $request->all();
        $trainingSchool = $this->trainingSchoolRepository->create($credentials);
        return $this->success($trainingSchool, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $trainingSchool = $this->trainingSchoolRepository->find($id);
        return $this->success($trainingSchool, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param TrainingSchoolUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(TrainingSchoolUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $trainingSchool = $this->trainingSchoolRepository->update($credentials, $id);
        return $this->success($trainingSchool, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->trainingSchoolRepository->delete($id);
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
        $trainingSchool = $this->trainingSchoolRepository->loadCategory($credentials);

        return $this->success($trainingSchool, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
