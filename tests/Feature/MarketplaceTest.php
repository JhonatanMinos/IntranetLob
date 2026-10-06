<?php

use App\Models\Category;
use App\Models\Item;
use App\Models\User;
use App\Services\ItemService;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

function marketListing(User $user, array $attributes = []): Item
{
    return Item::create(array_merge(['user_id' => $user->id, 'category_id' => Category::firstOrCreate(['slug' => 'hogar'], ['name' => 'Hogar'])->id,
        'title' => 'Artículo', 'description' => 'Descripción', 'price' => 100, 'listing_type' => 'sale', 'status' => 'available'], $attributes));
}

it('lists marketplace articles even without a cover image', function () {
    $user = User::factory()->create();
    marketListing($user);
    marketListing($user, ['status' => 'draft']);
    $this->actingAs($user)->get(route('marketplace.index'))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('marketplaceLOB')->has('items.data', 1)->where('items.data.0.cover_url', null));
});

it('filters and sorts marketplace articles using the actual schema', function () {
    $user = User::factory()->create();
    marketListing($user, ['title' => 'Barato', 'price' => 20]);
    marketListing($user, ['title' => 'Caro', 'price' => 100]);
    marketListing($user, ['title' => 'Trueque', 'price' => null, 'listing_type' => 'swap']);
    $service = app(ItemService::class);
    expect($service->getMarketItems(['sort' => 'price_asc'])->pluck('title')->all())->toBe(['Barato', 'Caro', 'Trueque']);
    expect($service->getMarketItems(['payment_type' => 'swap'])->pluck('title')->all())->toBe(['Trueque']);
    expect($service->getMarketItems(['category' => 'hogar', 'payment_type' => 'money'])->total())->toBe(2);
    expect($service->getMarketItems(['search' => 'Barato'])->total())->toBe(1);
});

it('creates and updates listings only for the authenticated owner', function () {
    $user = User::factory()->create();
    $category = Category::create(['slug' => 'ropa', 'name' => 'Ropa']);
    $data = ['title' => 'Camisa', 'description' => 'Nueva', 'price' => 0, 'category_id' => $category->id, 'listing_type' => 'sale', 'status' => 'available', 'user_id' => 999];
    $this->actingAs($user)->post(route('my-items.store'), $data)->assertSessionHasNoErrors()->assertRedirect(route('my-items.index'));
    $item = Item::firstOrFail();
    expect($item->user_id)->toBe($user->id);
    $this->get(route('my-items.edit', $item))->assertOk();
    $data['title'] = 'Camisa actualizada';
    $this->put(route('my-items.update', $item), $data)->assertSessionHasNoErrors()->assertRedirect();
    expect($item->refresh()->title)->toBe('Camisa actualizada');
    $this->actingAs(User::factory()->create())->get(route('my-items.edit', $item))->assertForbidden();
    $this->putJson(route('my-items.update', $item), $data)->assertForbidden();
    $this->delete(route('my-items.destroy', $item))->assertForbidden();
    $this->actingAs($user)->delete(route('my-items.destroy', $item))->assertRedirect();
    $this->assertDatabaseMissing('items', ['id' => $item->id]);
});

it('validates listing price and category', function () {
    $this->actingAs(User::factory()->create())->postJson(route('my-items.store'), ['title' => 'Artículo', 'description' => 'Texto', 'category_id' => 999, 'listing_type' => 'sale', 'price' => -1, 'status' => 'available'])
        ->assertUnprocessable()->assertJsonValidationErrors(['category_id', 'price']);
});

it('shows only the authenticated users listings', function () {
    $owner = User::factory()->create();
    marketListing($owner);
    marketListing(User::factory()->create());
    $this->actingAs($owner)->get(route('my-items.index'))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('items.data', 1)->where('items.data.0.user_id', $owner->id));
});
