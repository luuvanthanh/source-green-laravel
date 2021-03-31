<?php

namespace GGPHP\Fingerprint\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Fingerprint\Http\Requests\FingerprintUpdateRequest;
use GGPHP\Fingerprint\Repositories\Contracts\FingerprintRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FingerprintController extends Controller
{
    /**
     * @var $userRepository
     */
    protected $fingerprintRepository;

    /**
     * UserController constructor.
     * @param FingerprintRepository $fingerprintRepository
     */
    public function __construct(FingerprintRepository $fingerprintRepository)
    {
        $this->fingerprintRepository = $fingerprintRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $fingerprints = $this->fingerprintRepository->getAll($request->all());

        return $this->success($fingerprints, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(FingerprintUpdateRequest $request, $id)
    {
        $fingerprint = $this->fingerprintRepository->update($request->all(), $id);

        return $this->success($fingerprint, trans('lang::messages.common.updateSuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->fingerprintRepository->delete($id);
        return response()->json([], 204);
    }
}
