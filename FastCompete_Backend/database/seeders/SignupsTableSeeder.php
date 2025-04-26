<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SignupsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('signups')->insert([
            'id' => 1,
            'username' => 'n',
            'email' => 'ksam2473@gmail.com',
          'password' => Hash::make('usman'), 
            'status' => 'verified',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
