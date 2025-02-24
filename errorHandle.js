function errorHandle(res) {

    const headers = {
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, Content-Length, X-Requested-With",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PATCH, POST, GET, OPTIONS, DELETE",
        "Content-Type": "application/json",
      };
    
    res.writeHead(400, headers);
    res.write(
      JSON.stringify({
        status: "fail",
        data: "傳送資料格式錯誤，或 todo id 填寫錯誤：（ ",
      })
    );
    res.end();

}

module.exports = errorHandle;