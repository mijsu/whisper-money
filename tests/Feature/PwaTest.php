<?php

test('service worker exists', function () {
    expect(file_exists(public_path('sw.js')))->toBeTrue();
});

test('web manifest has standalone display and valid start url', function () {
    $manifest = json_decode(file_get_contents(public_path('favicon/site.webmanifest')), true);

    expect($manifest['display'])->toBe('standalone')
        ->and($manifest['start_url'])->toBe('/')
        ->and($manifest['scope'])->toBe('/');
});

test('app template includes pwa meta tags and service worker registration', function () {
    $response = $this->get('/');

    $response->assertStatus(200)
        ->assertSee('apple-mobile-web-app-capable', false)
        ->assertSee('apple-mobile-web-app-status-bar-style', false)
        ->assertSee('content="default"', false)
        ->assertDontSee('black-translucent', false)
        ->assertSee('serviceWorker', false)
        ->assertSee("navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch", false)
        ->assertSee('viewport-fit=cover', false)
        ->assertSee("try {\n                    chartScheme = localStorage.getItem('chart-color-scheme')", false);
});
