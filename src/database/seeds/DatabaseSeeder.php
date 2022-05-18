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
        $this->call(DegreesTableSeeder::class);
        $this->call(TrainingMajorsTableSeeder::class);
        $this->call(TrainingSchoolsTableSeeder::class);
        $this->call(EmployeesTableSeeder::class);

        $this->call(AbsentTypesTableSeeder::class);
        $this->call(AbsentsTableSeeder::class);
        $this->call(AbsentDetailsTableSeeder::class);
        $this->call(AbsentReasonsTableSeeder::class);
        $this->call(AppointDetailsTableSeeder::class);
        $this->call(AppointsTableSeeder::class);
        $this->call(BlocksTableSeeder::class);
        $this->call(BranchesTableSeeder::class);
        $this->call(BusinessCardsTableSeeder::class);
        $this->call(BusinessCardDetailsTableSeeder::class);
        $this->call(ChangeContractParametersTableSeeder::class);
        $this->call(ChildrensTableSeeder::class);
        $this->call(CollaboratorContractParameterValueTableSeeder::class);
        $this->call(CollaboratorContractsTableSeeder::class);
        $this->call(DecisionRewardDetailsTableSeeder::class);
        $this->call(DecisionRewardsTableSeeder::class);
        $this->call(DecisionSuspendsTableSeeder::class);
        $this->call(DismissedDetailsTableSeeder::class);
        $this->call(DismissedsTableSeeder::class);
        $this->call(DivisionsTableSeeder::class);

        $this->call(ShiftsTableSeeder::class);
        $this->call(ShiftDetailsTableSeeder::class);
        $this->call(DivisionShiftsTableSeeder::class);
        $this->call(EducationalLevelsTableSeeder::class);
        $this->call(FingerprintTimekeepersTableSeeder::class);
        $this->call(FingerprintsTableSeeder::class);
        $this->call(HealthInsurancesTableSeeder::class);


        $this->call(InsurrancesTableSeeder::class);
        $this->call(TypeOfContractsTableSeeder::class);
        $this->call(ParameterValuesTableSeeder::class);
        $this->call(TypeOfContractParameterValueTableSeeder::class);
        $this->call(TypeOfContractParameterFormulaTableSeeder::class);
        $this->call(PositionsTableSeeder::class);
        $this->call(LabourContractsTableSeeder::class);


        $this->call(LabourContractParameterValueTableSeeder::class);
        $this->call(MagneticCardsTableSeeder::class);
        $this->call(MaternityLeavesTableSeeder::class);
        $this->call(OtherDeclarationDetailsTableSeeder::class);
        $this->call(OtherDeclarationsTableSeeder::class);
        $this->call(ParameterFormulaLogsTableSeeder::class);
        $this->call(ParameterFormulasTableSeeder::class);
        $this->call(ParameterTaxLogsTableSeeder::class);
        $this->call(ParameterTaxsTableSeeder::class);
        $this->call(ParameterValueLogsTableSeeder::class);
        $this->call(PayrollDetailsTableSeeder::class);
        $this->call(PayrollsTableSeeder::class);
        $this->call(PositionLevelsTableSeeder::class);
        $this->call(ProbationaryContractParameterValueTableSeeder::class);
        $this->call(ProbationaryContractsTableSeeder::class);
        $this->call(ResignationDecisionsTableSeeder::class);
        $this->call(RewardsTableSeeder::class);
        $this->call(SabbaticalLeavesTableSeeder::class);
        $this->call(SalaryIncreaseParameterValueTableSeeder::class);
        $this->call(SalaryIncreasesTableSeeder::class);
        $this->call(ScheduleExceptionsTableSeeder::class);
        $this->call(SchedulesTableSeeder::class);
        $this->call(ScheduleRepeatsTableSeeder::class);
        $this->call(SeasonalContractsTableSeeder::class);
        $this->call(SeasonalContractParameterValueTableSeeder::class);
        $this->call(ShiftsTableSeeder::class);
        $this->call(ShiftDetailsTableSeeder::class);
        $this->call(TimekeepingsTableSeeder::class);
        $this->call(TransfersTableSeeder::class);
        $this->call(TransferDetailsTableSeeder::class);
        $this->call(WorkDeclarationsTableSeeder::class);
        $this->call(WorkDeclarationDetailsTableSeeder::class);
        $this->call(WorkHoursTableSeeder::class);
        $this->call(WorkOnlinesTableSeeder::class);
        $this->call(WorkOnlineDetailsTableSeeder::class);
        $this->call(ZkDeviceSyncTimesTableSeeder::class);
        $this->call(ZkSyncsTableSeeder::class);
        $this->call(FailedJobsTableSeeder::class);
        $this->call(JobsTableSeeder::class);
        $this->call(MediaTableSeeder::class);
        $this->call(MigrationsTableSeeder::class);

        // $this->call(HolidaysTableSeeder::class);
        // $this->call(HolidayDetailsTableSeeder::class);
    }
}
