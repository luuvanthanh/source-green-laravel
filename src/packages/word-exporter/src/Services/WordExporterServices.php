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
    protected $disk, $endPoint, $templateFileUrl, $resultFileUrl;

    public $configs = [
        'labour_contract' => [
            'template' => 'labour_contract.docx',
            'result' => 'labour_contract.docx',
        ],
        'minutes_of_agreements' => [
            'template' => 'minutes_of_agreements.docx',
            'result' => 'minutes_of_agreements.docx',
        ],
        'transfer' => [
            'template' => 'transfer.docx',
            'result' => 'transfer.docx',
        ],
        'decision_reward' => [
            'template' => 'decision_reward.docx',
            'result' => 'decision_reward.docx',
        ],
        'entrance-paper' => [
            'template' => 'entrance-paper.docx',
            'result' => 'entrance-paper.docx',
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
