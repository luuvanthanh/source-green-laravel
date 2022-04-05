<?php

namespace GGPHP\SurveyForm\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\SurveyForm\Models\SurveyForm;
use GGPHP\SurveyForm\Presenters\SurveyFormPresenter;
use GGPHP\SurveyForm\Repositories\Contracts\SurveyFormRepository;
use Illuminate\Support\Facades\Storage;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class SurveyFormRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SurveyFormRepositoryEloquent extends BaseRepository implements SurveyFormRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return SurveyForm::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return SurveyFormPresenter::class;
    }

    public function getSurveyForm(array $attributes, $parse = true)
    {
        if (!empty($attributes['tourist_destination_id'])) {
            $touristDestinationId = explode(',', $attributes['tourist_destination_id']);
            $this->model = $this->model->where('tourist_destination_id', $touristDestinationId);
        }

        if (!empty($attributes['name'])) {
            $this->model = $this->model->whereLike('name', $attributes['name']);
        }

        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key']);
        }

        if (!empty($attributes['count_question']) && $attributes['count_question'] == 'true') {
            $this->model = $this->model->withCount('event');
            if (!empty($attributes['number_count_question']) && !empty($attributes['condition_count_question'])) {
                $this->model = $this->model->has('event', $attributes['condition_count_question'], $attributes['number_count_question']);
            }
        }

        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->where(function ($q2) use ($attributes) {
                $q2->where([['start_date', '<=', $attributes['start_date']], ['end_date', '>=', $attributes['end_date']]])
                    ->orWhere([['start_date', '>=', $attributes['start_date']], ['start_date', '<=', $attributes['end_date']]])
                    ->orWhere([['end_date', '>=', $attributes['start_date']], ['end_date', '<=', $attributes['end_date']]]);
            });
        }

        if (!$parse) {
            return $this->model->get();
        }

        if (empty($attributes['limit'])) {
            $result = $this->all();
        } else {
            $result = $this->paginate($attributes['limit']);
        }

        return $result;
    }

    public function getSurveyFormBySlug($slug)
    {
        $surveyForm = SurveyForm::where('slug', $slug)->firstOrFail();

        return parent::parserResult($surveyForm);
    }

    public function create($attributes)
    {
        $surveyForm = $this->model()::create($attributes);

        $url = env('WEB_APP_URL') . '/khao-sat' . '/' . $surveyForm->slug;

        $image = \QrCode::format('svg')
            ->size(200)->errorCorrection('H')
            ->generate($url);
        $output_file = '/qr-code/img-' . time() . '.svg';

        Storage::disk('public')->put($output_file, $image);

        $surveyForm->update([
            'qr_code_url' => env('APP_URL') . '/storage' . '/' . $output_file
        ]);

        return parent::find($surveyForm->id);
    }

    public function update($attributes, $id)
    {
        $surveyForm = $this->model()::findOrFail($id);

        $surveyForm->update($attributes);

        $url = env('WEB_APP_URL') . '/khao-sat' . '/' . $surveyForm->slug;

        $image = \QrCode::format('svg')
            ->size(200)->errorCorrection('H')
            ->generate($url);
        $output_file = '/qr-code/img-' . time() . '.svg';

        Storage::disk('public')->put($output_file, $image);

        $surveyForm->update([
            'qr_code_url' => env('APP_URL') . '/storage' . '/' . $output_file
        ]);

        return parent::find($id);
    }

    public function summaryResultSurvey($id)
    {
        $surveyForm = SurveyForm::findOrFail($id);
        $questions = [];

        foreach ($surveyForm->json['pages'] as $key => $page) {
            $questions = array_merge($questions, $page['elements']);
        }

        foreach ($surveyForm->results as $key => $value) {
            $results = $value->json;
            foreach ($results as $key => $result) {
                $keyQuestions = array_search($key, array_column($questions, 'name'));
                switch ($questions[$keyQuestions]['type']) {
                    case 'text':
                        $questions[$keyQuestions]['answer'][] = $result;

                        if (!isset($questions[$keyQuestions]['answer_count'])) {
                            $questions[$keyQuestions]['answer_count'] = 1;
                        } else {
                            $questions[$keyQuestions]['answer_count'] += 1;
                        }

                        break;
                    case 'radiogroup':
                        $keyChoices =  array_search($result, array_column($questions[$keyQuestions]['choices'], 'value'));

                        if (!isset($questions[$keyQuestions]['choices'][$keyChoices]['answer_count'])) {
                            $questions[$keyQuestions]['choices'][$keyChoices]['answer_count'] = 1;
                        } else {
                            $questions[$keyQuestions]['choices'][$keyChoices]['answer_count'] += 1;
                        }

                        if (!isset($questions[$keyQuestions]['answer_count'])) {
                            $questions[$keyQuestions]['answer_count'] = 1;
                        } else {
                            $questions[$keyQuestions]['answer_count'] += 1;
                        }

                        break;
                    case 'checkbox':
                        foreach ($result as $key => $value) {
                            $keyChoices =  array_search($value, array_column($questions[$keyQuestions]['choices'], 'value'));

                            if (!isset($questions[$keyQuestions]['choices'][$keyChoices]['answer_count'])) {
                                $questions[$keyQuestions]['choices'][$keyChoices]['answer_count'] = 1;
                            } else {
                                $questions[$keyQuestions]['choices'][$keyChoices]['answer_count'] += 1;
                            }

                            if (!isset($questions[$keyQuestions]['answer_count'])) {
                                $questions[$keyQuestions]['answer_count'] = 1;
                            } else {
                                $questions[$keyQuestions]['answer_count'] += 1;
                            }
                        }

                        break;
                    case 'matrix':
                        foreach ($result as $key => $value) {
                            $keyRow =  array_search($key, array_column($questions[$keyQuestions]['rows'], 'value'));

                            if (!isset($questions[$keyQuestions]['rows'][$keyRow]['answer'])) {
                                $questions[$keyQuestions]['rows'][$keyRow]['answer'][] = [
                                    'value' => $value,
                                    'count' => 1,
                                ];
                            } else {
                                $keyAnswerOfRow = array_search($value, array_column($questions[$keyQuestions]['rows'][$keyRow]['answer'], 'value'));
                                if ($keyAnswerOfRow === false) {
                                    $questions[$keyQuestions]['rows'][$keyRow]['answer'][] = [
                                        'value' => $value,
                                        'count' => 1,
                                    ];
                                } else {
                                    $questions[$keyQuestions]['rows'][$keyRow]['answer'][$keyAnswerOfRow]['count'] += 1;
                                }
                            }

                            if (!isset($questions[$keyQuestions]['rows'][$keyRow]['answer_count'])) {
                                $questions[$keyQuestions]['rows'][$keyRow]['answer_count'] = 1;
                            } else {
                                $questions[$keyQuestions]['rows'][$keyRow]['answer_count'] += 1;
                            }
                        }

                        break;
                }
            }
        }

        return [
            'data' =>  $questions
        ];
    }

    public function surveyFormExport($attributes)
    {
        $results = $this->getSurveyForm($attributes, false);

        $params = [];
        foreach ($results as $key => $value) {
            $numberQuestion = 0;

            foreach ($value->json['pages'] as $key => $page) {
                $numberQuestion += count($page['elements']);
            }

            $params['[number]'][] = ++$key;
            $params['[name]'][] = $value->name;
            $params['[start_date]'][] = Carbon::parse($value->start_date)->format('d-m-Y');
            $params['[end_date]'][] = Carbon::parse($value->end_date)->format('d-m-Y');
            $params['[number_question]'][] = $numberQuestion;
            $params['[number_result]'][] =  $value->results->count();
        }

        return  resolve(ExcelExporterServices::class)->export('rp_survey_form', $params);
    }
}
