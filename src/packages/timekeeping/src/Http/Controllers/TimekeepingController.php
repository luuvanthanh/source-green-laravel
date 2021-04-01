<?php

namespace GGPHP\Timekeeping\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Timekeeping\Http\Requests\CreatTimekeepingRequest;
use GGPHP\Timekeeping\Http\Requests\UpdateTimekeepingRequest;
use GGPHP\Timekeeping\Repositories\Contracts\TimekeepingRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TimekeepingController extends Controller
{
    /**
     * @var $userRepository
     */
    protected $timekeepingRepository;

    /**
     * UserController constructor.
     * @param TimekeepingRepository $timekeepingRepository
     */
    public function __construct(TimekeepingRepository $timekeepingRepository)
    {
        $this->timekeepingRepository = $timekeepingRepository;
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

        $users = $this->timekeepingRepository->filterTimekeeping($request->all());
        return $this->success($users, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatTimekeepingRequest $request)
    {
        $timekeepings = $this->timekeepingRepository->create($request->all());
        return $this->success($timekeepings, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Timekeeping  $timekeeping
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $timekeeping = $this->timekeepingRepository->find($id);

        if ($timekeeping) {
            return $this->success($timekeeping, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Timekeeping  $timekeeping
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateTimekeepingRequest $request, $id)
    {
        $credentials = $request->all();
        $timekeeping = $this->timekeepingRepository->update($credentials, $id);

        return $this->success($timekeeping, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Timekeeping  $timekeeping
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->timekeepingRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
