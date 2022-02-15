<?php

namespace GGPHP\WordExporter\Services;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\TemplateProcessor;

/**
 * Class Processor.
 */
class WordExporterServices
{
    protected $disk;
    protected $endPoint;
    protected $templateFileUrl;
    protected $resultFileUrl;

    public $configs = [
        'labour_contract' => [
            'template' => 'labour_contract.docx',
            'result' => 'labour_contract.docx',
        ],
        'probationary_contract' => [
            'template' => 'probationary_contract.docx',
            'result' => 'probationary_contract.docx',
        ],
        'transfer' => [
            'template' => 'transfer.docx',
            'result' => 'transfer.docx',
        ],
        'dismissed' => [
            'template' => 'dismissed.docx',
            'result' => 'dismissed.docx',
        ],
        'appoint' => [
            'template' => 'appoint.docx',
            'result' => 'appoint.docx',
        ],
        'decision_reward' => [
            'template' => 'decision_reward.docx',
            'result' => 'decision_reward.docx',
        ],
        'salary_increase' => [
            'template' => 'salary_increase.docx',
            'result' => 'salary_increase.docx',
        ],
        'resignation_decision' => [
            'template' => 'resignation_decision.docx',
            'result' => 'resignation_decision.docx',
        ],
        'decision_suspend' => [
            'template' => 'decision_suspend.docx',
            'result' => 'decision_suspend.docx',
        ],
    ];

    public function __construct()
    {
        $this->disk = config('word-exporter.disk');
        $this->endPoint = config('word-exporter.' . $this->disk . '.endPoint');
        $this->templateFolder = config('word-exporter.' . $this->disk . '.templates');
        $this->resultFolder = config('word-exporter.' . $this->disk . '.results');
    }

    public function exportWord($teamplate, $param)
    {
        $templateFile = $this->configs[$teamplate]['template'];
        $resultFile = $this->configs[$teamplate]['result'] ?? $templateFile;

        $templateFileUrl = $this->endPoint . '/' . $this->templateFolder . '/' . $templateFile;
        $resultFileUrl = $this->endPoint . '/' . $this->resultFolder . '/' . $resultFile;

        if (!file_exists($templateFileUrl)) {
            return config('excel-exporter.error.template-not-found');
        }

        if ($this->disk == 'local') {
            $this->makedir($this->endPoint . '/' . $this->resultFolder);
        }
        //Khởi tạo đối tượng phpWord
        $templateProcessor = new TemplateProcessor($templateFileUrl);
        foreach ($param as $key => $value) {
            $param[$key] = htmlspecialchars($value);
        }

        $templateProcessor->setValues($param);

        $templateProcessor->saveAs($resultFileUrl);

        return Storage::disk($this->disk)->download($this->resultFolder . '/' . $resultFile);
    }

    public function exportWordTransfer($teamplate, $param)
    {
        $templateFile = $this->configs[$teamplate]['template'];
        $resultFile = $this->configs[$teamplate]['result'] ?? $templateFile;

        $templateFileUrl = $this->endPoint . '/' . $this->templateFolder . '/' . $templateFile;
        $resultFileUrl = $this->endPoint . '/' . $this->resultFolder . '/' . $resultFile;

        if (!file_exists($templateFileUrl)) {
            return config('excel-exporter.error.template-not-found');
        }

        if ($this->disk == 'local') {
            $this->makedir($this->endPoint . '/' . $this->resultFolder);
        }
        //Khởi tạo đối tượng phpWord
        $templateProcessor = new TemplateProcessor($templateFileUrl);

        $templateProcessor->setValues(Arr::except($param, ['user']));

        $dataUser = Arr::only($param, ['user']);

        $templateProcessor->cloneRowAndSetValues('number', $dataUser['user']);

        $templateProcessor->saveAs($resultFileUrl);

        return Storage::disk($this->disk)->download($this->resultFolder . '/' . $resultFile);
    }

    public function makedir($path)
    {
        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }
    }
}
