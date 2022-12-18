const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const { hex_md5 } = require("./md5");
const md5Key = "gdOpdztkcgv";
var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};


app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "root",
  database: "dappgame",
});

app.post("/create", (req, res) => {
  const name = req.body.name;
  const userip = req.ip.match(/\d+\.\d+\.\d+\.\d+/);
  if(userip == null){
    userip = '127.0.0.1';
  };
  const sign = req.body.sign;
  const serverSign = hex_md5(name + md5Key);
  if( sign != serverSign ) {
    res.send("signature is wrong");
    return;
  };

  db.query(
    //"INSERT INTO userinfo (Name) VALUES (?)",
    "CALL userlogin(?,?)",
    [name,userip],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("User login");
      }
    }
  );
});

app.post("/getconfig", (req, res) => {
  const name = req.body.name;
  const sign = req.body.sign;
  const serverSign = hex_md5(name + md5Key);
  if( sign != serverSign ) {
    res.send("signature is wrong");
    return;
  };

  db.query("SELECT Name,Value,NumValue FROM config ORDER BY IndexID",(err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/getlanguage", (req, res) => {
  var userip = req.ip.match(/\d+\.\d+\.\d+\.\d+/);
  if(userip == null){
    userip = '127.0.0.1';
  };
  const sign = req.body.sign;
  const serverSign = hex_md5(md5Key);
  if( sign != serverSign ) {
    res.send("signature is wrong");
    return;
  };

  db.query(
    "CALL getlanguage(?)",
    [userip],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/updatelanguage", (req, res) => {
  var userip = req.ip.match(/\d+\.\d+\.\d+\.\d+/);
  if(userip == null){
    userip = '127.0.0.1';
  };
  const lan = req.body.language;
  const sign = req.body.sign;
  const serverSign = hex_md5(String(lan)+md5Key);
  if( sign != serverSign ) {
    res.send("signature is wrong");
    return;
  };

  db.query(
    "CALL updatelanguage(?,?)",
    [userip,lan],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("update successful");
      }
    }
  );
});

app.post("/userbalance", (req, res) => {
  const name = req.body.name;
  const sign = req.body.sign;
  const serverSign = hex_md5(name + md5Key);
  if( sign != serverSign ) {
    res.send("signature is wrong");
    return;
  };

  db.query("SELECT Balance FROM userinfo WHERE name = ?",[name], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/userdeposit", (req, res) => {
  const name = req.body.name;
  const amount = req.body.amount;
  const sign = req.body.sign;
  const serverSign = hex_md5(name + String(amount) + md5Key);
  if( sign != serverSign ) {
    res.send("signature is wrong");
    return;
  };

  //db.query("UPDATE userinfo SET Balance=Balance+? WHERE name = ?",[amount, name], (err, result) => {
  db.query("CALL depositmoney(?,?)",[name, amount], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/userwithdraw", (req, res) => {
  const name = req.body.name;
  const amount = req.body.amount;
  const sign = req.body.sign;
  const serverSign = hex_md5(name + String(amount) + md5Key);
  if( sign != serverSign ) {
    res.send("signature is wrong");
    return;
  };

  //db.query("UPDATE userinfo SET Balance=Balance-? WHERE name = ?",[amount, name], (err, result) => {
  db.query("CALL withdrawmoney(?,?)",[name, amount], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/userbet", (req, res) => {
  const name = req.body.name;
  const amount = req.body.amount;
  const kind = req.body.kind;
  const memo = req.body.memo;
  const sign = req.body.sign;
  const serverSign = hex_md5(name + String(amount) + String(kind) + memo + md5Key);
  if( sign != serverSign ) {
    res.send("signature is wrong");
    return;
  };

  //db.query("UPDATE userinfo SET Balance=Balance-? WHERE name = ?",[amount, name], (err, result) => {
  db.query("CALL userbet(?,?,?,?)",[name, amount, kind, memo], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/userwin", (req, res) => {
  const name = req.body.name;
  const amount = req.body.amount;
  const tax = req.body.tax;
  const kind = req.body.kind;
  const memo = req.body.memo;
  const sign = req.body.sign;
  const serverSign = hex_md5(name + String(amount) + String(tax) + String(kind) + memo + md5Key);
  if( sign != serverSign ) {
    res.send("signature is wrong");
    return;
  };

  //db.query("UPDATE userinfo SET Balance=Balance+? WHERE name = ?",[amount, name], (err, result) => {
  db.query("CALL userwin(?,?,?,?,?)",[name, amount, tax, kind, memo], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/updatejackpot", (req, res) => {
  const amount = req.body.amount;
  const kind = req.body.kind;
  const sign = req.body.sign;
  const serverSign = hex_md5(String(amount) + String(kind) + md5Key);
  if( sign != serverSign ) {
    res.send("signature is wrong");
    return;
  };

  db.query("CALL updatejackpot(?,?)",[amount, kind], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/usermessage", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  const sign = req.body.sign;
  const serverSign = hex_md5(name + message + md5Key);
  if( sign != serverSign ) {
    res.send("signature is wrong");
    return;
  };

  db.query("INSERT INTO usermessage (Name, Message) VALUES (?,?)",[name, message], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(8080, () => {
  console.log("Yey, your server is running on port 8080");
});
