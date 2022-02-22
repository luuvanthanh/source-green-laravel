<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\HolidayCreateRequest;
use GGPHP\Category\Http\Requests\HolidayUpdateRequest;
use GGPHP\Category\Repositories\Contracts\HolidayRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HolidayController extends Controller
{
    /**
     * @var $holidayRepository
     */
    protected $holidayRepository;

    /**
     * HolidayController constructor.
     * @param HolidayRepository $holidayRepository
     */
    public function __construct(HolidayRepository $holidayRepository)
    {
        $this->holidayRepository = $holidayRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(HolidayCreateRequest $request)
    {
        $holiday = $this->holidayRepository->createOrUpdate($request->all());

        return $this->success($holiday, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $holiday = $this->holidayRepository->find($id);

        return $this->success($holiday, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = config('constants.SEARCH_VALUES_DEFAULT.LIMIT');
        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        if ($limit == config('constants.SEARCH_VALUES_DEFAULT.LIMIT_ZERO')) {
            $holiday = $this->holidayRepository->all();
        } else {
            $holiday = $this->holidayRepository->paginate($limit);
        }

        return $this->success($holiday, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(HolidayUpdateRequest $request, $id)
    {
        $holiday = $this->holidayRepository->update($request->all(), $id);

        return $this->success([], trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $this->holidayRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }
}
