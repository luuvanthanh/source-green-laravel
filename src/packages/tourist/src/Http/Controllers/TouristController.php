<?php

namespace GGPHP\Tourist\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Tourist\Http\Requests\TouristCreateRequest;
use GGPHP\Tourist\Http\Requests\TouristUpdateRequest;
use GGPHP\Tourist\Repositories\Contracts\TouristRepository;
use GGPHP\Tourist\Models\Tourist;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TouristController extends Controller
{
    /**
     * @var $touristrRepository
     */
    protected $touristrRepository;

    /**
     * TouristController constructor.
     * @param TouristRepository $TouristRepository
     */
    public function __construct(TouristRepository $touristRepository)
    {
        $this->touristRepository = $touristRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $tourists = $this->touristRepository->getTourists($request->all());

        return $this->success($tourists, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * @param Request $request
     * @param  Tourist $tourist
     * @return Response
     */
    public function show(Request $request, Tourist $tourist)
    {
        $tourist = $this->touristRepository->parserResult($tourist);

        return $this->success($tourist, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     *
     * @param TouristCreateRequest $request
     *
     * @return Response
     */
    public function store(TouristCreateRequest $request)
    {

        $attributes = $request->all();

        $tourists = $this->touristRepository->create($attributes);

        return $this->success($tourists, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     *
     * @param TouristUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(TouristUpdateRequest $request, Tourist $tourist)
    {
        $attributes = $request->all();

        $tourist =  $this->touristRepository->update($attributes, $tourist);

        return $this->success($tourist, trans('lang::messages.common.modifySuccess'));
    }

    /**
     *
     * @param Tourist $tourist
     *
     * @return Response
     */
    public function destroy($id)
    {
        if ($this->touristRepository->delete($id)) {
            return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
        }

        return response()->json(null, Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function exportExcelTourists(Request $request)
    {
        $result = $this->tourGuideRepository->exportExcelTourists($request->all());

        if (is_string($result)) {
            return $this->error('Export failed', trans('lang::messages.export.template-not-found'), 400);
        }

        return $result;
    }
}
