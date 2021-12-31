<?php

namespace GGPHP\Transfer\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Transfer\Models\Transfer;

/**
 * Class TransferTransformer.
 *
 * @package namespace GGPHP\Transfer\Transformers;
 */
class TransferTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [];

    protected $defaultIncludes = ['transferDetails'];

    /**
     * Include transferDetails
     * @param  Transfer $transfer
     */
    public function includeTransferDetails(Transfer $transfer)
    {
        return $this->collection($transfer->transferDetails, new TransferDetailTransformer, 'TransferDetail');
    }
}
