<?php

use App\Models\EmployeeFile;
use App\Models\Notification;
use App\Models\PayRollFiles;
use App\Models\User;
use App\Services\EmployeeFileService;
use Database\Seeders\RolesSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->withoutVite();
    $this->seed(RolesSeeder::class);
    Storage::fake('local');
    Storage::fake('public');
});

function employeeExpedient(User $user): EmployeeFile
{
    return app(EmployeeFileService::class)->ensureForUser($user);
}

it('denies access to another employees expedient and documents', function () {
    $file = employeeExpedient(createUserWithRole('user'));
    $this->actingAs(createUserWithRole('user'))->get(route('employeeFiles.show', $file))->assertForbidden();
    $this->get(route('employeeFiles.download', [$file, 'ine']))->assertForbidden();
});

it('allows the owner and HR to view an expedient', function () {
    $owner = createUserWithRole('user');
    $file = employeeExpedient($owner);
    $this->actingAs($owner)->get(route('employeeFiles.show', $file))->assertOk();
    $this->actingAs(createUserWithRole('rh'))->get(route('employeeFiles.show', $file))->assertOk();
});

it('prevents employees from approving their own documents', function () {
    $owner = createUserWithRole('user');
    $file = employeeExpedient($owner);
    $this->actingAs($owner)->putJson(route('employeeFiles.updateStatus', $file), ['type' => 'ine', 'status' => 'approved'])->assertForbidden();
    expect($file->refresh()->documents['ine']['status'])->toBe('pending');
    $this->actingAs(createUserWithRole('rh'))->putJson(route('employeeFiles.updateStatus', $file), ['type' => 'ine', 'status' => 'approved'])->assertRedirect();
    expect($file->refresh()->documents['ine']['status'])->toBe('approved');
});

it('validates document types and uploads', function () {
    $owner = createUserWithRole('user');
    $file = employeeExpedient($owner);
    $this->actingAs($owner)->putJson(route('employeeFiles.updateDocument', $file), ['type' => '../other'])->assertUnprocessable()->assertJsonValidationErrors(['type', 'document']);
    $this->putJson(route('employeeFiles.updateDocument', $file), ['type' => 'ine', 'document' => UploadedFile::fake()->create('code.php', 1, 'application/x-php')])->assertUnprocessable()->assertJsonValidationErrors('document');
    $this->putJson(route('employeeFiles.updateDocument', $file), ['type' => 'ine', 'document' => UploadedFile::fake()->create('ine.pdf', 10241, 'application/pdf')])->assertUnprocessable();
});

it('uploads and downloads documents privately and resets approval', function () {
    $owner = createUserWithRole('user');
    $file = employeeExpedient($owner);
    $this->actingAs($owner)->put(route('employeeFiles.updateDocument', $file), ['type' => 'ine', 'document' => UploadedFile::fake()->create('ine.pdf', 10, 'application/pdf')])->assertRedirect();
    $path = $file->refresh()->documents['ine']['path'];
    Storage::disk('local')->assertExists($path);
    Storage::disk('public')->assertMissing($path);
    $this->get(route('employeeFiles.download', [$file, 'ine']))->assertDownload();
});

it('updates the selected expedient rather than the HR users expedient', function () {
    $file = employeeExpedient(createUserWithRole('user'));
    $this->actingAs(createUserWithRole('rh'))->put(route('employeeFiles.update', $file), ['emergency_contact_name' => 'Contacto', 'emergency_contact_phone' => '5551234567'])->assertRedirect();
    expect($file->refresh()->emergency_contact_name)->toBe('Contacto');
});

it('denies employees access to payroll administration and other employees receipts', function () {
    $target = User::factory()->create();
    $payroll = PayRollFiles::create(['user_id' => $target->id, 'file_path' => 'payroll/receipt.pdf', 'original_name' => 'receipt.pdf', 'mime_type' => 'application/pdf', 'file_size' => 1, 'processed' => true]);
    $this->actingAs(createUserWithRole('user'))->get(route('payroll.index'))->assertForbidden();
    $this->get(route('payroll.create', $target))->assertForbidden();
    $this->get(route('payroll.download', $payroll))->assertForbidden();
    $this->delete(route('payroll.destroy', $payroll))->assertForbidden();
    $this->postJson(route('payroll.store'), ['user_id' => $target->id, 'file' => UploadedFile::fake()->create('test.pdf', 1, 'application/pdf')])->assertForbidden();
});

it('allows HR to upload PDF payrolls and owners to download them', function () {
    $owner = createUserWithRole('user');
    $this->actingAs(createUserWithRole('rh'))->post(route('payroll.store'), ['user_id' => $owner->id, 'file' => UploadedFile::fake()->create('receipt.pdf', 10, 'application/pdf')])->assertSessionHasNoErrors()->assertRedirect(route('payroll.index'));
    $file = PayRollFiles::firstOrFail();
    expect($file->processed)->toBeTrue();
    $this->actingAs($owner)->get(route('payroll.download', $file))->assertDownload('receipt.pdf');
    $this->actingAs(createUserWithRole('rh'))->delete(route('payroll.destroy', $file))->assertRedirect();
    Storage::disk('local')->assertMissing($file->file_path);
    $this->assertDatabaseMissing('payroll_files', ['id' => $file->id]);
});

it('rejects missing payroll files with a 404', function () {
    $owner = createUserWithRole('user');
    $file = PayRollFiles::create(['user_id' => $owner->id, 'file_path' => 'payroll/missing.pdf', 'original_name' => 'missing.pdf', 'mime_type' => 'application/pdf', 'file_size' => 1]);
    $this->actingAs($owner)->get(route('payroll.download', $file))->assertNotFound();
});

it('rejects imported payroll paths outside the configured scan folder', function () {
    $owner = createUserWithRole('user');
    config(['payroll.scan_folder' => storage_path('app/private/payroll-import')]);
    $file = PayRollFiles::create(['user_id' => $owner->id, 'file_path' => '/tmp', 'original_name' => 'intranet-pest.txt', 'mime_type' => 'application/pdf', 'file_size' => 1]);
    $this->actingAs($owner)->get(route('payroll.download', $file))->assertNotFound();
});

it('denies document management to employees', function () {
    $this->actingAs(createUserWithRole('user'))->postJson('/processes/upload', ['path' => 'sistemas-de-calidad', 'file' => UploadedFile::fake()->create('test.pdf', 1, 'application/pdf')])->assertForbidden();
    $this->postJson(route('processes.store'), ['path' => 'sistemas-de-calidad', 'name' => 'carpeta'])->assertForbidden();
    $this->deleteJson('/processes/delete', ['path' => 'sistemas-de-calidad/test.pdf', 'type' => 'file'])->assertForbidden();
});

it('limits process uploads and deletions to the document folder', function () {
    $this->actingAs(createUserWithRole('sa'));
    $this->postJson('/processes/upload', ['path' => 'avatars', 'file' => UploadedFile::fake()->create('test.pdf', 1, 'application/pdf')])->assertUnprocessable();
    Storage::disk('public')->put('avatars/photo.png', 'photo');
    $this->deleteJson('/processes/delete', ['path' => 'avatars/photo.png', 'type' => 'file'])->assertUnprocessable();
    $this->deleteJson('/processes/delete', ['path' => 'sistemas-de-calidad', 'type' => 'folder'])->assertUnprocessable();
    $this->postJson(route('processes.store'), ['path' => 'sistemas-de-calidad', 'name' => '../other'])->assertUnprocessable();
    $this->postJson('/processes/upload', ['path' => 'sistemas-de-calidad/../avatars', 'file' => UploadedFile::fake()->create('test.pdf', 1, 'application/pdf')])->assertUnprocessable();
    Storage::disk('public')->assertExists('avatars/photo.png');
});

it('allows administrators to manage document folders and files', function () {
    $this->actingAs(createUserWithRole('sa'))->post(route('processes.store'), ['path' => 'sistemas-de-calidad', 'name' => 'manuales'])->assertSessionHasNoErrors()->assertRedirect();
    $this->post('/processes/upload', ['path' => 'sistemas-de-calidad/manuales', 'file' => UploadedFile::fake()->create('manual.pdf', 1, 'application/pdf')])->assertRedirect();
    $path = Storage::disk('public')->files('sistemas-de-calidad/manuales')[0];
    $this->delete('/processes/delete', ['path' => $path, 'type' => 'file'])->assertRedirect();
    Storage::disk('public')->assertMissing($path);
});

it('sanitizes previously stored HTML as well as new HTML', function () {
    $notice = Notification::factory()->create();
    $attack = '<p>Texto <strong>válido</strong></p><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">Link</a><svg onload="alert(1)"></svg><script>alert(1)</script>';
    DB::table('notifications')->where('id', $notice->id)->update(['content' => $attack]);
    expect($notice->fresh()->content)->toContain('<strong>válido</strong>')->not->toContain('onerror', 'javascript:', '<svg', '<script');
});

it('allows different employees to upload receipts with the same filename', function () {
    $hr = createUserWithRole('rh');
    $this->actingAs($hr);
    foreach ([createUserWithRole('user'), createUserWithRole('user')] as $owner) {
        $this->post(route('payroll.store'), ['user_id' => $owner->id, 'file' => UploadedFile::fake()->create('receipt.pdf', 1, 'application/pdf')])->assertSessionHasNoErrors()->assertRedirect();
    }
    expect(PayRollFiles::where('original_name', 'receipt.pdf')->count())->toBe(2);
});
