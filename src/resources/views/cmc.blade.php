<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <style>
        .info {
            border: 1px #ccc solid;
            padding: 5px;
        }
    </style>
    <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
</head>

<body>
    <audio id="player" autoplay></audio>
    <audio id="ringbacktone" type="audio/m4a" loop src="./sipjs/ringbacktone.m4a"></audio>
    <div class="info">
        <table>
            <tbody>
                <tr>
                    <td colspan="2">
                        <b>Thông tin máy lẻ:</b>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="input-username" type="text" name="username" placeholder="Tài khoản" value="23388" />
                        <input id="input-password" type="text" name="password" placeholder="Mật khẩu" value="crm@cmc2018" />
                        <input id="input-hostname" type="text" name="hostname" placeholder="Host name" value="kam-01.api-connect.io" />
                        <input id="input-port" type="text" name="port" placeholder="Port" value="7443" />
                        <input id="input-path" type="text" name="path" placeholder="Path" />
                        <input id="button-register" type="button" value="Đăng ký" onclick="handlePageLoad()" />
                    </td>
                </tr>
                <tr>
                    <td>
                        Trạng thái:
                    </td>
                    <td>
                        <span id="ua-status"></span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="info">
        <table>
            <tbody>
                <tr>
                    <td colspan="2">
                        <b>Thông tin cuộc gọi:</b>
                    </td>
                </tr>
                <tr>
                    <td>
                        Máy lẻ:
                    </td>
                    <td>
                        <span id="extension-username"></span>
                    </td>
                </tr>
                <tr>
                    <td>
                        Loại cuộc gọi:
                    </td>
                    <td>
                        <span id="call-type"></span>
                    </td>
                </tr>
                <tr>
                    <td>
                        Số điện thoại
                    </td>
                    <td>
                        <span id="call-phone"></span>
                    </td>
                </tr>
                <tr>
                    <td>
                        Trạng thái:
                    </td>
                    <td>
                        <span id="call-status"></span>(<span id="session-status"></span>)
                    </td>
                </tr>
                <tr>
                    <td>
                        Call-id:
                    </td>
                    <td>
                        <span id="call"></span>(<span id="call-id"></span>)
                    </td>
                </tr>
                <tr>
                    <td>
                        Thời lượng:
                    </td>
                    <td>
                        <span id="call-duration"></span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="input-phone" type="text" name="phone" placeholder="Số điện thoại" value="0358062034" />
                        <input id="button-call" type="button" value="Gọi" onclick="handleButtonCallClick()" />
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <input id="button-answer" type="button" value="Trả lời" onclick="handleButtonAnswerClick()" style="display:none" />
                        <input id="button-hangup" type="button" value="Kết thúc" onclick="handleButtonHangupClick()" style="display:none" />
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <input id="input-phone-transfer" type="text" name="phone" placeholder="Số điện thoại" style="display:none" />
                        <input id="button-transfer" type="button" value="Chuyển tiếp" onclick="handleButtonTransferClick()" style="display:none" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <script src="{{env('SOCKET_URL')}}/socket.io/socket.io.js"></script>
    <script>
        const socket = io("{{env('SOCKET_URL')}}", {
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            console.log('Connected', socket.id, 'anhmv');
            socket.emit('subscribe', {
                channel: 'receive-call',
            });
        });

        socket.on('receive.call.event', (event, data) => {
            console.log(data, event, 'goiden');
        });
    </script>
    <script src="https://sipjs.com/download/sip-0.15.1.min.js"></script>
    <!-- <script src="/sipjs/js/sip-0.15.1.min.js"></script> -->
    <script src="/sipjs/ua.js"></script>
    <!-- <script src="https://voice.cmctelecom.vn/sipjs/ua.js"></script> -->

</body>

</html>