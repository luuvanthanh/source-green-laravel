<?php

namespace GGPHP\TravelAgency\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\TravelAgency\Http\Requests\TravelAgencyCreateRequest;
use GGPHP\TravelAgency\Http\Requests\TravelAgencyUpdateRequest;
use GGPHP\TravelAgency\Models\TravelAgency;
use GGPHP\TravelAgency\Repositories\Contracts\TravelAgencyRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TravelAgencyController extends Controller
{
    /**
     * @var $travelAgencyRepository
     */
    protected $travelAgencyRepository;

    /**
     * UserController constructor.
     * @param TravelAgencyRepository $travelAgencyRepository
     */
    public function __construct(TravelAgencyRepository $travelAgencyRepository)
    {
        $this->travelAgencyRepository = $travelAgencyRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(TravelAgencyCreateRequest $request)
    {
        $travelAgency = $this->travelAgencyRepository->create($request->all());

        return $this->success($travelAgency, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $travelAgency = $this->travelAgencyRepository->find($id);

        return $this->success($travelAgency, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if (!empty($attributes['locality'])) {
            $locality = explode(',', $attributes['locality']);
            $newLocality = [];
            foreach ($locality as $value) {
                $newLocality[] = TravelAgency::LOCALITY[$value];
            }

            $attributes['locality'] = array_values($newLocality);
        }

        if (!empty($attributes['service_type'])) {
            $serviceType = explode(',', $attributes['service_type']);
            $newServiceType = [];
            foreach ($serviceType as $value) {
                $newServiceType[] = TravelAgency::SERVICE_TYPE[$value];
            }

            $attributes['service_type'] = array_values($newServiceType);
        }

        $travelAgency = $this->travelAgencyRepository->getTravelAgency($request->all());

        return $this->success($travelAgency, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(TravelAgencyUpdateRequest $request, $id)
    {
        $travelAgency = $this->travelAgencyRepository->update($request->all(), $id);

        return $this->success($travelAgency, trans('lang::messages.common.modifySuccess'));
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
        $this->travelAgencyRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function deleteTourGuidesToTravelAgencie($id)
    {
        $this->travelAgencyRepository->deleteTourGuidesToTravelAgencie($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function addTourGuidesToTravelAgencie(Request $request, $id)
    {
        $this->travelAgencyRepository->addTourGuidesToTravelAgencie($request->all(), $id);

        return $this->success([], trans('lang::messages.common.modifySuccess'));
    }
}
