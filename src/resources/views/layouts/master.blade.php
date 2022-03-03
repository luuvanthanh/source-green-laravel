<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>@yield('title', 'Calls') - Browser Calls</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="https://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- CSS -->
    <link rel="stylesheet" href="/css/app.css">
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    @yield('css')
</head>

<body>

    <nav class="navbar navbar-expand navbar-dark bg-dark">
        <a class="navbar-brand" href="/">Birchwood Bicycle Polo Co.</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('dashboard') }}">Support dashboard</a>
                </li>
            </ul>
        </div>
        </div>
    </nav>

    @yield('content')

    <footer class="container">
        <div class="row">
            <p class="p-2 flex-grow-1">&copy; Your Company 2020</p>
            @yield('footer')
        </div>
    </footer>

    <script src="/js/vendor.js"></script>

    @yield('javascript')

    <script src="{{env('SOCKET_URL')}}/socket.io/socket.io.js"></script>
    <!-- <script src="/js/socket.js">
        const socket = io("{{env('SOCKET_URL')}}", {
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            console.log('Connected', socket.id);
            socket.emit('subscribe', {
                channel: 'recevie-call',
            });
        });

        socket.on('recevie.call.event', (event, data) => {
            console.log(data, event, 'goiden');
            $("#call").addClass("show")
            $("#call").show();
        });

        socket.on('connect', () => {
            socket.emit('subscribe', {
                channel: 'out-going-call',
            });
        });

        socket.on('out.going.call.event', (event, data) => {
            console.log(data, event, 'goidi');
        });

        socket.on('connect', () => {
            socket.emit('subscribe', {
                channel: 'status-call',
            });
        });

        socket.on('status.call', (event, data) => {
            console.log(data)
        });
    </script> -->
    <script src="/js/manifest.js"></script>
    <script src="/js/browser-calls.js"></script>
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
</body>

</html>