<?php

namespace App\Http\Requests;

use App\Models\PayRollFiles;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePayrollRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', PayRollFiles::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file' => 'required|file|mimes:pdf|max:102400',
            'user_id' => 'required|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'El archivo PDF es obligatorio',
            'file.mimes' => 'El archivo debe ser PDF',
            'file.max' => 'El archivo no debe superar 100MB',
            'user_id.required' => 'Debes seleccionar un usuario',
            'user_id.exists' => 'El usuario no existe',
        ];
    }
}
