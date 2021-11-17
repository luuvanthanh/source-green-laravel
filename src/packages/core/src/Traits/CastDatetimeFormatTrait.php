<?php

namespace GGPHP\Core\Traits;

trait CastDatetimeFormatTrait
{
    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dateTimeFields = [];

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateTimeFormat = 'c';

    /**
     * Convert the model's attributes to an array.
     *
     * @return array
     */
    public function attributesToArray()
    {
        // If an attribute is a date, we will cast it to a string after converting it
        // to a DateTime / Carbon instance. This is so we will get some consistent
        // formatting while accessing attributes vs. arraying / JSONing a model.
        $attributes = parent::attributesToArray();

        return $this->addDateTimeAttributesToArray($attributes);
    }
    /**
     * Add the date attributes to the attributes array.
     *
     * @param  array  $attributes
     * @return array
     */
    protected function addDateTimeAttributesToArray(array $attributes)
    {
        foreach ($this->getDateTimeFields() as $key) {
            if (!isset($attributes[$key])) {
                continue;
            }
            $attributes[$key] = $this->serializeDateByFormat($this->asDateTime($attributes[$key]));
        }

        return $attributes;
    }

    /**
     * Get the attributes that should be converted to dates.
     *
     * @return array
     */
    public function getDateTimeFormat()
    {
        return $this->dateTimeFormat ?: $this->getConnection()->getQueryGrammar()->getDateFormat();
    }

    /**
     * Get the attributes that should be converted to dates.
     *
     * @return array
     */
    public function getDateTimeFields()
    {
        $defaults = [
            $this->getCreatedAtColumn(),
            $this->getUpdatedAtColumn(),
        ];

        return $this->usesTimestamps()
        ? array_unique(array_merge($this->dateTimeFields, $defaults))
        : $this->dateTimeFields;
    }

    /**
     * Prepare a date for array / JSON serialization.
     *
     * @param  \DateTimeInterface  $date
     * @return string
     */
    protected function serializeDateByFormat($date)
    {
        return \Carbon\Carbon::instance($date)
            ->timezone(config('app.timezone'))
            ->format($this->getDateTimeFormat());
    }
}
