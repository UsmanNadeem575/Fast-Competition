<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ChangePassword extends Mailable
{
    use Queueable, SerializesModels;

    public $generating_otp;
    public function __construct($generating_otp)
    {
        $this->generating_otp = $generating_otp;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Change Password',
        );
    }


    public function content(): Content
    {
        return new Content(
            view: 'emails.change_password',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
