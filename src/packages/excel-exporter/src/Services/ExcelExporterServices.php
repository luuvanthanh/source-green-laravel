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
        'timekeeping_report' => [
            'template' => 'timekeeping_report.xlsx',
            'result' => 'timekeeping_report.xlsx',
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
