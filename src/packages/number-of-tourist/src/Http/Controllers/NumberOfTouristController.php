<?php

namespace GGPHP\NumberOfTourist\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\NumberOfTourist\Http\Requests\NumberOfTouristCreateRequest;
use GGPHP\NumberOfTourist\Http\Requests\NumberOfTouristUpdateRequest;
use GGPHP\NumberOfTourist\Models\NumberOfTourist;
use GGPHP\NumberOfTourist\Repositories\Contracts\NumberOfTouristRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NumberOfTouristController extends Controller
{
    /**
     * @var $numberOfTouristRepository
     */
    protected $numberOfTouristRepository;

    /**
     * UserController constructor.
     * @param NumberOfTouristRepository $numberOfTouristRepository
     */
    public function __construct(NumberOfTouristRepository $numberOfTouristRepository)
    {
        $this->numberOfTouristRepository = $numberOfTouristRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(NumberOfTouristCreateRequest $request)
    {
        $attributes = $request->all();
        if ($attributes['number_of_guest_in'] > 0 || $attributes['number_of_guest_out'] > 0) {
            $numberOfTourist = $this->numberOfTouristRepository->create($attributes);

            return $this->success($numberOfTourist, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
        }

        return $this->success([], trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    public function report(Request $request)
    {
        $attributes = $request->all();

        $numberOfTourist = $this->numberOfTouristRepository->report($attributes);

        return $this->success($numberOfTourist, trans('lang::messages.common.getListSuccess'));
    }

    public function exportExcel(Request $request)
    {
        $result = $this->numberOfTouristRepository->exportExcel($request->all());

        if (is_string($result)) {
            return $this->error('Export failed', trans('Template not found'), 400);
        }

        return $result;
    }
}
