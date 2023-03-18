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
    protected $availableIncludes = ['grade', 'blockDetail'];

    public function includeGrade(Block $block)
    {
        if (is_null($block->grade)) {
            return null;
        }

        return $this->item($block->grade, new GradeTransformer, 'Grade');
    }

    public function includeBlockDetail(Block $block)
    {
        if (is_null($block->blockDetail)) {
            return null;
        }

        return $this->collection($block->blockDetail, new BlockDetailTransformer, 'BlockDetail');
    }
}
