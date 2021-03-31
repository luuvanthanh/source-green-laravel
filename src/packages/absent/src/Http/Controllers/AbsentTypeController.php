<?php

namespace GGPHP\Absent\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Absent\Http\Requests\AbsentTypeCreateRequest;
use GGPHP\Absent\Http\Requests\AbsentTypeUpdateRequest;
use GGPHP\Absent\Repositories\Absent\AbsentTypeRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AbsentTypeController extends Controller
{
    /**
     * @var $userRepository
     */
    protected $absentTypeRepository;

    /**
     * UserController constructor.
     * @param AbsentTypeRepository $absentTypeRepository
     */
    public function __construct(AbsentTypeRepository $absentTypeRepository)
    {
        $this->absentTypeRepository = $absentTypeRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = config('constants-absent.SEARCH_VALUES_DEFAULT.LIMIT');
        if ($request->has('limit')) {
            $limit = $request->limit;
        }
        if ($limit == config('constants-absent.SEARCH_VALUES_DEFAULT.LIMIT_ZERO')) {
            $absentTypes = $this->absentTypeRepository->all();
        } else {
            $absentTypes = $this->absentTypeRepository->paginate($limit);
        }

        return $this->success($absentTypes, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param AbsentTypeCreateRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(AbsentTypeCreateRequest $request)
    {
        $credentials = $request->all();
        $absentType = $this->absentTypeRepository->create($credentials);
        return $this->success($absentType, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $absentType = $this->absentTypeRepository->find($id);
        return $this->success($absentType, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param AbsentTypeUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(AbsentTypeUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $absentType = $this->absentTypeRepository->update($credentials, $id);
        return $this->success($absentType, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->absentTypeRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
