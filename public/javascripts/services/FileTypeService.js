app.service('filetype', function() {
    this.get = function (mime) {
        switch (true)
        {
            case (mime.indexOf("image/")>-1):
                return 'image';

                break;

            case (mime.indexOf("video/")>-1):
                return 'video';
                break;

            case (mime.indexOf('audio/') > -1):

                return 'audio';

                break;
            case (mime.indexOf('.docx') > -1):
            case (mime.indexOf('.doc') > -1):
            case (mime.indexOf('.xls') > -1):
            case (mime.indexOf('.xlsx  ') > -1):
            case (mime.indexOf('.pdf') > -1):
                return 'doc';
                break;
            default:
                return 'binary';
                break;
        }
    }
});