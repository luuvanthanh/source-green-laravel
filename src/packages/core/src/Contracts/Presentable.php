<?php
namespace GGPHP\Core\Contracts;

use Prettus\Repository\Contracts\PresenterInterface;

/**
 * Interface Presentable
 * @package GGPHP\Core\Contracts
 * @author Kun <nguyentruongthanh.dn@gmail.com>
 */
interface Presentable
{
    /**
     * @param PresenterInterface $presenter
     *
     * @return mixed
     */
    public function setPresenter(PresenterInterface $presenter);

    /**
     * @return mixed
     */
    public function presenter();

    /**
     * @return mixed
     */
    public function transformer();
}
