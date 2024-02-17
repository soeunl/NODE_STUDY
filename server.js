const http = require("http");
const PORT = 3000;
const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const server = http.createServer();

server.on("request", async (req, res) => {
  let filePath = path.join(
    __dirname,
    "views",
    req.url === "/" ? "index.html" : req.url
  );
  // let filePath = path.join(__dirname, "views", req.url === '/' ? 'index.html' : req.url+".html");

  let extname = path.extname(filePath);
  let contentType = "text/html; charset=utf-8";

  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".html":
      contentType = "text/html";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".jepg":
      contentType = "image/jepg";
      break;
    case ".gif":
      contentType = "image/gif";
      break;
  }

  // localhost:3000/
  // localhost:3000/create
  let content; // 요청된 파일을 읽어서 저장하기 위한 변수
  try {
    res.writeHead(200, { "Content-Type": contentType });

    if (req.url === "/" && req.method === "GET") {
      content = await fs.readFileSync(
        path.join(__dirname, "views", "index.html")
      );
      res.end(content);

      ///////////////////////////////////////////////////////////////////
    } else if (req.url.includes("css") && req.method === "GET") {
      content = await fs.readFileSync(
        path.join(__dirname, "views", "styles", "index.css")
      );
      res.end(content);

      ///////////////////////////////////////////////////////////////////
    } else if (
      extname.includes("jpg") ||
      extname.includes("png") ||
      (extname.includes("gif") && req.method === "GET")
    ) {
      content = await fs.readFileSync(filePath);
      // 이미지 확장자일때는 설정된 경로에서 읽어와 응답
      res.end(content);

      ///////////////////////////////////////////////////////////////////
    } else if (extname.includes("js") && req.method === "GET") {
      content = await fs.readFileSync(filePath);
      res.end(content);
    }

    ///////////////////////////////////////////////////////////////////
    // 주소표시줄에 요청 localhost:3000/subdir
    else if (req.url === "/subdir" && req.method == "GET") {
      content = fs.readFileSync(path.join(__dirname, "subdir", "subdir.html"));
      res.end(content);
    }

    ///////////////////////////////////////////////////////////////////
    // 주소표시줄에 요청 localhost:3000/kim
    else if (req.url === "/kim" && req.method == "GET") {
      const kim = [
        {
          firstname: "jemicom",
          phone: "010-1234-4567",
        },
      ];
      content = JSON.stringify(kim);
      res.end(content);
    }
    ///////////////////////////////////////////////////////////////////
    // 주소표시줄에 요청 localhost:3000/users
    else if (req.url === "/users" && req.method === "GET") {
      content = fs.readFileSync(
        path.join(__dirname, "datas", "users.json"),
        "utf-8"
      );
      res.end(content);
    }

    ///////////////////////////////////////////////////////////////////
    // :name 파라미터, params
    // 주소표시줄에 GET 요청 localhost:3000/name/:name/:phone/:addr
    // 주소표시줄에 GET 요청 localhost:3000/name/kim
    // 주소표시줄에 GET 요청 localhost:3000/name/park
    // 주소표시줄에 GET 요청 localhost:3000/name/you
    if (req.url.includes("name") && req.method === "GET") {
      const response = fs.readFileSync(
        path.join(__dirname, "datas", "users.json"),
        "utf-8"
      );

      const arys = JSON.parse(response); // js 배열로 변환

      const search = req.url.split("/");
      console.log("req.url : ", req.url, search[2]);

      const findName = arys.find((ary) => ary.name === search[2]);
      content = JSON.stringify(findName); // 결과 1개
      res.end(content);
    }

    ///////////////////////////////////////////////////////////////////
    // 요청의 종류 : GET, DELETE, POST, PUT
    // DELETE, POST, PUT 테스트 툴 : postman, insomnia, thunder client ...
    // 주소표시줄에 DELETE 요청 localhost:3000/name/:name/:phone/:addr
    // 주소표시줄에 DELETE 요청 localhost:3000/name/kim
    // 주소표시줄에 DELETE 요청 localhost:3000/name/park
    // 주소표시줄에 DELETE 요청 localhost:3000/name/you
    if (req.url.includes("name") && req.method === "DELETE") {
      const response = fs.readFileSync(
        path.join(__dirname, "datas", "users.json"),
        "utf-8"
      );
      const arys = JSON.parse(response); // js 배열로 변환
      const search = req.url.split("/"); //
      console.log("req.url : ", req.url, search[2]); // 지울 데이터 찾기

      const deletedUsers = arys.filter((ary) => ary.name !== search[2]);
      // 동일하지 않은 데이터만 리턴 : 삭제 효과

      // datas/users.json을 덮어쓰기
      await fs.writeFileSync(
        path.join(__dirname, "datas", "users.json"),
        JSON.stringify(deletedUsers, null, "  "),
        "utf-8",
        (err) => {
          //   if (err) throw err;
          console.log(err);
        }
      );

      res.end(JSON.stringify(deletedUsers));
    }

    ///////////////////////////////////////////////////////////////////
    // 요청의 종류 : GET, DELETE, POST, PUT
    // DELETE, POST, PUT 테스트 툴 : postman, insomnia, thunder client ...
    // 주소표시줄에 POST 요청 localhost:3000/user
    else if (req.url === "/user" && req.method === "POST") {
      //   console.log("post 처리");
      //   console.log(req.method, req.url);
      let body = "";
      let newUser = {};

      req.on("data", (chunk) => {
        body += chunk.toString();

        const { name, addr } = JSON.parse(body);
        //   {
        //     "name" : "html",
        //     "addr" : "서대문구"
        //   }
        // console.log(name, addr);

        newUser = { name, addr }; // 저장할 객체 만들기
        // console.log(newUser);

        const response = fs.readFileSync(
          path.join(__dirname, "datas", "users.json"),
          "utf-8"
        );
        const arys = JSON.parse(response);
        arys.push(newUser); // 배열에 추가

        // 추가한 배열을 datas/users.json을 덮어쓰기
        fs.writeFileSync(
          path.join(__dirname, "datas", "users.json"),
          JSON.stringify(arys, null, "  "),
          "utf-8",
          (err) => {
            //   if (err) throw err;
            console.log(err);
          }
        );

        res.end(JSON.stringify(newUser));
      });
    }

    ///////////////////////////////////////////////////////////////////
    // 요청의 종류 : GET, DELETE, POST, PUT
    // DELETE, POST, PUT 테스트 툴 : postman, insomnia, thunder client ...
    // 주소표시줄에 PUT 요청 localhost:3000/user
    else if (req.url === "/user" && req.method === "PUT") {
      //   console.log("post 처리");
      //   console.log(req.method, req.url);
      let body = "";
      let newUser = {};

      req.on("data", (chunk) => {
        body += chunk.toString();

        const { name, addr } = JSON.parse(body);
        newUser = { name, addr };

        const response = fs.readFileSync(
          path.join(__dirname, "datas", "users.json"),
          "utf-8"
        );
        const arys = JSON.parse(response);
        const filteredArys = arys.filter((ary) => ary.name !== name);
        // 삭제된 데이터

        filteredArys.push(newUser); // 수정된 데이터를 추가

        // 추가한 배열을 datas/users.json을 덮어쓰기
        fs.writeFileSync(
          path.join(__dirname, "datas", "users.json"),
          JSON.stringify(filteredArys, null, "  "),
          "utf-8",
          (err) => {
            //   if (err) throw err;
            console.log(err);
          }
        );

        res.end(JSON.stringify(newUser));
      });
    }
  } catch (err) {
    console.log(err);
  }
});

server.listen(PORT, () => {
  console.log("server start", PORT);
});