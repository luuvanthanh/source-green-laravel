<?php

namespace GGPHP\ApiShare\Exceptions;

use Symfony\Component\HttpKernel\Exception\HttpException;

class AccessApiException extends HttpException
{
    public static function notAccessApi(): self
    {
        return new static(400, 'API không được phép truy cập.', null, []);
    }
}
