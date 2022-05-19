<?php

use Illuminate\Database\Seeder;

class MigrationsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('migrations')->delete();
        
        \DB::table('migrations')->insert(array (
            0 => 
            array (
                'id' => 1,
                'migration' => '2020_04_09_032555_create_training_schools_table',
                'batch' => 1,
            ),
            1 => 
            array (
                'id' => 2,
                'migration' => '2020_04_09_032717_create_training_majors_table',
                'batch' => 1,
            ),
            2 => 
            array (
                'id' => 3,
                'migration' => '2020_04_09_032750_create_degrees_table',
                'batch' => 1,
            ),
            3 => 
            array (
                'id' => 4,
                'migration' => '2020_04_09_033044_create_educational_levels_table',
                'batch' => 1,
            ),
            4 => 
            array (
                'id' => 5,
                'migration' => '2020_04_09_091949_create_parameter_values_table',
                'batch' => 1,
            ),
            5 => 
            array (
                'id' => 6,
                'migration' => '2020_04_09_092058_create_parameter_formulas_table',
                'batch' => 1,
            ),
            6 => 
            array (
                'id' => 7,
                'migration' => '2020_04_09_092610_create_type_of_contracts_table',
                'batch' => 1,
            ),
            7 => 
            array (
                'id' => 8,
                'migration' => '2020_04_09_100112_create_type_of_contract_parameter_value_table',
                'batch' => 1,
            ),
            8 => 
            array (
                'id' => 9,
                'migration' => '2020_04_09_100140_create_type_of_contract_parameter_formula_table',
                'batch' => 1,
            ),
            9 => 
            array (
                'id' => 10,
                'migration' => '2020_05_04_072730_create_fingerprint_timekeeper_table',
                'batch' => 1,
            ),
            10 => 
            array (
                'id' => 11,
                'migration' => '2020_06_02_071427_create_branchs_table',
                'batch' => 1,
            ),
            11 => 
            array (
                'id' => 12,
                'migration' => '2020_06_02_081052_create_divisions_table',
                'batch' => 1,
            ),
            12 => 
            array (
                'id' => 13,
                'migration' => '2020_06_02_081307_create_positions_table',
                'batch' => 1,
            ),
            13 => 
            array (
                'id' => 14,
                'migration' => '2020_06_05_180112_create_jobs_table',
                'batch' => 1,
            ),
            14 => 
            array (
                'id' => 15,
                'migration' => '2020_06_08_114519_create_failed_jobs_table',
                'batch' => 1,
            ),
            15 => 
            array (
                'id' => 16,
                'migration' => '2020_06_11_114328_create_media_table',
                'batch' => 1,
            ),
            16 => 
            array (
                'id' => 17,
                'migration' => '2020_06_28_041825_create_employees_table',
                'batch' => 1,
            ),
            17 => 
            array (
                'id' => 18,
                'migration' => '2020_06_29_020332_create_timekeepings_table',
                'batch' => 1,
            ),
            18 => 
            array (
                'id' => 19,
                'migration' => '2020_06_29_222539_create_absent_types_table',
                'batch' => 1,
            ),
            19 => 
            array (
                'id' => 20,
                'migration' => '2020_06_29_222553_create_absent_reasons_table',
                'batch' => 1,
            ),
            20 => 
            array (
                'id' => 21,
                'migration' => '2020_06_29_222600_create_absents_table',
                'batch' => 1,
            ),
            21 => 
            array (
                'id' => 22,
                'migration' => '2020_07_05_094553_create_fingerprints_table',
                'batch' => 1,
            ),
            22 => 
            array (
                'id' => 23,
                'migration' => '2020_07_10_213123_create_table_zk_syncs_table',
                'batch' => 1,
            ),
            23 => 
            array (
                'id' => 24,
                'migration' => '2020_10_22_051507_create_schema',
                'batch' => 1,
            ),
            24 => 
            array (
                'id' => 25,
                'migration' => '2020_11_24_090801_create_extension_unaccent',
                'batch' => 1,
            ),
            25 => 
            array (
                'id' => 26,
                'migration' => '2021_01_01_132841_create_shifts_table',
                'batch' => 1,
            ),
            26 => 
            array (
                'id' => 27,
                'migration' => '2021_01_01_132848_create_shift_details_table',
                'batch' => 1,
            ),
            27 => 
            array (
                'id' => 28,
                'migration' => '2021_01_01_132959_create_schedules_table',
                'batch' => 1,
            ),
            28 => 
            array (
                'id' => 29,
                'migration' => '2021_01_01_134557_create_schedule_repeats_table',
                'batch' => 1,
            ),
            29 => 
            array (
                'id' => 30,
                'migration' => '2021_01_01_134908_create_schedule_exceptions__table',
                'batch' => 1,
            ),
            30 => 
            array (
                'id' => 31,
                'migration' => '2021_01_05_105333_create_work_declarations_table',
                'batch' => 1,
            ),
            31 => 
            array (
                'id' => 32,
                'migration' => '2021_01_05_110129_create_work_declaration_details_table',
                'batch' => 1,
            ),
            32 => 
            array (
                'id' => 33,
                'migration' => '2021_01_14_131258_create_work_hours_table',
                'batch' => 1,
            ),
            33 => 
            array (
                'id' => 34,
                'migration' => '2021_04_09_092428_create_parameter_value_logs_table',
                'batch' => 1,
            ),
            34 => 
            array (
                'id' => 35,
                'migration' => '2021_04_09_092535_create_parameter_formula_logs_table',
                'batch' => 1,
            ),
            35 => 
            array (
                'id' => 36,
                'migration' => '2021_04_10_093513_create_labour_contracts_table',
                'batch' => 1,
            ),
            36 => 
            array (
                'id' => 37,
                'migration' => '2021_04_11_032829_create_probationary_contracts_table',
                'batch' => 1,
            ),
            37 => 
            array (
                'id' => 38,
                'migration' => '2021_04_11_074604_create_appoints_table',
                'batch' => 1,
            ),
            38 => 
            array (
                'id' => 39,
                'migration' => '2021_04_11_074604_create_dismisseds_table',
                'batch' => 1,
            ),
            39 => 
            array (
                'id' => 40,
                'migration' => '2021_04_11_074604_create_transfers_table',
                'batch' => 1,
            ),
            40 => 
            array (
                'id' => 41,
                'migration' => '2021_04_11_074648_create_appoint_details_table',
                'batch' => 1,
            ),
            41 => 
            array (
                'id' => 42,
                'migration' => '2021_04_11_074648_create_dismissed_details_table',
                'batch' => 1,
            ),
            42 => 
            array (
                'id' => 43,
                'migration' => '2021_04_11_074648_create_transfer_details_table',
                'batch' => 1,
            ),
            43 => 
            array (
                'id' => 44,
                'migration' => '2021_04_12_020229_create_position_levels_table',
                'batch' => 1,
            ),
            44 => 
            array (
                'id' => 45,
                'migration' => '2021_04_12_041917_create_rewards_table',
                'batch' => 1,
            ),
            45 => 
            array (
                'id' => 46,
                'migration' => '2021_04_12_041934_create_decision_rewards_table',
                'batch' => 1,
            ),
            46 => 
            array (
                'id' => 47,
                'migration' => '2021_04_12_041959_create_decision_reward_details_table',
                'batch' => 1,
            ),
            47 => 
            array (
                'id' => 48,
                'migration' => '2021_04_12_074604_create_salary_increases_table',
                'batch' => 1,
            ),
            48 => 
            array (
                'id' => 49,
                'migration' => '2021_04_12_080628_create_salary_increase_parameter_value_table',
                'batch' => 1,
            ),
            49 => 
            array (
                'id' => 50,
                'migration' => '2021_04_12_095059_create_labour_contract_parameter_value_table',
                'batch' => 1,
            ),
            50 => 
            array (
                'id' => 51,
                'migration' => '2021_04_12_095111_create_probationary_contract_parameter_value_table',
                'batch' => 1,
            ),
            51 => 
            array (
                'id' => 52,
                'migration' => '2021_04_13_080616_create_decision_suspends_table',
                'batch' => 1,
            ),
            52 => 
            array (
                'id' => 53,
                'migration' => '2021_04_13_080616_create_resignation_decisions_table',
                'batch' => 1,
            ),
            53 => 
            array (
                'id' => 54,
                'migration' => '2021_04_23_043429_create_business_cards_table',
                'batch' => 1,
            ),
            54 => 
            array (
                'id' => 55,
                'migration' => '2021_04_23_055559_create_business_card_details_table',
                'batch' => 1,
            ),
            55 => 
            array (
                'id' => 56,
                'migration' => '2021_04_26_070455_create_insurrances_table',
                'batch' => 1,
            ),
            56 => 
            array (
                'id' => 57,
                'migration' => '2021_04_26_083610_create_sabbatical_leave_table',
                'batch' => 1,
            ),
            57 => 
            array (
                'id' => 58,
                'migration' => '2021_04_26_092257_create_holidays_table',
                'batch' => 1,
            ),
            58 => 
            array (
                'id' => 59,
                'migration' => '2021_04_26_092520_create_holiday_details_table',
                'batch' => 1,
            ),
            59 => 
            array (
                'id' => 60,
                'migration' => '2021_04_27_011224_create_other_declarations_table',
                'batch' => 1,
            ),
            60 => 
            array (
                'id' => 61,
                'migration' => '2021_04_27_011233_create_other_declaration_details_table',
                'batch' => 1,
            ),
            61 => 
            array (
                'id' => 62,
                'migration' => '2021_04_27_151159_create_children_table',
                'batch' => 1,
            ),
            62 => 
            array (
                'id' => 63,
                'migration' => '2021_05_08_160451_create_magnetic_cards_table',
                'batch' => 1,
            ),
            63 => 
            array (
                'id' => 64,
                'migration' => '2021_05_12_035145_create_absent_details_table',
                'batch' => 1,
            ),
            64 => 
            array (
                'id' => 65,
                'migration' => '2021_05_17_033407_create_division_shifts_table',
                'batch' => 1,
            ),
            65 => 
            array (
                'id' => 66,
                'migration' => '2021_06_03_031707_create_maternity_leaves_table',
                'batch' => 1,
            ),
            66 => 
            array (
                'id' => 67,
                'migration' => '2021_06_29_011700_create_paramater_taxs_table',
                'batch' => 1,
            ),
            67 => 
            array (
                'id' => 68,
                'migration' => '2021_06_29_011739_create_paramater_tax_logs_table',
                'batch' => 1,
            ),
            68 => 
            array (
                'id' => 69,
                'migration' => '2021_06_30_072337_create_payrolls_table',
                'batch' => 1,
            ),
            69 => 
            array (
                'id' => 70,
                'migration' => '2021_06_30_072914_create_payroll_details_table',
                'batch' => 1,
            ),
            70 => 
            array (
                'id' => 71,
                'migration' => '2021_10_21_042617_create_health_insurances_table',
                'batch' => 1,
            ),
            71 => 
            array (
                'id' => 72,
                'migration' => '2021_10_22_065529_create_work_onlines_table',
                'batch' => 1,
            ),
            72 => 
            array (
                'id' => 73,
                'migration' => '2021_10_22_065550_create_work_online_details_table',
                'batch' => 1,
            ),
            73 => 
            array (
                'id' => 74,
                'migration' => '2021_11_11_070108_create_change_contract_parameters_table',
                'batch' => 1,
            ),
            74 => 
            array (
                'id' => 75,
                'migration' => '2021_11_15_071500_create_seasonal_contracts_table',
                'batch' => 1,
            ),
            75 => 
            array (
                'id' => 76,
                'migration' => '2021_11_15_072224_create_seasonal_contract_parameter_value_table',
                'batch' => 1,
            ),
            76 => 
            array (
                'id' => 77,
                'migration' => '2022_02_23_091951_create_block_table',
                'batch' => 1,
            ),
            77 => 
            array (
                'id' => 78,
                'migration' => '2022_03_02_062826_create_collaborator_contracts_table',
                'batch' => 1,
            ),
            78 => 
            array (
                'id' => 79,
                'migration' => '2022_03_02_062929_create_collaborator_contract_parameter_value_table',
                'batch' => 1,
            ),
            79 => 
            array (
                'id' => 80,
                'migration' => '2022_03_10_042005_create_rating_levels_table',
                'batch' => 1,
            ),
            80 => 
            array (
                'id' => 81,
                'migration' => '2022_03_10_070747_create_type_teachers_table',
                'batch' => 1,
            ),
            81 => 
            array (
                'id' => 82,
                'migration' => '2022_03_15_070608_create_skill_groups_table',
                'batch' => 1,
            ),
            82 => 
            array (
                'id' => 83,
                'migration' => '2022_03_15_070938_create_skill_group_details_table',
                'batch' => 1,
            ),
            83 => 
            array (
                'id' => 84,
                'migration' => '2022_03_16_043440_create_evaluate_types_table',
                'batch' => 1,
            ),
            84 => 
            array (
                'id' => 85,
                'migration' => '2022_03_16_043454_create_evaluate_type_details_table',
                'batch' => 1,
            ),
            85 => 
            array (
                'id' => 86,
                'migration' => '2022_03_16_061746_create_evaluate_type_skill_groups_table',
                'batch' => 1,
            ),
            86 => 
            array (
                'id' => 87,
                'migration' => '2022_03_16_061813_create_evaluate_type_detail_rating_levels_table',
                'batch' => 1,
            ),
            87 => 
            array (
                'id' => 88,
                'migration' => '2022_03_16_064720_create_evaluate_steps_table',
                'batch' => 1,
            ),
            88 => 
            array (
                'id' => 89,
                'migration' => '2022_03_16_065502_create_evaluate_step_evaluate_type_table',
                'batch' => 1,
            ),
            89 => 
            array (
                'id' => 90,
                'migration' => '2022_03_16_093412_create_evaluate_teachers_table',
                'batch' => 1,
            ),
            90 => 
            array (
                'id' => 91,
                'migration' => '2022_03_16_103618_create_evaluate_teacher_details_table',
                'batch' => 1,
            ),
            91 => 
            array (
                'id' => 92,
                'migration' => '2022_05_04_070929_add_filed_code_detail_to_skill_group_details_table',
                'batch' => 2,
            ),
            92 => 
            array (
                'id' => 93,
                'migration' => '2022_05_16_093945_create_training_forms_table',
                'batch' => 3,
            ),
            93 => 
            array (
                'id' => 94,
                'migration' => '2022_05_17_023812_create_training_skills_table',
                'batch' => 3,
            ),
            94 => 
            array (
                'id' => 95,
                'migration' => '2022_05_17_024119_create_training_skill_details_table',
                'batch' => 3,
            ),
            95 => 
            array (
                'id' => 96,
                'migration' => '2022_05_18_013652_create_teacher_assignments_table',
                'batch' => 4,
            ),
        ));
        
        
    }
}