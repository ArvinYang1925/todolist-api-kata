const http = require("http"); // Node.js 模組
const { v4: uuidv4 } = require("uuid"); // npm 安裝的套件
const errorHandle = require("./errorHandle.js"); // 自定義模組
const todos = [];

const server = http.createServer((req, res) => {
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET, OPTIONS, DELETE",
    "Content-Type": "application/json",
  };

  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  if (req.url == "/todos" && req.method == "GET") {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        data: todos,
      })
    );
    res.end();
  } else if (req.url == "/todos" && req.method == "POST") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        if (title != undefined) {
          const todo = {
            title: title,
            id: uuidv4(),
          };
          todos.push(todo);
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: "success",
              data: todo,
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (req.url == "/todos" && req.method == "DELETE") {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        data: todos,
      })
    );
    res.end();
  } else if (req.url.startsWith("/todos/") && req.method == "DELETE") {
    const id = req.url.split("/").pop();
    const index = todos.findIndex((element) => element.id == id);
    console.log(id, index);
    if (index !== -1) {
      todos.splice(index, 1); // 刪除單筆待辦事項
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          data: todos,
        })
      );
      res.end();
    } else {
      errorHandle(res);
    }
  } else if (req.url.startsWith("/todos/") && req.method == "PATCH") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        const id = req.url.split("/").pop();
        const index = todos.findIndex((element) => element.id == id);

        if(title !== undefined && index != -1) {
          todos[index].title = title; // 更新單筆待辦事項
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: "success",
              data: todos
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch {
        errorHandle(res);
      }
    });

    //
  } else if (req.method == "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "false",
        message: "404 Not Found : )",
      })
    );
    res.end();
  }
});

const PORT = 3005;
server.listen(process.env.PORT || PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
