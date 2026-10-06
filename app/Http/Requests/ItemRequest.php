<?php

namespace App\Http\Requests;

use App\Enums\ItemStatus;
use App\Models\Item;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        $item = $this->route('item');

        return $item ? $this->user()->can('update', $item) : $this->user()->can('create', Item::class);
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:10000',
            'category_id' => 'required|exists:categories,id',
            'listing_type' => ['required', Rule::in(['sale', 'swap', 'both'])],
            'price' => 'nullable|required_unless:listing_type,swap|numeric|min:0|max:99999999.99|decimal:0,2',
            'status' => ['required', Rule::enum(ItemStatus::class)],
        ];
    }
}
