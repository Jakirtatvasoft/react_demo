<?php
  return [
    'defaults' => [
      'guard' => 'api',
      'passwords' => 'users',
    ],
    'guards' => [
      'api' => [
        'driver' => 'passport',
        'provider' => 'users',
      ],
    ],
    'providers' => [
      'users' => [
        'driver' => 'eloquent',
        'model' => \App\Models\User::class // Change this path with your user model path
      ]
    ]
  ];