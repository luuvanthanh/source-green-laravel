<?php

namespace GGPHP\Transfer\Transformers;

use GGPHP\Core\Traits\ApprovalTransformerTrait;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\RolePermission\Transformers\StoreTransformer;
use GGPHP\Transfer\Models\Transfer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class TransferTransformer.
 *
 * @package namespace GGPHP\Transfer\Transformers;
 */
class TransferTransformer extends BaseTransformer
{
    use ApprovalTransformerTrait;

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['userCreate', 'store'];

    protected $defaultIncludes = ['transferDetails', 'approval'];

    /**
     * Include transferDetails
     * @param  Transfer $transfer
     */
    public function includeTransferDetails(Transfer $transfer)
    {
        return $this->collection($transfer->transferDetails, new TransferDetailTransformer, 'TransferDetail');
    }

    /**
     * Include UserCreate
     * @param  Suggest $transfer
     */
    public function includeUserCreate(Transfer $transfer)
    {
        if (empty($transfer->userCreate)) {
            return;
        }

        return $this->item($transfer->userCreate, new UserTransformer, 'UserCreate');
    }

    /**
     * Include store
     * @param  Transfer $transfer
     */
    public function includeStore(Transfer $transfer)
    {
        if (empty($transfer->store)) {
            return;
        }

        return $this->item($transfer->store, new StoreTransformer, 'Store');
    }
}
