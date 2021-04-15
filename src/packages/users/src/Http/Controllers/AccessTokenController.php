<?php

namespace GGPHP\Users\Http\Controllers;

use App\Traits\ResponseTrait;
use Exception;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Laravel\Passport\TokenRepository;
use Lcobucci\JWT\Parser as JwtParser;
use League\OAuth2\Server\AuthorizationServer;
use League\OAuth2\Server\Exception\OAuthServerException;
use Psr\Http\Message\ServerRequestInterface;
use Response;
use \Laravel\Passport\Http\Controllers\AccessTokenController as ATController;

class AccessTokenController extends ATController
{
    use ResponseTrait;

    /**
     * @var UserRepository
     */
    protected $employeeRepository;

    public function __construct(AuthorizationServer $server, TokenRepository $tokens, JwtParser $jwt, UserRepository $employeeRepository)
    {
        parent::__construct($server, $tokens, $jwt);

        $this->employeeRepository = $employeeRepository;
    }

    public function issueToken(ServerRequestInterface $request)
    {
        try {
            $employeename = $request->getParsedBody()['employeename'];
            $employee = User::where('email', '=', $employeename)->where('status', User::ON)->firstOrFail();
            //generate token
            $tokenResponse = parent::issueToken($request);

            //convert response to json string
            $content = $tokenResponse->getContent();
            $data = json_decode($content, true);
            if (isset($data['error'])) {
                throw new OAuthServerException('The employee credentials were incorrect.', 6, 'invalid_credentials', 401);
            }

            if (!empty($request->getParsedBody()['player_id'])) {
                $this->employeeRepository->addPlayer($request->getParsedBody()['player_id'], $employee->id);
            }

            return Response::json(collect($data));
        } catch (ModelNotFoundException $e) {
            // email notfound
            if ($e instanceof ModelNotFoundException) {
                return $this->error('Invalid_credentials', 'User does not exist. Please try again', 400);
            }
        } catch (OAuthServerException $e) {
            //password not correct..token not granted
            return $this->error('Invalid_credentials', 'Password is not correct', 401);
        } catch (Exception $e) {
            return response(['error' => 'unsupported_grant_type', 'message' => 'The authorization grant type is not supported by the authorization server.', 'hint' => 'Check that all required parameters have been provided'], 400);
        }
    }
}
