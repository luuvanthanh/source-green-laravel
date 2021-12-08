<?php

namespace GGPHP\ActivityLog\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\ActivityLog\Repositories\Contracts\ActivityLogRepository;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /**
     * @var $userRepository
     */
    protected $activityLogRepository;

    /**
     * UserController constructor.
     * @param ActivityLogRepository $activityLogRepository
     */
    public function __construct(ActivityLogRepository $activityLogRepository)
    {
        $this->activityLogRepository = $activityLogRepository;
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = config('constants-activity.SEARCH_VALUES_DEFAULT.LIMIT');
        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        $data = $request->all();
        $data['limit'] = $limit;

        $activities = $this->activityLogRepository->filterAcitivity($data);

        return $this->success($activities, trans('lang-activity::messages.activity.getListSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $reviewMonth = $this->activityLogRepository->find($id);
        return $this->success($reviewMonth, trans('lang-review::messages.activity.getInfoSuccess'));
    }

    public function exportExcel(Request $request)
    {
        $result = $this->activityLogRepository->exportExcel($request->all());

        if (is_string($result)) {
            return $this->error('Export failed', trans('Template not found'), 400);
        }

        return $result;
    }
}
