<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'employeeNumber' => 'required|string',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'string',
                Password::min(8),        // al menos un carácter especial
            ],
            'position' => 'required|string',
            'birthday' => 'required|date',
            'dateEntry' => 'required|date',
            'phone' => 'nullable|string',
            'department_id' => 'required|exists:departments,id',
            'store_id' => 'nullable|exists:stores,id',
            'company_id' => 'required|exists:companies,id',
        ];
    }
}
