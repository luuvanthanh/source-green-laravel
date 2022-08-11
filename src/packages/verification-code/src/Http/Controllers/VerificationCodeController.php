<?php

namespace GGPHP\VerificationCode\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\VerificationCode\Http\Requests\VerificationCodeCreateRequest;
use GGPHP\VerificationCode\Http\Requests\VerificationCodeUpdateRequest;
use GGPHP\VerificationCode\Models\VerificationCode;
use GGPHP\VerificationCode\Repositories\Contracts\VerificationCodeRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class VerificationCodeController extends Controller
{
    /**
     * @var $verificationCoderRepository
     */
    protected $verificationCoderRepository;

    /**
     * VerificationCodeController constructor.
     * @param VerificationCodeRepository $VerificationCodeRepository
     */
    public function __construct(VerificationCodeRepository $verificationCodeRepository)
    {
        $this->verificationCodeRepository = $verificationCodeRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $verificationCodes = $this->verificationCodeRepository->getVerificationCodes($request->all());

        return $this->success($verificationCodes, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * @param Request $request
     * @param  VerificationCode $verificationCode
     * @return Response
     */
    public function show(Request $request, VerificationCode $verificationCode)
    {
        $verificationCode = $this->verificationCodeRepository->parserResult($verificationCode);

        return $this->success($verificationCode, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     *
     * @param VerificationCodeCreateRequest $request
     *
     * @return Response
     */
    public function store(VerificationCodeCreateRequest $request)
    {

        $attributes = $request->all();

        $verificationCodes = $this->verificationCodeRepository->create($attributes);

        return $this->success($verificationCodes, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     *
     * @param VerificationCodeUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(VerificationCodeUpdateRequest $request, $id)
    {
        $attributes = $request->all();

        $verificationCode =  $this->verificationCodeRepository->update($attributes, $id);

        return $this->success($verificationCode, trans('lang::messages.common.modifySuccess'));
    }

    /**
     *
     * @param VerificationCode $verificationCode
     *
     * @return Response
     */
    public function destroy($id)
    {
        if ($this->verificationCodeRepository->delete($id)) {
            return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
        }

        return response()->json(null, Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
