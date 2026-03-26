<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body>
    @if(!empty($data['imagePath']))
        <img src="{{ $data['imagePath'] }}" width="300">
    @endif
    <p>Gracias.</p>
</body>
</html>
