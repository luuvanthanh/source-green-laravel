<?php

namespace GGPHP\Category\Transformers;

use GGPHP\Category\Models\Block;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class BlockTransformer.
 *
 * @package namespace GGPHP\Category\Transformers;
 */
class BlockTransformer extends BaseTransformer
{
    protected $availableIncludes = ['grade'];

    public function includeGrade(Block $block)
    {
        if (is_null($block->grade)) {
            return null;
        }

        return $this->item($block->grade, new GradeTransformer, 'Grade');
    }
}
