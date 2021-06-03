<?php

namespace GGPHP\ExcelExporter\Services;

use alhimik1986\PhpExcelTemplator\PhpExcelTemplator;
use Illuminate\Support\Facades\Storage;

/**
 * Class Processor.
 */
class ExcelExporterServices
{
    public $configs = [
        'fault' => [
            'template' => 'fault.xlsx',
        ],
        'faultsSummary' => [
            'template' => 'faults_summary.xlsx',
        ],
        'suggest' => [
            'template' => 'suggest.xlsx',
            'result' => 'suggest.xlsx',
        ],
        'timekeepingReport' => [
            'template' => 'timekeeping_report.xlsx',
            'result' => 'timekeeping_report.xlsx',
        ],
        'timekeepingReportByHour' => [
            'template' => 'timekeeping_report_by_hour.xlsx',
            'result' => 'timekeeping_report_by_hour.xlsx',
        ],
        'timekeepingReportByMonth' => [
            'template' => 'timekeeping_report_by_month.xlsx',
            'result' => 'timekeeping_report_by_month.xlsx',
        ],
        'suggest-overtime' => [
            'template' => 'suggest_overtime.xlsx',
            'result' => 'suggest_overtime.xlsx',
        ],
        'suggest-recruitment' => [
            'template' => 'suggest_recruitment.xlsx',
            'result' => 'suggest_recruitment.xlsx',
        ],
        'suggest-salary-increase' => [
            'template' => 'suggest_salary_increase.xlsx',
            'result' => 'suggest_salary_increase.xlsx',
        ],
        'suggest-print-name-board' => [
            'template' => 'suggest_print_name_board.xlsx',
            'result' => 'suggest_print_name_board.xlsx',
        ],
        'suggest-sewing-uniforms' => [
            'template' => 'suggest_sewing_uniforms.xlsx',
            'result' => 'suggest_sewing_uniforms.xlsx',
        ],
        'suggest-carrying-food' => [
            'template' => 'suggest_carrying_food.xlsx',
            'result' => 'suggest_carrying_food.xlsx',
        ],
        'late-early' => [
            'template' => 'late_early.xlsx',
            'result' => 'late_early.xlsx',
        ],
        'review-productivity' => [
            'template' => 'review_productivity.xlsx',
            'result' => 'review_productivity.xlsx',
        ],
        'review-month' => [
            'template' => 'review_month.xlsx',
            'result' => 'review_month.xlsx',
        ],
        'children' => [
            'template' => 'children.xlsx',
            'result' => 'children.xlsx',
        ],
        'absents' => [
            'template' => 'absents.xlsx',
            'result' => 'absents.xlsx',
        ],
        'absents-by-user-month' => [
            'template' => 'absents-by-user-month.xlsx',
            'result' => 'absents-by-user-month.xlsx',
        ],
        'absents-by-user-year' => [
            'template' => 'absents-by-user-year.xlsx',
            'result' => 'absents-by-user-year.xlsx',
        ],
        'additional-time' => [
            'template' => 'additional-time.xlsx',
            'result' => 'additional-time.xlsx',
        ],
        'subtraction-time' => [
            'template' => 'subtraction-time.xlsx',
            'result' => 'subtraction-time.xlsx',
        ],
        'rewards' => [
            'template' => 'rewards.xlsx',
            'result' => 'rewards.xlsx',
        ],
        'insurrances' => [
            'template' => 'insurrances.xlsx',
            'result' => 'insurrances.xlsx',
        ],
        'absent_awol' => [
            'template' => 'absent_awol.xlsx',
            'result' => 'absent_awol.xlsx',
        ],
        'timekeeping_history' => [
            'template' => 'timekeeping_history.xlsx',
            'result' => 'timekeeping_history.xlsx',
        ],
        'timekeeping_history2' => [
            'template' => 'timekeeping_history2.xlsx',
            'result' => 'timekeeping_history2.xlsx',
        ],
    ];

    protected $disk, $endPoint, $templateFileUrl, $resultFileUrl;

    public function __construct()
    {
        $this->disk = config('excel-exporter.disk');
        $this->endPoint = config('excel-exporter.' . $this->disk . '.endPoint');
        $this->templateFolder = config('excel-exporter.' . $this->disk . '.templates');
        $this->resultFolder = config('excel-exporter.' . $this->disk . '.results');
    }

    /**
     * Export
     * @param string $type
     * @param array $params
     *
     * @return path
     */
    public function export($type, $params)
    {
        $templateFile = $this->configs[$type]['template'];
        $resultFile = $this->configs[$type]['result'] ?? $templateFile;

        $templateFileUrl = $this->endPoint . '/' . $this->templateFolder . '/' . $templateFile;
        $resultFileUrl = $this->endPoint . '/' . $this->resultFolder . '/' . $resultFile;

        if (!file_exists($templateFileUrl)) {
            return config('excel-exporter.error.template-not-found');
        }
        if ($this->disk == 'local') {
            $this->makedir($this->endPoint . '/' . $this->resultFolder);
        }

        PhpExcelTemplator::saveToFile($templateFileUrl, $resultFileUrl, $params);

        return Storage::disk($this->disk)->download($this->resultFolder . '/' . $resultFile);
    }

    public function makedir($path)
    {
        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }
    }

    /**
     * Export
     * @param Request $request
     *
     * @return path
     */
    public function uploadTemplate($request)
    {
        $templates = is_array($request->file('template')) ? $request->file('template') : [$request->file('template')];
        foreach ((array) $templates as $file) {
            $path[] = $file->storeAs($this->templateFolder, $file->getClientOriginalName(), $this->disk);
        }

        return $path;
    }

    public function getPlaceText($place)
    {
        switch ($place->name) {
            case 'PENDING':
                $text = 'Chờ xử lý';
                break;

            case 'DECLINE':
                $text = 'Từ chối';
                break;

            case 'APPROVED':
                $text = $place->meta_data['is_end_place'] ? 'Đã duyệt' : 'Chờ xử lý';
                break;

            default:
                $text = '';
                break;
        }

        return $text;
    }
}
