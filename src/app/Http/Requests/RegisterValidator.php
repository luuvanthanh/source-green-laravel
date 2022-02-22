<?php

namespace App\Http\Requests;

use CloudCreativity\LaravelJsonApi\Http\Requests\ValidatedRequest;

class RegisterValidator extends ValidatedRequest
{

    public function getType()
    {
        return 'users';
    }

    public function getResourceType()
    {
        return 'users';
    }

    /**
     * @inheritDoc
     */
    protected function authorize()
    {
        if (!$authorizer = $this->getAuthorizer()) {
            return;
        }

        $authorizer->create($this->getType(), $this->request);
    }

    /**
     * @inheritDoc
     */
    protected function validateQuery()
    {
        if ($validators = $this->getValidators()) {
            $this->passes(
                $validators->modifyQuery($this->query())
            );
        }
    }

    /**
     * @inheritDoc
     */
    protected function validateDocument()
    {
        $document = $this->decode();
        $validators = app()->make(\App\Http\Requests\RegisterValidator::class);
        /** If there is a decoded JSON API document, check it complies with the spec. */
        if ($document) {
            $this->validateDocumentCompliance($document, $validators);
        }

        /** Check the document is logically correct. */
        if ($validators) {
            $this->passes($validators->create($this->all()));
        }
    }

    /**
     * Validate the JSON API document complies with the spec.
     *
     * @param object $document
     * @param ValidatorFactoryInterface|null $validators
     */
    protected function validateDocumentCompliance($document, ?ValidatorFactoryInterface $validators): void
    {
        $this->passes(
            $this->factory->createNewResourceDocumentValidator(
                $document,
                $this->getResourceType(),
                $validators && $validators->supportsClientIds()
            )
        );
    }
}
