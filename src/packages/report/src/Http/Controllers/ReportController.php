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
}
