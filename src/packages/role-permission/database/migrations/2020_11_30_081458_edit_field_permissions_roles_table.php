<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditFieldPermissionsRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('model_has_permissions', function (Blueprint $table) {
            $table->uuid('collection_id')->nullable();
        });

        Schema::table('model_has_permissions', function (Blueprint $table) {
            $table->dropPrimary();
            $table->primary(["permission_id", "model_type", "model_id", "collection_id"]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('model_has_permissions', function (Blueprint $table) {
            $table->dropPrimary();
            $table->primary(["permission_id", "model_type", "model_id"]);
        });

        Schema::table('model_has_permissions', function (Blueprint $table) {
            $table->dropColumn('collection_id');
        });
    }
}
