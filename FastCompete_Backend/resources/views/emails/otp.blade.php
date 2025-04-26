<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
    <style>
        h2 {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        p {
            font-size: 16px;
            color: #555;
        }
    </style>
</head>
<body>
    <p>Dear User,</p>
    <p>Thank you for using our service. Your One-Time Password (OTP) for verifying your identity is:</p>
    <h2>{{ $otp }}</h2>
    <p>Please enter this OTP on the verification page to complete your process.</p>
    <br>
    <p>Best regards,</p>
    <p><strong>Expenzo</strong><br>
    <em>Providing secure and reliable services</em></p>
</body>
</html>
