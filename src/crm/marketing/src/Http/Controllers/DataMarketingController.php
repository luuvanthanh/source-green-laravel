<?php

namespace GGPHP\Crm\Marketing\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Marketing\Http\Requests\CreateDataMarketingRequest;
use GGPHP\Crm\Marketing\Http\Requests\MoveLeadRequest;
use GGPHP\Crm\Marketing\Http\Requests\MultipleDeleteDataMarketingRequest;
use GGPHP\Crm\Marketing\Http\Requests\UpdateDataMarketingRequest;
use GGPHP\Crm\Marketing\Imports\DataMarketingImport;
use GGPHP\Crm\Marketing\Models\DataMarketing;
use GGPHP\Crm\Marketing\Repositories\Contracts\DataMarketingRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;

class DataMarketingController extends Controller
{
    /**
     * 
     * @var $employeeRepository
     */
    protected $dataMarketingRepository;

    /**
     * UserController constructor.
     * @param ReviewRepository $inOutHistoriesRepository
     */
    public function __construct(DataMarketingRepository $dataMarketingRepository)
    {
        $this->dataMarketingRepository = $dataMarketingRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $dataMarketing = $this->dataMarketingRepository->getDataMarketing($request->all());

        return $this->success($dataMarketing, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateDataMarketingRequest $request)
    {
        $attributes = $request->all();

        if (isset($attributes['user_create_info'])) {
            $attributes['user_create_info'] = json_encode($attributes['user_create_info']);
        }

        if (!empty($attributes['sex'])) {
            $attributes['sex'] = DataMarketing::SEX[$attributes['sex']];
        }

        if (!empty($attributes['status'])) {
            $attributes['status'] = DataMarketing::STATUS[$attributes['status']];
        }
        $dataMarketing = $this->dataMarketingRepository->create($attributes);

        return $this->success($dataMarketing, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $dataMarketing = $this->dataMarketingRepository->find($id);

        return $this->success($dataMarketing, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateDataMarketingRequest $request, $id)
    {
        $attributes = $request->all();

        if (isset($attributes['user_create_info'])) {
            $attributes['user_create_info'] = json_encode($attributes['user_create_info']);
        }

        if (!empty($attributes['sex'])) {
            $attributes['sex'] = DataMarketing::SEX[$attributes['sex']];
        }

        if (!empty($attributes['status'])) {
            $attributes['status'] = DataMarketing::STATUS[$attributes['status']];
        }

        $dataMarketing = $this->dataMarketingRepository->update($attributes, $id);

        return $this->success($dataMarketing, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\news  $Marketing
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->dataMarketingRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function storeProgram(Request $request)
    {
        $program = $this->dataMarketingRepository->storeProgram($request->all());

        return $this->success($program, trans('lang::messages.common.createSuccess'));
    }

    public function deleteProgram(Request $request)
    {
        $this->dataMarketingRepository->deleteProgram($request->all());

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function moveLead(MoveLeadRequest $request)
    {
        $this->dataMarketingRepository->moveLead($request->all());

        return $this->success([], trans('lang::messages.common.movedSuccess'));
    }

    public function createTag(Request $request)
    {
        $dataMarketing = $this->dataMarketingRepository->createTag($request->all());

        return $this->success($dataMarketing, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    public function mergeDataMarketing(Request $request)
    {
        $attributes = $request->all();

        if (isset($attributes['user_create_info'])) {
            $attributes['user_create_info'] = json_encode($attributes['user_create_info']);
        }

        if (!empty($attributes['sex'])) {
            $attributes['sex'] = DataMarketing::SEX[$attributes['sex']];
        }

        if (!empty($attributes['status'])) {
            $attributes['status'] = DataMarketing::STATUS[$attributes['status']];
        }
        $mergeDataMarketing = $this->dataMarketingRepository->mergeDataMarketing($attributes);

        return $this->success($mergeDataMarketing, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    public function importExcelDataMarketing()
    {
        Excel::import(new DataMarketingImport(), request()->file('file'));

        return $this->success(['data' =>  'Import thành công'], trans('lang::messages.common.createSuccess'));
    }

    public function templateExcelDataMarketing()
    {
        return Storage::disk('local')->download('excel-exporter/templates' . '/' . 'template-data-marketing.xlsx');
    }

    public function exchangeEmailPhone(Request $request)
    {
        $dataMarketing = $this->dataMarketingRepository->exchangeEmailPhone();

        return $this->success($dataMarketing, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    public function multipleDeleteDataMarketing(MultipleDeleteDataMarketingRequest $request)
    {
        $dataMarketing = $this->dataMarketingRepository->multipleDeleteDataMarketing($request->all());

        return $this->success($dataMarketing, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
