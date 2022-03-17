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

        Schema::create('Fingerprints', function (Blueprint $table) use ($referenceTables) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->float('Size')->nullable();
            $table->boolean('Valid')->nullable();
            $table->text('Finger');
            $table->integer('FingerIndex')->nullable();
            $table->string('DeviceId');
            $table->string('Status')->default('ON');
            $table->softDeletes('DeletedAt', 0);
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();

            if (empty($referenceTables)) {
                return;
            }
            foreach ($referenceTables as $tableName => $field) {
                if (Schema::hasTable($tableName)) {
                    $table->{$field['type']}($field['fieldName'])->unsigned()->nullable();
                    $table->foreign($field['fieldName'])->references('Id')->on($tableName)->onUpdate('cascade')->onDelete('cascade');
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
        Schema::dropIfExists('Fingerprints');
    }
}
