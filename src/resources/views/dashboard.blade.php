<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Dashboard Incoming Voice Calls</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">

    <!-- Styles -->
    <style>
        html,
        body {
            background-color: #fff;
            color: #636b6f;
            font-family: 'Nunito', sans-serif;
            font-weight: 200;
            height: 100vh;
            margin: 0;
            Padding: 15px;
        }

        .container {
            max-width: 600px;
            margin: 100px auto;
        }
    </style>
</head>

<body>
    <div class="container">
        <table class="table">
            <thead>
                <tr>
                    <th>CallSid</th>
                    <th>From</th>
                    <th>To</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://media.twiliocdn.com/sdk/js/sync/releases/2.0.1/twilio-sync.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>
    <script>
        $('document').ready(function() {
            fetchAccessToken(initializeSyncClient)
        });

        function fetchAccessToken(handler) {
            $.getJSON('/token?username=dotun', function(data) {
                handler(data);
            });
        }

        function initializeSyncClient(tokenResponse) {
            var syncClient = new Twilio.Sync.Client(tokenResponse.token)

            syncClient.list('twilio_incoming_voice_calls').then(function(list) {
                list.getItems().then(function(pages) {
                    for (const page of pages.items) {
                        const data = page.data;
                        addRowToTable(data);
                    }
                });

                list.on('itemAdded', function(pages) {
                    const data = pages.item.data;
                    addRowToTable(data);
                });
            });
        }

        function addRowToTable(data) {
            const markup = `<tr><td>${data.callSid}</td><td>${data.from}</td><td>${data.to}</td></tr>`
            $("table tbody").append(markup)
            return;
        }
    </script>

</body>

</html>