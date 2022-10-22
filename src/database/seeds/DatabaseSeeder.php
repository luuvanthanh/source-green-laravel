<?php


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
        $this->call(AiServicesTableSeeder::class);
        $this->call(ApiSharesTableSeeder::class);
        $this->call(CameraServersTableSeeder::class);
        $this->call(CamerasTableSeeder::class);
        $this->call(CardTypesTableSeeder::class);
        $this->call(EmailVariableDefinitionsTableSeeder::class);
        $this->call(EventConfigsTableSeeder::class);
        $this->call(EventTypesTableSeeder::class);
        $this->call(LanguagesTableSeeder::class);
        $this->call(ListConfigTeamplateEmailTableSeeder::class);
        $this->call(ModelHasRolesTableSeeder::class);
        $this->call(NasConfigsTableSeeder::class);
        $this->call(OauthClientsTableSeeder::class);
        $this->call(OauthPersonalAccessClientsTableSeeder::class);
        $this->call(ObjectTypesTableSeeder::class);
        $this->call(PermissionsTableSeeder::class);
        $this->call(ProvincesTableSeeder::class);
        $this->call(RoleHasPermissionsTableSeeder::class);
        $this->call(RolesTableSeeder::class);
        $this->call(SystemConfigsTableSeeder::class);
        $this->call(TeamplateEmailVariableTableSeeder::class);
        $this->call(ThirdPartyServicesTableSeeder::class);
        $this->call(TouristDestinationsTableSeeder::class);
        $this->call(TravelAgenciesTableSeeder::class);
        $this->call(UnitsTableSeeder::class);
        $this->call(UsersTableSeeder::class);
        $this->call(VerificationCodesTableSeeder::class);
    }
}
