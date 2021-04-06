<?php

namespace GGPHP\Absent\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Absent\Http\Requests\AbsentCreateRequest;
use GGPHP\Absent\Http\Requests\AbsentUpdateRequest;
use GGPHP\Absent\Models\Absent;
use GGPHP\Absent\Repositories\Absent\AbsentRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AbsentController extends Controller
{
    /**
     * @var $userRepository
     */
    protected $absentRepository;

    /**
     * UserController constructor.
     * @param AbsentRepository $absentRepository
     */
    public function __construct(AbsentRepository $absentRepository)
    {
        $this->absentRepository = $absentRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $absents = $this->absentRepository->filterAbsent($request->all());

        return $this->success($absents, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param AbsentCreateRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(AbsentCreateRequest $request)
    {
        $absent = $this->absentRepository->create($request->all());

        return $this->success($absent, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $absent = $this->absentRepository->find($id);

        return $this->success($absent, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param AbsentUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(AbsentUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $credentials['approval_id'] = Auth::id();
        $absent = $this->absentRepository->update($credentials, $id);

        return $this->success($absent, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->absentRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Get Absent by user
     * @param Request $request
     * @return Response
     */
    public function absentByUser(Request $request)
    {
        $limit = config('constants.SEARCH_VALUES_DEFAULT.LIMIT');

        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        $data = $request->all();
        $data['limit'] = $limit;

        $users = $this->absentRepository->getAbsent($data);

        return $this->success($users, trans('lang::messages.common.getListSuccess'));
    }

}
