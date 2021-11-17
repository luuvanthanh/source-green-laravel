<?php

namespace GGPHP\Storage\Providers;

use Illuminate\Support\ServiceProvider;
use Aws\S3\S3Client;
use League\Flysystem\AwsS3v3\AwsS3Adapter;
use League\Flysystem\Filesystem;
use Storage;

class StorageProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     */
    public function boot()
    {
        $this->mergeConfigFrom(__DIR__.'/../../config/storage.php', 'filesystems');

        Storage::extend('minio', function ($app, $config) {
            $client = new S3Client([
                'credentials' => [
                    'key'    => $config["key"],
                    'secret' => $config["secret"]
                ],
                'region' => $config["region"],
                'version' => "latest",
                'bucket_endpoint' => false,
                'use_path_style_endpoint' => true,
                'endpoint' => $config["endpoint"],
            ]);
            $options = [
                'override_visibility_on_copy' => true
            ];
            return new Filesystem(new AwsS3Adapter($client, $config["bucket"], '', $options));
        });
    }

    /**
     * Register the application services.
     */
    public function register()
    {
        // Automatically apply the package configuration
        // $this->app->register('GGPHP\Fingerprints\Providers\FingerprintProvider');
        // Register the main class to use with the facade
        // $this->app->singleton('users', function () {
            // return new \Meisoft\Models\User;
        // });
    }

    /**
     * Merge the given configuration with the existing configuration.
     *
     * @param  string  $path
     * @param  string  $key
     * @return void
     */
    protected function mergeConfigFrom($path, $key)
    {
        if (! ($this->app instanceof CachesConfiguration && $this->app->configurationIsCached())) {
            $this->app['config']->set($key, array_merge_recursive(
                $this->app['config']->get($key, []), require $path
            ));
        }
    }
}
