<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFingerprintsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $referenceTables = config('fingerprint.reference_tables');

        Schema::create('fingerprints', function (Blueprint $table) use ($referenceTables) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->float('size')->nullable();
            $table->boolean('valid')->nullable();
            $table->text('finger');
            $table->integer('finger_index')->nullable();
            $table->string('device_id');
            $table->string('status')->default('ON');
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();

            if (empty($referenceTables)) {
                return;
            }

            foreach ($referenceTables as $tableName => $field) {
                if (Schema::hasTable($tableName)) {
                    $table->{$field['type']}($field['fieldName'])->unsigned()->nullable();
                    $table->foreign($field['fieldName'])->references('id')->on($tableName)->onUpdate('cascade')->onDelete('cascade');
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fingerprints');
    }
}
