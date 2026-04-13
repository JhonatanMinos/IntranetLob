<?php

namespace App\Repositories\Contracts;

interface RepositoryInterface
{
    public function all();
    public function find(int $id);
    public function create(array $data);
    public function update($model, array $data);
    public function delete($model);
}