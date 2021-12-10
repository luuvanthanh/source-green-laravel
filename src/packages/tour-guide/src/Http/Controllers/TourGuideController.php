<?php

namespace GGPHP\TourGuide\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\TourGuide\Http\Requests\TourGuideCreateRequest;
use GGPHP\TourGuide\Http\Requests\TourGuideUpdateRequest;
use GGPHP\TourGuide\Models\TourGuide;
use GGPHP\TourGuide\Repositories\Contracts\TourGuideRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TourGuideController extends Controller
{
    /**
     * @var $tourGuideRepository
     */
    protected $tourGuideRepository;

    /**
     * UserController constructor.
     * @param TourGuideRepository $tourGuideRepository
     */
    public function __construct(TourGuideRepository $tourGuideRepository)
    {
        $this->tourGuideRepository = $tourGuideRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(TourGuideCreateRequest $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['type'])) {
            $attributes['type'] = TourGuide::TYPE[$attributes['type']];
        }

        if (!empty($attributes['sex'])) {
            $attributes['sex'] = TourGuide::SEX[$attributes['sex']];
        }

        $tourGuide = $this->tourGuideRepository->create($attributes);

        return $this->success($tourGuide, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $tourGuide = $this->tourGuideRepository->find($id);

        return $this->success($tourGuide, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['type'])) {
            $type = explode(',', $attributes['type']);
            $newType = [];
            foreach ($type as $value) {
                $newType[] = TourGuide::TYPE[$value];
            }

            $attributes['type'] = array_values($newType);
        }

        $tourGuide = $this->tourGuideRepository->getTourGuide($attributes);

        return $this->success($tourGuide, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(TourGuideUpdateRequest $request, $id)
    {
        $attributes = $request->all();

        if (!empty($attributes['type'])) {
            $attributes['type'] = TourGuide::TYPE[$attributes['type']];
        }

        if (!empty($attributes['sex'])) {
            $attributes['sex'] = TourGuide::SEX[$attributes['sex']];
        }

        $tourGuide = $this->tourGuideRepository->update($attributes, $id);

        return $this->success($tourGuide, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->tourGuideRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    public function exportExcel(Request $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['type'])) {
            $type = explode(',', $attributes['type']);
            $newType = [];
            foreach ($type as $value) {
                $newType[] = TourGuide::TYPE[$value];
            }

            $attributes['type'] = array_values($newType);
        }

        $result = $this->tourGuideRepository->exportExcel($attributes);

        if (is_string($result)) {
            return $this->error('Export failed', trans('Template not found'), 400);
        }

        return $result;
    }
}
