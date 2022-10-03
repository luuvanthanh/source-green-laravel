<?php

namespace GGPHP\TeacherTimekeeping\Transformers;

use Carbon\Carbon;
use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\Clover\Transformers\ClassesTransformer;
use GGPHP\Clover\Transformers\ClassProjectSessionTransformer;
use GGPHP\Clover\Transformers\ModuleTransformer;
use GGPHP\Clover\Transformers\ProductTransformer;
use GGPHP\Clover\Transformers\ProjectTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TeacherTimekeeping\Models\TeacherTimekeeping;

/**
 * Class TeacherTimekeepingTransformer.
 *
 * @package namespace App\Transformers;
 */
class TeacherTimekeepingTransformer extends BaseTransformer
{
    protected $availableIncludes = ['branch', 'classes', 'classProjectSession', 'product', 'module', 'project'];
    protected $defaultIncludes = [];

    /**
     * Transform the Timekeeping entity.
     *
     * @param TeacherTimekeeping $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
            'Status' => array_search($model->Status, TeacherTimekeeping::STATUS),
            'Type' => array_search($model->Type, TeacherTimekeeping::TYPE),
            'time' => Carbon::parse($model->StartTime)->diffInMinutes(Carbon::parse($model->EndTime))
        ];
    }

    public function includeBranch(TeacherTimekeeping $teacherTimekeeping)
    {
        if (is_null($teacherTimekeeping->branch)) {
            return null;
        }

        return $this->item($teacherTimekeeping->branch, new BranchTransformer, 'Branch');
    }

    public function includeClasses(TeacherTimekeeping $teacherTimekeeping)
    {
        if (is_null($teacherTimekeeping->classes)) {
            return null;
        }

        return $this->item($teacherTimekeeping->classes, new ClassesTransformer, 'Classes');
    }

    public function includeClassProjectSession(TeacherTimekeeping $teacherTimekeeping)
    {
        if (is_null($teacherTimekeeping->classProjectSession)) {
            return null;
        }

        return $this->item($teacherTimekeeping->classProjectSession, new ClassProjectSessionTransformer, 'ClassProjectSession');
    }

    public function includeProduct(TeacherTimekeeping $teacherTimekeeping)
    {
        if (is_null($teacherTimekeeping->product)) {
            return null;
        }

        return $this->item($teacherTimekeeping->product, new ProductTransformer, 'Product');
    }

    public function includeModule(TeacherTimekeeping $teacherTimekeeping)
    {
        if (is_null($teacherTimekeeping->module)) {
            return null;
        }

        return $this->item($teacherTimekeeping->module, new ModuleTransformer, 'Module');
    }

    public function includeProject(TeacherTimekeeping $teacherTimekeeping)
    {
        if (is_null($teacherTimekeeping->project)) {
            return null;
        }

        return $this->item($teacherTimekeeping->project, new ProjectTransformer, 'Project');
    }
}
