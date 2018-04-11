ffmpeg -f dshow -i  video="Vimicro USB Camera (Altair)" -c:v libx264 -preset superfast -tune zerolatency -c:a aac -ar 44100 -f flv rtmp://localhost:1935/live/dummy

 pause