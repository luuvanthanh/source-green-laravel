<?php

namespace GGPHP\Users\Http\Controllers;

use \Laravel\Passport\Http\Controllers\AccessTokenController as ATController;
use App\Traits\ResponseTrait;
use Exception;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Laravel\Passport\Exceptions\OAuthServerException;
use Laravel\Passport\TokenRepository;
use Lcobucci\JWT\Parser as JwtParser;
use League\OAuth2\Server\AuthorizationServer;
use Psr\Http\Message\ServerRequestInterface;
use Response;

class AccessTokenController extends ATController
{
    use ResponseTrait;

    /**
     * @var UserRepository
     */
    protected $userRepository;

    public function __construct(AuthorizationServer $server, TokenRepository $tokens, JwtParser $jwt, UserRepository $userRepository)
    {
        parent::__construct($server, $tokens, $jwt);

        $this->userRepository = $userRepository;
    }

    public function issueToken(ServerRequestInterface $request)
    {
        try {
            $username = $request->getParsedBody()['username'];
            $user = User::where('email', '=', $username)->where('status', User::STATUS['ACTIVITY'])->firstOrFail();
            //generate token
            $tokenResponse = parent::issueToken($request);
            //convert response to json string
            $content = $tokenResponse->getContent();
            $data = json_decode($content, true);

            if (isset($data['error'])) {
                return $this->error('Đăng nhập không thành công', 'Đăng nhập không thành công, vui lòng kiểm tra lại!', 400);
            }

            if (!empty($request->getParsedBody()['player_id'])) {
                $this->userRepository->addPlayer($request->getParsedBody()['player_id'], $user->id);
            }

            return Response::json(collect($data));
        } catch (Exception $e) {

            if ($e instanceof ModelNotFoundException) {
                return $this->error('Nhập sai tài khoản', 'Nhập sai tài khoản, vui lòng kiểm tra lại!', 400, 'username');
            }
            if ($e instanceof OAuthServerException) {
                return $this->error('Nhập sai mật khẩu', 'Nhập sai mật khẩu, vui lòng kiểm tra lại!', 400, 'password');
            }

            return $this->error('Đăng nhập không thành công', 'Đăng nhập không thành công, vui lòng kiểm tra lại!', 400);
        }
    }
}
