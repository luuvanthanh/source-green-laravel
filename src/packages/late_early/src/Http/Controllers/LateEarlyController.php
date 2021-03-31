<?php

namespace GGPHP\LateEarly\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\LateEarly\Http\Requests\LateEarlyConfigCreateRequest;
use GGPHP\LateEarly\Http\Requests\LateEarlyUpdateRequest;
use GGPHP\LateEarly\Repositories\LateEarly\LateEarlyRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class LateEarlyController extends Controller
{
    /**
     * @var $userRepository
     */
    protected $lateEarlyRepository;

    /**
     * UserController constructor.
     * @param LateEarlyRepository $lateEarlyRepository
     */
    public function __construct(LateEarlyRepository $lateEarlyRepository)
    {
        $this->lateEarlyRepository = $lateEarlyRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $limit = config('constants-LateEarly.SEARCH_VALUES_DEFAULT.LIMIT');
        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        $data = $request->all();
        $data['limit'] = $limit;
        $lateEarlies = $this->lateEarlyRepository->filterLateEarly($data);

        return $this->success($lateEarlies, trans('lang-lateEarly::messages.common.getListSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $lateEarly = $this->lateEarlyRepository->find($id);
        return $this->success($lateEarly, trans('lang-lateEarly::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param LateEarlyConfigCreateRequest $request
     * @return Response
     */
    public function update(LateEarlyUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $credentials['approval_id'] = Auth::id();
        $lateEarly = $this->lateEarlyRepository->update($credentials, $id);
        return $this->success($lateEarly, trans('lang-lateEarly::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    public function lateEarlyByUser(Request $request)
    {
        $limit = config('constants.SEARCH_VALUES_DEFAULT.LIMIT');
        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        $data = $request->all();
        $data['limit'] = $limit;

        $lateEarlies = $this->lateEarlyRepository->getLateEarlyByUser($data);
        return $this->success($lateEarlies, trans('lang-lateEarly::messages.common.getListSuccess'));
    }

    /**
     * @param Request $request
     * @return file
     */
    public function export(Request $request)
    {
        $result = $this->lateEarlyRepository->export($request);

        if (is_string($result)) {
            return $this->error('Export failed', trans('Template not found'), 400);
        }

        return $result;
    }

    /**
     *
     * @param Request $request
     *
     * @return Response
     */
    public function store(Request $request)
    {
        $result = $this->lateEarlyRepository->create($request->all());

        return $this->success($result, trans('lang-lateEarly::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     *
     * @param Request $request
     *
     * @return Response
     */
    public function getLateEarlyReport(Request $request)
    {
        $this->lateEarlyRepository->lateEarlyReportNew($request->all());
        return $this->success([], trans('lang-lateEarly::messages.common.createSuccess'));
    }

    /**
     *
     * @param Request $request
     *
     * @return Response
     */
    public function invalidTimekeeping(Request $request)
    {
        $invalid = $this->lateEarlyRepository->invalidTimekeeping($request->all());
        return $this->success($invalid, trans('lang-lateEarly::messages.common.getInfoSuccess'));
    }
}
