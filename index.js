const express = require('express');
var cors = require('cors')
const bodyParser = require("body-parser");
const fs = require('fs');

const multer = require('multer')


var app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '50mb' }));


let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let exArr = file.originalname.split('.');
    let extension = exArr[exArr.length - 1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + extension)
  }
})
const upload = multer({ storage: storage })

// file upload code
app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file)

})

// file read code
app.post('/getFileContent', (req, res) => {
  let filePath = req.body.path;
  fs.exists(filePath, function (doesExist) {
    if (doesExist) {
      console.log('file exists');

      fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
          let csv = "";
          for (var index1 in data) {
            var row = data[index1];
             
            // Row is the row of array at index "index1"
            var string = "";
             
            // Empty string which will be added later
            for (var index in row) {
              // Traversing each element in the row
              var w = row[index];
               
              // Adding the element at index "index" to the string
              string += w;
              if (index != row.length - 1) {
                string += ",";
                // If the element is not the last element , then add a comma
              }
            }
            string += "\n";
             
            // Adding next line at the end
            csv += string;
            // adding the string to the final string "csv"
          }
            console.log('received data: ' + csv);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        } else {
            console.log(err);
        }
    });

    } else {
      console.log('file not found!');
    }
  });

  // const file = req.file
  // if (!file) {
  //   const error = new Error('Please upload a file')
  //   error.httpStatusCode = 400
  //   return next(error)
  // }
  // res.send(file)

})
// module.exports = app;

app.listen(3000);
