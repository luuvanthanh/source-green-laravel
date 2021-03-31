<?php
namespace Deployer;

require 'recipe/laravel.php';

// Project name
set('application', 'api.erp-tran');

// Project repository
set('repository', 'git@bitbucket.org:toancauxanh/api.erp-tran.git');

// [Optional] Allocate tty for git clone. Default value is false.
set('git_tty', true);

// Shared files/dirs between deploys
add('shared_files', []);
add('shared_dirs', []);

// set('default_timeout', 300);

// Writable dirs by web server
add('writable_dirs', [
]);

//Hosts Tran
host('ubuntu@113.160.224.7 -p20202')
    ->set('deploy_path', '~/data/{{application}}');

// // Hosts GG
// host('ubuntu@192.168.1.151 -p2002')
//     ->set('deploy_path', '~/data/{{application}}');

// Tasks
task('deployer', [
    'deploy:info',
    'deploy:prepare',
    'deploy:unlock',
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
    'deploy:authorization',
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
    run('cd {{release_path}}   && sudo chmod -R 777 src/public && sudo chmod -R 777 src/storage && sudo chmod -R 777 src/bootstrap/cache && sudo chmod -R 777 src/storage/framework && sudo chmod -R 777 src/storage/app');
});

//migrate database
task('artisan:migrate', function () {
    run('cd {{release_path}}/src   && php artisan migrate --force');
});

//seed database
task('artisan:dbseed', function () {
    run('cd {{release_path}}/src   && php artisan db:seed --class=DatabaseLiveSeeder');
});

//generate key app
task('deploy:keygen', function () {
    run('cd {{release_path}}/src   && php artisan optimize:clear && php artisan key:generate');
});

task('deploy:authorization', function () {
    run('sudo chmod -R 777 ~/data/api.erp-tran/releases ');
});

// [Optional] if deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');

after('deployer', 'success');
