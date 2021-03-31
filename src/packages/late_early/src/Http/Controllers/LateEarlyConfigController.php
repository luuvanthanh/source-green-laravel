<?php

namespace GGPHP\LateEarly\Http\Controllers;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use GGPHP\LateEarly\Http\Requests\LateEarlyConfigCreateRequest;
use GGPHP\LateEarly\Repositories\LateEarly\LateEarlyConfigRepository;
use GGPHP\LateEarly\Repositories\LateEarly\LateEarlyRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LateEarlyConfigController extends Controller
{
    /**
     * @var $userRepository
     */
    protected $lateEarlyConfigRepository;

    /**
     * UserController constructor.
     * @param LateEarlyConfigRepository $lateEarlyConfigRepository
     */
    public function __construct(LateEarlyConfigRepository $lateEarlyConfigRepository){
      $this->lateEarlyConfigRepository = $lateEarlyConfigRepository;
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

        if ($limit == config('constants-LateEarly.SEARCH_VALUES_DEFAULT.LIMIT_ZERO')) {
            $LateEarlys = $this->lateEarlyConfigRepository->all();
        } else {
            $LateEarlys = $this->lateEarlyConfigRepository->paginate($limit);
        }

        return $this->success($LateEarlys, trans('lang-lateEarly::messages.common.getListSuccess'));
    }
  
    /**
     * Store a newly created resource in storage.
     *
     * @param LateEarlyConfigCreateRequest $request
     * @return Response
     */
    public function store(LateEarlyConfigCreateRequest $request)
    {
        $credentials = $request->all();
        $lateEarly = $this->lateEarlyConfigRepository->createOrUpdateLateEarlyConfig($credentials);
        return $this->success($lateEarly, trans('lang-lateEarly::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
