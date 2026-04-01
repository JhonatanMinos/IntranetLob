<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body>
    @if(!empty($data['imagePath']))
        <img src="{{ $data['imagePath'] }}" width="300">
    @endif
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: sans-serif; color: #333;">
        <tr>
            <td style="padding: 20px; line-height: 1.6;">
                {!! $data['content'] !!}
            </td>
        </tr>
    </table>
</body>
</html>
