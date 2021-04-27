<?php

namespace GGPHP\Category\Transformers;

use GGPHP\Category\Models\Holiday;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class HolidayTransformer.
 *
 * @package namespace GGPHP\Category\Transformers;
 */
class HolidayTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */

    protected $availableIncludes = ['holidayDetails'];

    /**
     * Include HolidayDetail
     * @param  Holiday $holiday
     */
    public function includeHolidayDetails(Holiday $holiday)
    {
        return $this->collection($holiday->holidayDetail, new HolidayDetailTransformer, 'HolidayDetail');
    }

}
