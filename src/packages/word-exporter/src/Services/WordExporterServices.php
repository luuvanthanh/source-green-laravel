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
        'list_confirm_transporter' => [
            'template' => 'list_confirm_transporter.docx',
            'result' => 'list_confirm_transporter.docx',
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

    public function multipleExportWord($teamplate, $param)
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
        
        $templateProcessor->setValues(Arr::except($param, ['detail']));
        
        $dataUser = Arr::only($param, ['detail']);
      
        $templateProcessor->cloneRowAndSetValues('number', $dataUser['detail']);
        
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
