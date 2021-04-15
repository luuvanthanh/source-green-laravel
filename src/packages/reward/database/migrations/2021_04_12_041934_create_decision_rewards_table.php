<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDecisionRewardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('DecisionRewards', function (Blueprint $table) {
            $table->string('Id', 36)->index()->unique();
            $table->primary('Id');
            $table->string('DecisionNumber');
            $table->date('DecisionDate');
            $table->string('Reason')->nullable();
            $table->string('Type');
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('DecisionRewards');
    }
}
