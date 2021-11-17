<!DOCTYPE>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
<style>
  @media  only screen and (max-width: 600px) {
    .inner-body {
      width: 100% !important;
    }

    .footer {
      width: 100% !important;
    }
  }

  @media  only screen and (max-width: 500px) {
    .button {
      width: 100% !important;
    }
  }
</style>

<table class="wrapper" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box;">
      <table class="content" width="100%" cellpadding="0" cellspacing="0" style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box; margin: 0; padding: 0; width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 100%;">
        <!-- Email Body -->
        <tr>
          <td class="body" width="100%" cellpadding="0" cellspacing="0" >
            <table class="inner-body" cellpadding="0" cellspacing="0" style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box; background-color: #FFFFFF; padding: 0; width: 570px; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 570px;">
              <!-- Body content -->
              <tr>
                <td class="content-cell" style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box;">
                  <p style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box; font-size: 13px; margin-top: 0; text-align: left;"><b>Xin chào {{$data['name']}},</b></p>
                  <p style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box; font-size: 13px; line-height: 1.5em; margin-top: 0; text-align: left;"><b>Bạn nhận được email này vì chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</b></p>
                  <p style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box; font-size: 13px; margin-top: 0; text-align: left;"><b>Vui lòng kích chọn vào đường dẫn dưới đây để thực hiện việc đặt lại mật khẩu:</b></p>
                  <p><a href="{{$data['url_reset']}}" style="font-family: Avenir, Helvetica, sans-serif;line-height: 1.5em; box-sizing: border-box; color: #3869D4;">Đặt lại mật khẩu</a></p>
                  <p style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box; font-size: 13px; margin-top: 0; text-align: left;"><b>Lưu ý:</b></p>
                  <p style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box; font-size: 13px; line-height: 1.5em; margin-top: 0; text-align: left;"><b>- Xin vui lòng không reply email này</b></p>
                  <p style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box; font-size: 13px; line-height: 1.5em; margin-top: 0; text-align: left;"><b>Trân trọng</b></p>
                  <p style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box; font-size: 13px; line-height: 1.5em; margin-top: 0; text-align: left;"><b><i>Hệ thống VMS</i></b></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
