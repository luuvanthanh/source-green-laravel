<?php

use Database\Seeders\ApiSharesTableSeeder;
use Database\Seeders\CardTypesTableSeeder;
use Database\Seeders\EmailVariableDefinitionsTableSeeder;
use Database\Seeders\EventConfigsTableSeeder;
use Database\Seeders\EventsTableSeeder;
use Database\Seeders\ListConfigTeamplateEmailTableSeeder;
use Database\Seeders\OauthClientsTableSeeder;
use Database\Seeders\OauthPersonalAccessClientsTableSeeder;
use Database\Seeders\ObjectTypesTableSeeder;
use Database\Seeders\SystemConfigsTableSeeder;
use Database\Seeders\TeamplateEmailVariableTableSeeder;
use Database\Seeders\ThirdPartyServicesTableSeeder;
use Database\Seeders\TourGuidesTableSeeder;
use Database\Seeders\TouristDestinationsTableSeeder;
use Database\Seeders\TravelAgenciesTableSeeder;
use Database\Seeders\SystemConfigsTableSeeder;
use Database\Seeders\ThirdPartyServicesTableSeeder;
use Database\Seeders\ApiSharesTableSeeder;
use Database\Seeders\EmailVariableDefinitionsTableSeeder;
use Database\Seeders\EventConfigsTableSeeder;
use Database\Seeders\ListConfigTeamplateEmailTableSeeder;
use Database\Seeders\TeamplateEmailVariableTableSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UsersTableSeeder::class);
        $this->call(EventTypesTableSeeder::class);
        $this->call(ProvincesTableSeeder::class);
        $this->call(LanguagesTableSeeder::class);
        $this->call(OauthClientsTableSeeder::class);
        $this->call(OauthPersonalAccessClientsTableSeeder::class);
        $this->call(TouristDestinationsTableSeeder::class);
        $this->call(ObjectTypesTableSeeder::class);
        $this->call(CardTypesTableSeeder::class);
        $this->call(TourGuidesTableSeeder::class);
        $this->call(TravelAgenciesTableSeeder::class);
        $this->call(EventsTableSeeder::class);
        $this->call(SystemConfigsTableSeeder::class);
        $this->call(ThirdPartyServicesTableSeeder::class);
        $this->call(ApiSharesTableSeeder::class);
        $this->call(EmailVariableDefinitionsTableSeeder::class);
        $this->call(EventConfigsTableSeeder::class);
        $this->call(ListConfigTeamplateEmailTableSeeder::class);
        $this->call(TeamplateEmailVariableTableSeeder::class);
    }
}
