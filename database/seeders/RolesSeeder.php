<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Role::firstOrCreate(['name' => 'sa']);
        Role::firstOrCreate(['name' => 'rh']);
        Role::firstOrCreate(['name' => 'user']);

        $permissions = [
            'view users',
            'create user',
            'update user',
            'delete user',
            'view shops',
            'create shop',
            'update shop',
            'delete shop',
            'view services',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        $sa = Role::findByName('sa');
        $rh = Role::findByName('rh');
        $empleado = Role::findByName('user');

        $sa->givePermissionTo(Permission::all());

        $rh->givePermissionTo(['view users', 'create user', 'update user', 'delete user', 'view shops', 'create shop', 'update shop', 'delete shop', 'view services']); // RH permisos especiales

        $empleado->givePermissionTo(['view users',  'view shops', 'view services']);
    }
}
