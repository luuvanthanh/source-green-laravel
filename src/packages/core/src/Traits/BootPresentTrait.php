<?php

namespace GGPHP\Core\Traits;

use Illuminate\Support\Arr;
use Prettus\Repository\Contracts\PresenterInterface;

trait BootPresentTrait {

    /**
     * @var PresenterInterface
     */
    protected $presenter = null;

    /**
     * @param \Prettus\Repository\Contracts\PresenterInterface $presenter
     *
     * @return $this
     */
    public function setPresenter(PresenterInterface $presenter)
    {
        $this->presenter = $presenter;

        return $this;
    }

    /**
     * @param \Prettus\Repository\Contracts\PresenterInterface $presenter
     *
     * @return $this
     */
    public function getPresenter()
    {
        if (!$this->presenter instanceof PresenterInterface) {
            $this->presenter = new $this->presenter;

            return $this->presenter;
        }
        return $this->presenter;
    }

    /**
     * @param      $key
     * @param null $default
     *
     * @return mixed|null
     */
    public function present($key, $default = null)
    {
        if ($this->hasPresenter()) {
            $data = $this->presenter()['data'];

            return Arr::get($data, $key, $default);
        }

        return $default;
    }

    /**
     * @return bool
     */
    protected function hasPresenter()
    {
        return isset($this->presenter) && $this->presenter instanceof PresenterInterface;
    }

    /**
     * @return $this|mixed
     */
    public function presenter()
    {
        if ($this->hasPresenter()) {
            return $this->presenter->present($this);
        }

        return $this;
    }

    /**
     * @return $this|mixed
     */
    public function transformer()
    {
        if ($this->getPresenter()) {
            return $this->presenter->getTransformer();
        }

        return $this;
    }
}
