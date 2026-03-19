<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeFileRequest extends FormRequest
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
            'emergency_contact_name' => 'required|string',
            'emergency_contact_phone' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'emergency_contact_name.required'  => 'El nombre del contacto de emergencia es obligatorio.',
            'emergency_contact_name.max'       => 'El nombre no puede exceder 255 caracteres.',
            'emergency_contact_phone.required' => 'El teléfono del contacto de emergencia es obligatorio.',
            'emergency_contact_phone.max'      => 'El teléfono no puede exceder 15 caracteres.',
        ];
    }
}
