<?php

namespace Kun391\Users\Tests;

use Orchestra\Testbench\TestCase;
use Kun391\Users\UsersServiceProvider;

class ExampleTest extends TestCase
{

    protected function getPackageProviders($app)
    {
        return [UsersServiceProvider::class];
    }
    
    /** @test */
    public function true_is_true()
    {
        $this->assertTrue(true);
    }
}
