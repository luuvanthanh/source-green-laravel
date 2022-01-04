<?php

namespace GGPHP\Report\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Report\Services\ReportService;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * @var $userRepository
     */
    protected $reportRepository;

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function generalReport(Request $request)
    {
        $report = ReportService::generalReport($request->all());

        return $this->success(['data' => $report], trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function numberEventReportBehavior(Request $request)
    {
        $report = ReportService::numberEventReportBehavior($request->all());

        return $this->success(['data' => array_values($report)], trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function numberEventReportObject(Request $request)
    {
        $report = ReportService::numberEventReportObject($request->all());

        return $this->success(['data' => array_values($report)], trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function frequencyOfAppearanceReport(Request $request)
    {
        $report = ReportService::frequencyOfAppearanceReport($request->all());

        return $this->success(['data' => $report], trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function warningReport(Request $request)
    {
        $report = ReportService::warningReport($request->all());

        return $this->success(['data' => $report], trans('lang::messages.common.getListSuccess'));
    }
}
