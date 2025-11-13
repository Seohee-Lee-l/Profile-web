<meta charset='utf-8'>

<?php
    if($_POST) {
        $name=$_POST['name'];
        $email=$_POST['email'];
        $message=$_POST['message'];

        include "dbconn.php";
        
        if($connect) {
            mysqli_query($connect, 'set names utf8');
            
            $name=mysqli_real_escape_string($connect, $name);
            $email=mysqli_real_escape_string($connect, $email);
            $message=mysqli_real_escape_string($connect, $message);

            $sql="INSERT INTO message (name, email, message) VALUES ('$name', '$email', '$message')";
              if(mysqli_query($connect, $sql)) {
                echo "
                    <script>
                        window.alert('메시지가 전송되었습니다. Your message has been sent.');
                        location.href='contact.html';
                    </script>
                ";
            } else {
                $error = mysqli_error($connect);
                echo "
                    <script>
                        window.alert('전송 중 오류가 발생했습니다: " . addslashes($error) . " An error occurred while sending your message');
                        history.back();
                    </script>
                ";
            }
            mysqli_close($connect);
        } else {
            echo "
                <script>
                    window.alert('데이터베이스 연결 실패');
                    history.back();
                </script>
            ";
        }
    } else {
        echo "
            <script>
                window.alert('잘못된 접근입니다.');
                location.href='contact.html';
            </script>
        ";
    }
?>
