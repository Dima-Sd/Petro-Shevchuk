<?php
// функция mail() в PHP часто не работает "из коробки" на многих хостингах или письма улетают в спам без настроенного SPF/DKIM. Если после теста письма не приходят — дело не в этом коде, а в конфигурации почты на сервере, это отдельная тема (обычно решается через SMTP-библиотеку типа PHPMailer вместо голого mail()

// Настройки
$admin_email = "alexledovit@gmail.com"; // ← сюда писать свой почтовый ящик
$project_name = "Restauracja - Rezerwacja";
$form_subject = "Nowa rezerwacja stolika";

// Проверка метода
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(["status" => "error", "message" => "Metoda niedozwolona"]);
  exit;
}

// ------- ПОЛУЧЕНИЕ И ВАЛИДАЦИЯ ДАННЫХ -------
$name   = htmlspecialchars(trim($_POST["name"] ?? ""));
$phone  = htmlspecialchars(trim($_POST["phone"] ?? ""));
$guests = htmlspecialchars(trim($_POST["guests"] ?? ""));
$time   = htmlspecialchars(trim($_POST["time"] ?? ""));
$date   = htmlspecialchars(trim($_POST["date"] ?? ""));

$errors = [];

if ($name === "" || mb_strlen($name) < 3) {
  $errors[] = "Imię i nazwisko jest nieprawidłowe";
}

$phoneDigits = preg_replace('/\D/', '', $phone);
if (mb_strlen($phoneDigits) < 9 || mb_strlen($phoneDigits) > 13) {
  $errors[] = "Numer telefonu jest nieprawidłowy";
}

if (!ctype_digit($guests) || (int)$guests < 1 || (int)$guests > 50) {
  $errors[] = "Liczba osób jest nieprawidłowa";
}

if (!preg_match('/^\d{2}:\d{2}$/', $time)) {
  $errors[] = "Nieprawidłowy format czasu";
}

if (!preg_match('/^\d{2}\.\d{2}\.\d{4}$/', $date)) {
  $errors[] = "Nieprawidłowy format daty";
}

if (!empty($errors)) {
  http_response_code(422);
  echo json_encode(["status" => "error", "message" => implode(", ", $errors)]);
  exit;
}

// ------- ФОРМИРУЕМ HTML ПИСЬМО -------
$email_body = "
<h2>Nowa rezerwacja stolika</h2>
<table style='border-collapse: collapse; width: 100%;'>
    <tr><td><b>Imię i nazwisko:</b></td><td>$name</td></tr>
    <tr><td><b>Telefon:</b></td><td>$phone</td></tr>
    <tr><td><b>Liczba osób:</b></td><td>$guests</td></tr>
    <tr><td><b>Data:</b></td><td>$date</td></tr>
    <tr><td><b>Godzina:</b></td><td>$time</td></tr>
</table>
";

// ------- ЗАГОЛОВКИ И ОТПРАВКА -------
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=\"utf-8\"\r\n";
$headers .= "From: " . adopt($project_name) . " <{$admin_email}>\r\n";

// Лог на всякий случай (для отладки/резервной копии заявок)
file_put_contents("reservations_log.txt", date("Y-m-d H:i:s") . " | " . print_r($_POST, true) . "\n", FILE_APPEND);

$sent = mail($admin_email, adopt($form_subject), $email_body, $headers);

echo json_encode([
  "status"  => $sent ? "success" : "error",
  "message" => $sent ? "Rezerwacja została wysłana!" : "Błąd podczas wysyłania wiadomości."
]);

// Кодировка заголовков
function adopt($text)
{
  return '=?UTF-8?B?' . base64_encode($text) . '?=';
}
