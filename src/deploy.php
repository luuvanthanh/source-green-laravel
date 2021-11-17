<?php
namespace Deployer;

require 'recipe/laravel.php';

// Project name
set('application', 'gdtd-api');

// Project repository
set('repository', 'git@github.com:mei-soft/gdtd-api.git');

// [Optional] Allocate tty for git clone. Default value is false.
set('git_tty', false);

// Shared files/dirs between deploys
add('shared_files', []);
add('shared_dirs', []);

// Writable dirs by web server
add('writable_dirs', []);

// Hosts

//Hosts
host('root@125.212.221.38 -p7878')
    ->set('deploy_path', '/var/www/data/{{application}}');

// Tasks

// Tasks
task('deployer', [
    'deploy:info',
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
    'deploy:shared',
    'deploy:writable',
    'deploy:vendors',
    'deploy:keygen',
    'artisan:storage:link',
    'artisan:migrate',
    // 'artisan:dbseed', //first run
    'deploy:symlink',
    'deploy:unlock',
    'cleanup',
    'reload:php-fpm',
    'reload:nginx',
]);

//reload php service
task('reload:php-fpm', function () {
    run('sudo /usr/sbin/service php7.4-fpm reload');
});

//reload nginx service
task('reload:nginx', function () {
    run('sudo /usr/sbin/service nginx reload');
});

//run composer install
task('deploy:vendors', function () {
    run('cd {{release_path}}/src   && COMPOSER_MEMORY_LIMIT=-1 composer install');
});

task('artisan:storage:link', function () {
    run('cd {{release_path}}/src   && php artisan storage:link');
});

//create env for env example
task('deploy:shared', function () {
    run('cd {{release_path}}/src   &&   cp .env.example .env');
});

task('deploy:writable', function () {
    run('cd {{release_path}}   && chmod -R 777 src/public && chmod -R 777 src/storage && chmod -R 777 src/bootstrap/cache && chmod -R 777 src/storage/framework');
});

//migrate database
task('artisan:migrate', function () {
    run('cd {{release_path}}/src   && php artisan migrate --force');
});

//seed database
task('artisan:dbseed', function () {
    run('cd {{release_path}}/src   && php artisan db:seed');
});

//generate key app
task('deploy:keygen', function () {
    run('cd {{release_path}}/src   && php artisan optimize:clear && php artisan key:generate');
});

// [Optional] if deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');

after('deployer', 'success');
