<?php

namespace GGPHP\Transfer\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Division\Transformers\DivisionTransformer;
use GGPHP\Division\Transformers\PositionTransformer;
use GGPHP\Division\Transformers\RankPositionInformationTransformer;
use GGPHP\Division\Transformers\RankTransformer;
use GGPHP\Division\Transformers\WorkFormTransformer;
use GGPHP\RolePermission\Transformers\RoleTransformer;
use GGPHP\RolePermission\Transformers\StoreTransformer;
use GGPHP\Transfer\Models\TransferDetail;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class TransferDetailTransformer.
 *
 * @package namespace GGPHP\Transfer\Transformers;
 */
class TransferDetailTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['oldRankPositionInformations'];

    protected $defaultIncludes = ['user', 'store', 'position', 'division', 'workForm', 'rank', 'role'];

    /**
     * Include store
     * @param  TransferDetail $transferDetail
     */
    public function includeStore(TransferDetail $transferDetail)
    {
        if (empty($transferDetail->store)) {
            return;
        }

        return $this->item($transferDetail->store, new StoreTransformer, 'Store');
    }

    /**
     * Include user
     * @param  TransferDetail $transferDetail
     */
    public function includeUser(TransferDetail $transferDetail)
    {
        if (empty($transferDetail->user)) {
            return;
        }

        return $this->item($transferDetail->user, new UserTransformer, 'User');
    }

    /**
     * Include position
     * @param  TransferDetail $transferDetail
     */
    public function includePosition(TransferDetail $transferDetail)
    {
        if (empty($transferDetail->position)) {
            return;
        }

        return $this->item($transferDetail->position, new PositionTransformer, 'Position');
    }

    /**
     * Include division
     * @param  TransferDetail $transferDetail
     */
    public function includeDivision(TransferDetail $transferDetail)
    {
        if (empty($transferDetail->division)) {
            return;
        }

        return $this->item($transferDetail->division, new DivisionTransformer, 'Division');
    }

    /**
     * Include workForm
     * @param  TransferDetail $transferDetail
     */
    public function includeWorkForm(TransferDetail $transferDetail)
    {
        if (empty($transferDetail->workForm)) {
            return;
        }

        return $this->item($transferDetail->workForm, new WorkFormTransformer, 'WorkForm');
    }

    /**
     * Include rank
     * @param  TransferDetail $transferDetail
     */
    public function includeRank(TransferDetail $transferDetail)
    {
        if (empty($transferDetail->rank)) {
            return;
        }

        return $this->item($transferDetail->rank, new RankTransformer, 'Rank');
    }

    /**
     * Include role
     * @param  TransferDetail $transferDetail
     */
    public function includeRole(TransferDetail $transferDetail)
    {
        if (empty($transferDetail->role)) {
            return;
        }

        return $this->item($transferDetail->role, new RoleTransformer, 'Role');
    }

    /**
     * Include role
     * @param  TransferDetail $transferDetail
     */
    public function includeOldRankPositionInformations(TransferDetail $transferDetail)
    {
        if (empty($transferDetail->oldRankPositionInformations)) {
            return;
        }

        return $this->item($transferDetail->oldRankPositionInformations, new RankPositionInformationTransformer, 'OldRankPositionInformation');
    }
}
