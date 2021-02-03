'use strict';

var _ = require('lodash');
var db = require('../../config/mysql')
var moment = require('moment');
var request = require('request');
const fs = require('fs');
const path = require('path')

const AWS = require('aws-sdk');
const formidable = require('formidable');
const projectPath = "./client/files/";
const projectAdsPath = "./client/ads/";
const projectGamesPath = "./client/games/";
const projectTravelsPath = "./client/travels/";
const compressedAdsPath = "./client/compressed_ads/";
const { exec } = require('child_process');
const { fieldSize } = require('tar');
const s3_details = {
  "accessKeyId": "AKIAQROCQCOGH7Y3RUEG",
  "secretAccessKey": "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",
  "region": "ap-southeast-1",
  "bucket": "mobisign-bucket/Spicejet_Panel_Upload",
}

const s3Client = new AWS.S3({
  accessKeyId: s3_details.accessKeyId,
  secretAccessKey: s3_details.secretAccessKey,
});

const axios = require('axios').default;

// Get list of Json data
var vuscreen_getAllJsonData_Pagination = function (req, cb) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
  var filter = '';
  // custom filters
  if (req.query.category_id && req.query.folder_id && req.query.status) {
    filter = " AND C.id IN (" + req.query.category_id + ") AND A.folder_id IN (" + req.query.folder_id + ") AND A.status ='" + req.query.status + "'"
  } else if (req.query.folder_id && req.query.status) {
    filter = " AND A.folder_id IN (" + req.query.folder_id + ") AND A.status ='" + req.query.status + "'"
  } else if (req.query.category_id && req.query.status) {
    filter = " AND C.id IN (" + req.query.category_id + ") AND A.status ='" + req.query.status + "'"
  } else if (req.query.category_id && req.query.folder_id) {
    filter = " AND C.id IN (" + req.query.category_id + ") AND A.folder_id IN (" + req.query.folder_id + ")"
  } else if (req.query.status) {
    filter = " AND A.status ='" + req.query.status + "'"
  } else if (req.query.folder_id) {
    filter = " AND A.folder_id IN (" + req.query.folder_id + ")"
  } else if (req.query.category_id) {
    filter = " AND C.id IN (" + req.query.category_id + ")"
  }
  // only search filters
  if (req.query.language) { filter = " AND A.language ='" + req.query.language + "'" }
  if (req.query.genre) { filter = " AND A.genre ='" + req.query.genre + "'" }
  if (req.query.title) { filter = " AND A.title ='" + req.query.title + "'" }
  if (req.query.content_id) { filter = " AND A.content_id ='" + req.query.content_id + "'" }

  let query = "SELECT conf_value"
    + " FROM server_configurations"
    + " WHERE conf_key='FOLDER_ID'"
  db.get().query(query, function (err, doc) {
    if (err) { return err; }
    let folder_id = doc[0].conf_value
    let query1 = "SELECT conf_value"
      + " FROM server_configurations"
      + " WHERE conf_key='CATEGORY_ID'"
    db.get().query(query1, function (err1, doc1) {
      if (err1) { return err1; }
      let category_id = doc1[0].conf_value
      let currentTimestamp = new Date().getTime();
      var query2 = "SELECT "
        + " A.*,"
        + " B.id AS folder_id,"
        + " B.folder AS folder_name,"
        + " B.view AS folder_view,"
        + " B.position AS folder_position,"
        + " C.id AS cat_id,"
        + " C.category AS cat_name,"
        + " C.view AS cat_view,"
        + " C.position AS cat_position"
        + " FROM"
        + " vuscreen_content_package A,"
        + " vuscreen_folders B,"
        + " vuscreen_super_category C"
        + " WHERE"
        + " A.folder_id = B.id AND B.category_id = C.id AND A.partners LIKE '%dbrovmhalfs83i130k6u9fh0sj%'"
        + "  AND B.partners LIKE '%dbrovmhalfs83i130k6u9fh0sj%' AND 2GB = 1 AND B.status = 1"
        + "  AND C.status = 1 AND A.folder_id in "
        + " ( " + folder_id + " ) AND B.category_id in "
        + " ( " + category_id + ") AND end_time >= " + currentTimestamp + filter
        + " ORDER BY A.title ASC"
      var option = { draw: req.query.draw, start: req.query.start, length: req.query.length };
      db.pagination(query2, option, function (err2, doc2) {
        return cb(err2, doc2);
      })
    })
  })
  // var query = "select * from vuscreen_content_package "
  //   + filter
  //   + " order by title"

};

// Get list of content 
exports.vuscreen_json_index = function (req, res) {
  vuscreen_getAllJsonData_Pagination(req, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};


// get json details
exports.get_json_detaills = function (req, res) {
  var query = "select * "
    + " from"
    + " vuscreen_content_package "
    + " where "
    + " content_id='" + req.params.id + "'"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
}


exports.add_json = function (req, res) {
  console.log(req.body)
  let form = new formidable.IncomingForm();
  //Formidable uploads to operating systems tmp dir by default
  form.maxFileSize = 200 * 1024 * 1024;
  form.uploadDir = path.resolve(projectPath); //set upload directory
  form.keepExtensions = true; //keep file extension
  form.parse(req, function (err, fields, files) {
    console.log(fields)
    console.log(1111111111111111)
    console.log(files)
    fs.rename(files.logo.path, path.resolve(projectPath) + '/' + files.logo.name, function (err) {
      if (err) {
        throw err;
      } else {
        console.log("success")
      }
    });
    fs.rename(files.thumbnail.path, path.resolve(projectPath) + '/' + files.thumbnail.name, function (err) {
      if (err) {
        throw err;
      } else {
        console.log("success")
      }
    });
    fs.rename(files.video.path, path.resolve(projectPath) + '/' + files.video.name, function (err) {
      if (err) {
        throw err;
      } else {
        console.log("success")
      }
    });
  });
  // var query = "Insert "
  //   + " vuscreen_content_package SET "
  //   + "    title = '" + req.body.title + "',"
  //   + "    genre = '" + req.body.genre + "',"
  //   + "    folder_id = '" + req.body.folder_id + "',"
  //   + "    position = '" + req.body.position + "',"
  //   + "    end_time = '" + req.body.end_time + "',"
  //   + "    language = '" + req.body.language + "'"
  //   + " where "
  //   + " content_id='" + req.body.content_id + "'"

  // db.get().query(query, function (err, doc) {
  //   if (err) { return handleError(res, err); }
  //   else {
  //     return res.status(200).json(doc);
  //   }

  // })
}

// save json details after edit
exports.edit_json = function (req, res) {
  var query = "Update "
    + " vuscreen_content_package SET "
    + "    title = '" + req.body.title + "',"
    + "    genre = '" + req.body.genre + "',"
    + "    folder_id = '" + req.body.folder_id + "',"
    + "    position = '" + req.body.position + "',"
    + "    end_time = '" + req.body.end_time + "',"
    + "    language = '" + req.body.language + "'"
    + " where "
    + " content_id='" + req.body.content_id + "'"

  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
        .then(function (response) {
          // handle success
          console.log(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      return res.status(200).json(doc);
    }

  })
}


// change status of content in json
exports.change_status = function (req, res) {
  var query = "Update "
    + " vuscreen_content_package SET "
    + "    status = '" + req.body.status + "'"
    + " where "
    + " content_id='" + req.body.content_id + "'"

  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
        .then(function (response) {
          // handle success
          console.log(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      return res.status(200).json(doc);
    }

  })
}

// get folder list
exports.folder_list = function (req, res) {
  var query = "SELECT id, folder FROM vuscreen_folders"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      return res.status(200).json(doc);
    }

  })
}

// get category list
exports.category_list = function (req, res) {
  var query = "SELECT id, category FROM vuscreen_super_category"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      return res.status(200).json(doc);
    }

  })
}

// get genre list
exports.genre_list = function (req, res) {
  var query = "SELECT Distinct genre FROM vuscreen_content_package"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      return res.status(200).json(doc);
    }

  })
}

// Get list of Json data
var vuscreen_getAllAdsData_Pagination = function (req, cb) {
  var filter = '';
  // custom filters
  if (req.query.type && req.query.section && req.query.status) {
    filter = " where type IN (" + req.query.type + ") AND section IN (" + req.query.section + ") AND status ='" + req.query.status + "'"
  } else if (req.query.section && req.query.status) {
    filter = " where section IN (" + req.query.section + ") AND status ='" + req.query.status + "'"
  } else if (req.query.type && req.query.status) {
    filter = " where type IN (" + req.query.type + ") AND status ='" + req.query.status + "'"
  } else if (req.query.type && req.query.section) {
    filter = " where type IN (" + req.query.type + ") AND section IN (" + req.query.section + ")"
  } else if (req.query.status) {
    filter = " where status ='" + req.query.status + "'"
  } else if (req.query.section) {
    filter = " where section IN (" + req.query.section + ")"
  } else if (req.query.type) {
    filter = " where type IN (" + req.query.type + ")"
  }
  // only search filters
  // if (req.query.section) { filter = " where section ='" + req.query.section + "'" }
  if (req.query.title) { filter = " where title ='" + req.query.title + "'" }
  if (req.query.id) { filter = " where id ='" + req.query.id + "'" }

  var query = "select "
    + " * "
    + " from"
    + " vuscreen_advertise_content"
    + filter + " order by title asc"
  var option = { draw: req.query.draw, start: req.query.start, length: req.query.length };
  db.pagination(query, option, function (err, doc) {
    return cb(err, doc);
  })

};

// Get list of ads
exports.vuscreen_ads_index = function (req, res) {
  vuscreen_getAllAdsData_Pagination(req, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};

// get ads type list
exports.type_list = function (req, res) {
  var query = "SELECT Distinct type FROM vuscreen_advertise_content"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      return res.status(200).json(doc);
    }

  })
}


// get ads section list
exports.section_list = function (req, res) {
  var query = "SELECT Distinct section FROM vuscreen_advertise_content"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      return res.status(200).json(doc);
    }

  })
}

// change status of ads in json
exports.change_ads_status = function (req, res) {
  var query = "Update "
    + " vuscreen_advertise_content SET "
    + "    status = '" + req.body.status + "'"
    + " where "
    + " id='" + req.body.id + "'"

  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
        .then(function (response) {
          // handle success
          console.log(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      return res.status(200).json(doc);
    }

  })
}

// get ads details
exports.get_ads_detaills = function (req, res) {
  var query = "select * "
    + " from"
    + " vuscreen_advertise_content "
    + " where "
    + " id='" + req.params.id + "'"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
}

// save ads details after edit
exports.edit_ads = function (req, res) {
  var query = "Update "
    + " vuscreen_advertise_content SET "
    + "    title = '" + req.body.title + "',"
    + "    cast = '" + req.body.cast + "',"
    + "    description = '" + req.body.description + "',"
    + "    type = '" + req.body.type + "',"
    + "    duration = '" + req.body.duration + "',"
    + "    position = '" + req.body.position + "',"
    + "    end_time = '" + req.body.end_time + "',"
    + "    platform = '" + req.body.platform + "',"
    + "    format = '" + req.body.format + "',"
    + "    subcat_id = '" + req.body.subcat_id + "',"
    + "    subcat_position = '" + req.body.subcat_position + "',"
    + "    deeplink = '" + req.body.deeplink + "',"
    + "    partner_id = '" + req.body.partner_id + "',"
    + "    brand = '" + req.body.brand + "',"
    + "    section = '" + req.body.section + "',"
    + "    city = '" + req.body.city + "',"
    + "    interstitial_time = '" + req.body.interstitial_time + "',"
    + "    interstitial_count = '" + req.body.interstitial_count + "',"
    + "    campaignName = '" + req.body.campaignName + "'"
    + " where "
    + " id='" + req.body.id + "'"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
        .then(function (response) {
          // handle success
          console.log(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      return res.status(200).json(doc);
    }

  })
}

// add new ads in db
exports.new_ads = function (req, res) {
  let form = new formidable.IncomingForm();
  //Formidable uploads to operating systems tmp dir by default
  form.maxFileSize = 200 * 1024 * 1024;
  form.uploadDir = path.resolve(projectAdsPath); //set upload directory
  form.keepExtensions = true; //keep file extension
  form.parse(req, function (err, fields, files) {
    let videoName = files.video.name.replace(/\s/g, '');
    let thumbnailName = files.thumbnail.name.replace(/\s/g, '');
    fs.rename(files.thumbnail.path, path.resolve(projectAdsPath) + '/' + thumbnailName, function (err) {
      if (err) {
        throw err;
      } else {
        console.log("success")
        fs.rename(files.video.path, path.resolve(projectAdsPath) + '/' + videoName, function (err) {
          if (err) {
            throw err;
          } else {
            exec('nohup sudo ffmpeg -i ' + path.resolve(projectAdsPath) + '/' + videoName + ' -s 640x360 -b 1000000 -b:v 300k -f mp4 -vcodec libx264 -strict -2 ' + path.resolve(compressedAdsPath) + '/' + videoName + '_360P.mp4 &', (err, stdout, stderr) => {
              if (err) {
                // node couldn't execute the command
                console.log(`stderr: ${stderr}`);
              } else {
                // the *entire* stdout and stderr (buffered)
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                setTimeout(() => {
                  uploadToS3(filesArray)
                }, 2000);

              }
            });
            console.log("success")
            let url = "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/Spicejet_Panel_Upload/videos/" + videoName;
            let thumbnail = "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/Spicejet_Panel_Upload/thumbnails/" + thumbnailName;
            let start_time = new Date(fields.start_time).getTime()
            let end_time = new Date(fields.end_time).getTime()
            const filesArray = []
            filesArray.push({ "name": videoName + '_360P.mp4', "path": compressedAdsPath }, { "name": thumbnailName, "path": projectAdsPath })
            var query = 'Insert INTO'
              + ' vuscreen_advertise_content '
              + ' (title, thumbnail, url, cast, description, type, duration, position, start_time, end_time, city, interstitial_time, interstitial_count, campaignName)'
              + ' VALUES ("' + fields.title + '","' + thumbnail + '","' + url + '","' + fields.cast + '","' + fields.description
              + '","' + fields.type + '",' + fields.duration + ',' + fields.position + ',"' + start_time + '","' + end_time + '","' + fields.city + '","' +  fields.interstitial_time + '","' + fields.interstitial_count + '","'  + fields.campaignName +  '")';
            db.get().query(query, function (err, doc) {
              if (err) { return handleError(res, err); }
              else {
                axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
                  .then(function (response) {
                    // handle success
                    console.log(response.data);
                  })
                  .catch(function (error) {
                    // handle error
                    console.log(error);
                  })
                res.redirect('/app/json/ad')
              }
            })
          }
        });
      }
    });
  });
}


// send sms
exports.send_sms = function (req, res) {
  var number = req.query.number;
  generateSecureVal(function (secureVal) {
    var message = 'http://www.myvaluefirst.com/smpp/sendsms?username=Mobiservehttp1&password=mobi1234&to=' + number + '&from=VUINFO&text=Dear Recipients,\nYour OTP is -' + secureVal
    request(message, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Alert has been " + body) // Show the HTML for the Google homepage.
        return res.status(200).send({ "body": body, "response": response, "secureVal": secureVal });
      } else {
        return handleError(res, err);
      }
    })
  })
}

// Get list of Games Json data
var vuscreen_getAllGamesData_Pagination = function (req, cb) {
  var filter = '';
  // custom filters
  if (req.query.folder_id && req.query.status) {
    filter = " where folder_id IN (" + req.query.folder_id + ") AND status ='" + req.query.status + "'"
  } else if (req.query.status) {
    filter = " where status ='" + req.query.status + "'"
  } else if (req.query.folder_id) {
    filter = " where folder_id IN (" + req.query.folder_id + ")"
  }
  // only search filters
  // if (req.query.section) { filter = " where section ='" + req.query.section + "'" }
  if (req.query.title) { filter = " where title ='" + req.query.title + "'" }
  if (req.query.content_id) { filter = " where content_id ='" + req.query.content_id + "'" }

  var query = "select "
    + " * "
    + " from"
    + " vuscreen_store_content"
    + filter + " order by title asc"
  console.log(query)
  var option = { draw: req.query.draw, start: req.query.start, length: req.query.length };
  db.pagination(query, option, function (err, doc) {
    return cb(err, doc);
  })

};

// Get list of games
exports.vuscreen_games_index = function (req, res) {
  vuscreen_getAllGamesData_Pagination(req, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};

// get store folder list
exports.store_folder_list = function (req, res) {
  var query = "SELECT id, folder FROM vuscreen_store_folders"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      return res.status(200).json(doc);
    }

  })
}

// change status of games in json
exports.change_games_status = function (req, res) {
  var query = "Update "
    + " vuscreen_store_content SET "
    + "    status = " + req.body.status
    + " where "
    + " content_id=" + req.body.id

  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
        .then(function (response) {
          // handle success
          console.log(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      return res.status(200).json(doc);
    }

  })
}

// get games details
exports.get_games_detaills = function (req, res) {
  var query = "select * "
    + " from"
    + " vuscreen_store_content "
    + " where "
    + " content_id='" + req.params.id + "'"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
}

// save games details after edit
exports.edit_games = function (req, res) {
  var query = "Update "
    + " vuscreen_store_content SET "
    + "    title = '" + req.body.title + "',"
    + "    description = '" + req.body.description + "',"
    + "    folder_id = " + req.body.folder_id + ","
    + "    position = " + req.body.position + ","
    + "    end_time = '" + req.body.end_time + "',"
    + "    type = '" + req.body.type + "',"
    + "    websiteUrl = '" + req.body.websiteUrl + "',"
    + "    platform = '" + req.body.platform + "'"
    + " where "
    + " content_id=" + req.body.content_id

  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
        .then(function (response) {
          // handle success
          console.log(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      return res.status(200).json(doc);
    }

  })
}


exports.add_games = function (req, res) {
  let form = new formidable.IncomingForm();
  //Formidable uploads to operating systems tmp dir by default
  form.maxFileSize = 200 * 1024 * 1024;
  form.uploadDir = path.resolve(projectGamesPath); //set upload directory
  form.keepExtensions = true; //keep file extension
  form.parse(req, function (err, fields, files) {
    let videoName = files.video.name.replace(/\s/g, '');
    let thumbnailName = files.thumbnail.name.replace(/\s/g, '');
    fs.rename(files.thumbnail.path, path.resolve(projectGamesPath) + '/' + thumbnailName, function (err) {
      if (err) {
        throw err;
      } else {
        console.log("success")
        fs.rename(files.video.path, path.resolve(projectGamesPath) + '/' + videoName, function (err) {
          if (err) {
            throw err;
          } else {
            console.log("success")
            let url = "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/Spicejet_Panel_Upload/games/" + videoName;
            let thumbnail = "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/Spicejet_Panel_Upload/thumbnails/" + thumbnailName;
            let start_time = new Date(fields.start_time).getTime()
            let end_time = new Date(fields.end_time).getTime()
            const filesArray = []
            filesArray.push({ "name": videoName, "path": projectGamesPath }, { "name": thumbnailName, "path": projectGamesPath })
            var query = "Insert INTO"
              + " vuscreen_store_content "
              + " (title, thumbnail, url, description, type, status, folder_id, position, start_time, end_time)"
              + " VALUES ('" + fields.title + "','" + thumbnail + "','" + url + "','" + fields.description
              + "','" + fields.type + "'," + fields.status + "," + fields.folder + "," + fields.position + ",'" + start_time + "','" + end_time + "')";
            db.get().query(query, function (err, doc) {
              if (err) { return handleError(res, err); }
              else {
                axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
                  .then(function (response) {
                    // handle success
                    console.log(response.data);
                  })
                  .catch(function (error) {
                    // handle error
                    console.log(error);
                  })
                uploadToS3(filesArray)
                res.redirect('/app/json/game')
              }
            })
          }
        });
      }
    });
  });
}

// Get list of Travels Json data
var vuscreen_getAllTravelsData_Pagination = function (req, cb) {
  var filter = '';
  // custom filters
  if (req.query.folder_id && req.query.status) {
    filter = " where folder_id IN (" + req.query.folder_id + ") AND status ='" + req.query.status + "'"
  } else if (req.query.status) {
    filter = " where status ='" + req.query.status + "'"
  } else if (req.query.folder_id) {
    filter = " where folder_id IN (" + req.query.folder_id + ")"
  }
  // only search filters
  // if (req.query.section) { filter = " where section ='" + req.query.section + "'" }
  if (req.query.title) { filter = " where title ='" + req.query.title + "'" }
  if (req.query.content_id) { filter = " where content_id ='" + req.query.content_id + "'" }

  var query = "select "
    + " * "
    + " from"
    + " vuscreen_travel_content"
    + filter + " order by title asc"
  var option = { draw: req.query.draw, start: req.query.start, length: req.query.length };
  db.pagination(query, option, function (err, doc) {
    return cb(err, doc);
  })

};

// Get list of travels
exports.vuscreen_travels_index = function (req, res) {
  vuscreen_getAllTravelsData_Pagination(req, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};

// get travel folder list
exports.travel_folder_list = function (req, res) {
  var query = "SELECT id, folder FROM vuscreen_travel_folders"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      return res.status(200).json(doc);
    }

  })
}

// change status of travels in json
exports.change_travels_status = function (req, res) {
  var query = "Update "
    + " vuscreen_travel_content SET "
    + "    status = " + req.body.status
    + " where "
    + " content_id=" + req.body.id

  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
        .then(function (response) {
          // handle success
          console.log(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      return res.status(200).json(doc);
    }

  })
}

// get travels details
exports.get_travels_detaills = function (req, res) {
  var query = "select * "
    + " from"
    + " vuscreen_travel_content "
    + " where "
    + " content_id='" + req.params.id + "'"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
}

// save travels details after edit
exports.edit_travels = function (req, res) {
  var query = "Update "
    + ' vuscreen_travel_content SET '
    + '    title = "' + req.body.title + '",'
    + '    description = "' + req.body.description + '",'
    + '    folder_id = ' + req.body.folder_id + ','
    + '    position = ' + req.body.position + ','
    + '    end_time = "' + req.body.end_time + '",'
    + '    price = "' + req.body.price + '",'
    + '    coupon_code = "' + req.body.coupon_code + '",'
    + '    coupon_code_percentage = "' + req.body.coupon_code_percentage + '",'
    + '    coupon_card_url = "' + req.body.coupon_card_url + '",'
    + '    ecom_link = "' + req.body.ecom_link + '",'
    + '    platform = "' + req.body.platform + '"'
    + ' where '
    + ' content_id=' + req.body.content_id
  console.log(query)
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
        .then(function (response) {
          // handle success
          console.log(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      return res.status(200).json(doc);
    }

  })
}

// add new travel data
exports.add_travels = function (req, res) {
  let form = new formidable.IncomingForm();
  //Formidable uploads to operating systems tmp dir by default
  form.maxFileSize = 200 * 1024 * 1024;
  form.uploadDir = path.resolve(projectTravelsPath); //set upload directory
  form.keepExtensions = true; //keep file extension
  form.parse(req, function (err, fields, files) {
    let videoName = files.video.name.replace(/\s/g, '');
    let thumbnailName = files.thumbnail.name.replace(/\s/g, '');
    fs.rename(files.thumbnail.path, path.resolve(projectTravelsPath) + '/' + thumbnailName, function (err) {
      if (err) {
        throw err;
      } else {
        console.log("success")
        fs.rename(files.video.path, path.resolve(projectTravelsPath) + '/' + videoName, function (err) {
          if (err) {
            throw err;
          } else {
            console.log("success")
            let url = "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/Spicejet_Panel_Upload/thumbnails/" + videoName;
            let thumbnail = "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/Spicejet_Panel_Upload/thumbnails/" + thumbnailName;
            let start_time = new Date(fields.start_time).getTime()
            let end_time = new Date(fields.end_time).getTime()
            const filesArray = []
            filesArray.push({ "name": videoName, "path": projectTravelsPath }, { "name": thumbnailName, "path": projectTravelsPath })
            var query = "Insert INTO"
              + " vuscreen_travel_content "
              + " (title, thumbnail, url, description, type, status, folder_id, position, start_time, end_time)"
              + " VALUES ('" + fields.title + "','" + thumbnail + "','" + url + "','" + fields.description
              + "','" + fields.type + "'," + fields.status + "," + fields.folder + "," + fields.position + ",'" + start_time + "','" + end_time + "')";
            db.get().query(query, function (err, doc) {
              if (err) { return handleError(res, err); }
              else {
                axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
                  .then(function (response) {
                    // handle success
                    console.log(response.data);
                  })
                  .catch(function (error) {
                    // handle error
                    console.log(error);
                  })
                uploadToS3(filesArray)
                res.redirect('/app/json/travel')
              }
            })
          }
        });
      }
    });
  });
}

// Get list of Read Json data
var vuscreen_getAllReadData_Pagination = function (req, cb) {
  var filter = '';
  // custom filters
  if (req.query.folder_id && req.query.status) {
    filter = " where folder_id IN (" + req.query.folder_id + ") AND status ='" + req.query.status + "'"
  } else if (req.query.status) {
    filter = " where status ='" + req.query.status + "'"
  } else if (req.query.folder_id) {
    filter = " where folder_id IN (" + req.query.folder_id + ")"
  }
  // only search filters
  // if (req.query.section) { filter = " where section ='" + req.query.section + "'" }
  if (req.query.title) { filter = " where title ='" + req.query.title + "'" }
  if (req.query.content_id) { filter = " where content_id ='" + req.query.content_id + "'" }

  var query = "select "
    + " * "
    + " from"
    + " vuscreen_read_content"
    + filter + " order by title asc"
  var option = { draw: req.query.draw, start: req.query.start, length: req.query.length };
  db.pagination(query, option, function (err, doc) {
    return cb(err, doc);
  })

};

// Get list of read
exports.vuscreen_read_index = function (req, res) {
  vuscreen_getAllReadData_Pagination(req, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};

// get read folder list
exports.read_folder_list = function (req, res) {
  var query = "SELECT id, folder FROM vuscreen_read_folders"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      return res.status(200).json(doc);
    }

  })
}

// change status of read in json
exports.change_read_status = function (req, res) {
  var query = "Update "
    + " vuscreen_read_content SET "
    + "    status = " + req.body.status
    + " where "
    + " content_id=" + req.body.id

  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
        .then(function (response) {
          // handle success
          console.log(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      return res.status(200).json(doc);
    }

  })
}

// get read details
exports.get_read_detaills = function (req, res) {
  var query = "select * "
    + " from"
    + " vuscreen_read_content "
    + " where "
    + " content_id='" + req.params.id + "'"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
}

// save read details after edit
exports.edit_read = function (req, res) {
  var query = "Update "
    + ' vuscreen_read_content SET '
    + '    title = "' + req.body.title + '",'
    + '    description = "' + req.body.description + '",'
    + '    folder_id = ' + req.body.folder_id + ','
    + '    position = ' + req.body.position + ','
    + '    end_time = "' + req.body.end_time + '",'
    + '    platform = "' + req.body.platform + '",'
    + '    type = "' + req.body.type + '"'
    + ' where '
    + ' content_id=' + req.body.content_id
  console.log(query)
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
        .then(function (response) {
          // handle success
          console.log(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      return res.status(200).json(doc);
    }

  })
}

// add new read data
exports.add_read = function (req, res) {
  let form = new formidable.IncomingForm();
  //Formidable uploads to operating systems tmp dir by default
  form.maxFileSize = 200 * 1024 * 1024;
  form.uploadDir = path.resolve(projectTravelsPath); //set upload directory
  form.keepExtensions = true; //keep file extension
  form.parse(req, function (err, fields, files) {
    let videoName = files.video.name.replace(/\s/g, '');
    let thumbnailName = files.thumbnail.name.replace(/\s/g, '');
    fs.rename(files.thumbnail.path, path.resolve(projectTravelsPath) + '/' + thumbnailName, function (err) {
      if (err) {
        throw err;
      } else {
        console.log("success")
        fs.rename(files.video.path, path.resolve(projectTravelsPath) + '/' + videoName, function (err) {
          if (err) {
            throw err;
          } else {
            console.log("success")
            let url = "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/Spicejet_Panel_Upload/read/" + videoName;
            let thumbnail = "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/Spicejet_Panel_Upload/thumbnails/" + thumbnailName;
            let start_time = new Date(fields.start_time).getTime()
            let end_time = new Date(fields.end_time).getTime()
            const filesArray = []
            filesArray.push({ "name": videoName, "path": projectTravelsPath }, { "name": thumbnailName, "path": projectTravelsPath })
            var query = "Insert INTO"
              + " vuscreen_read_content "
              + " (title, thumbnail, url, description, type, status, folder_id, position, start_time, end_time)"
              + " VALUES ('" + fields.title + "','" + thumbnail + "','" + url + "','" + fields.description
              + "','" + fields.type + "'," + fields.status + "," + fields.folder + "," + fields.position + ",'" + start_time + "','" + end_time + "')";
            db.get().query(query, function (err, doc) {
              if (err) { return handleError(res, err); }
              else {
                axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
                  .then(function (response) {
                    // handle success
                    console.log(response.data);
                  })
                  .catch(function (error) {
                    // handle error
                    console.log(error);
                  })
                uploadToS3(filesArray)
                res.redirect('/app/json/reads')
              }
            })
          }
        });
      }
    });
  });
}

// Get list of Mall Json data
var vuscreen_getAllMallData_Pagination = function (req, cb) {
  var filter = '';
  // custom filters
  if (req.query.folder_id && req.query.status) {
    filter = " where folder_id IN (" + req.query.folder_id + ") AND status ='" + req.query.status + "'"
  } else if (req.query.status) {
    filter = " where status ='" + req.query.status + "'"
  } else if (req.query.folder_id) {
    filter = " where folder_id IN (" + req.query.folder_id + ")"
  }
  // only search filters
  // if (req.query.section) { filter = " where section ='" + req.query.section + "'" }
  if (req.query.title) { filter = " where title ='" + req.query.title + "'" }
  if (req.query.content_id) { filter = " where content_id ='" + req.query.content_id + "'" }

  var query = "select "
    + " * "
    + " from"
    + " vuscreen_mall_content"
    + filter + " order by title asc"
  console.log(query)
  var option = { draw: req.query.draw, start: req.query.start, length: req.query.length };
  db.pagination(query, option, function (err, doc) {
    return cb(err, doc);
  })

};

// Get list of mall
exports.vuscreen_mall_index = function (req, res) {
  vuscreen_getAllMallData_Pagination(req, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};

// get mall folder list
exports.mall_folder_list = function (req, res) {
  var query = "SELECT id, folder FROM vuscreen_mall_folders"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      return res.status(200).json(doc);
    }

  })
}

// change status of mall in json
exports.change_mall_status = function (req, res) {
  var query = "Update "
    + " vuscreen_mall_content SET "
    + "    status = " + req.body.status
    + " where "
    + " content_id=" + req.body.id

  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
        .then(function (response) {
          // handle success
          console.log(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      return res.status(200).json(doc);
    }

  })
}

// get mall details
exports.get_mall_detaills = function (req, res) {
  var query = "select * "
    + " from"
    + " vuscreen_mall_content "
    + " where "
    + " content_id='" + req.params.id + "'"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
}

// save mall details after edit
exports.edit_mall = function (req, res) {
  var query = "Update "
    + ' vuscreen_mall_content SET '
    + '    title = "' + req.body.title + '",'
    + '    description = "' + req.body.description + '",'
    + '    folder_id = ' + req.body.folder_id + ','
    + '    position = ' + req.body.position + ','
    + '    end_time = "' + req.body.end_time + '",'
    + '    platform = "' + req.body.platform + '",'
    + '    price = "' + req.body.price + '",'
    + '    coupon_code = "' + req.body.coupon_code + '",'
    + '    coupon_code_percentage = "' + req.body.coupon_code_percentage + '",'
    + '    coupon_card_url = "' + req.body.coupon_card_url + '",'
    + '    ecom_link = "' + req.body.ecom_link + '",'
    + '    type = "' + req.body.type + '"'
    + ' where '
    + ' content_id=' + req.body.content_id
  console.log(query)
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
        .then(function (response) {
          // handle success
          console.log(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      return res.status(200).json(doc);
    }

  })
}

// add new mall data
exports.add_mall = function (req, res) {
  let form = new formidable.IncomingForm();
  //Formidable uploads to operating systems tmp dir by default
  form.maxFileSize = 200 * 1024 * 1024;
  form.uploadDir = path.resolve(projectTravelsPath); //set upload directory
  form.keepExtensions = true; //keep file extension
  form.parse(req, function (err, fields, files) {
    let videoName = files.video.name.replace(/\s/g, '');
    let thumbnailName = files.thumbnail.name.replace(/\s/g, '');
    let couponLogo = files.coupon_logo.name.replace(/\s/g, '');
    fs.rename(files.thumbnail.path, path.resolve(projectTravelsPath) + '/' + thumbnailName, function (err) {
      if (err) {
        throw err;
      } else {
        console.log("success")
        fs.rename(files.video.path, path.resolve(projectTravelsPath) + '/' + videoName, function (err) {
          if (err) {
            throw err;
          } else {
            console.log("success")
            fs.rename(files.coupon_logo.path, path.resolve(projectTravelsPath) + '/' + couponLogo, function (err) {
              if (err) {
                throw err;
              } else {
                console.log("success")
                let url = "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/Spicejet_Panel_Upload/thumbnails/" + videoName;
                let thumbnail = "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/Spicejet_Panel_Upload/thumbnails/" + thumbnailName;
                let coupon_card_url = "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/Spicejet_Panel_Upload/thumbnails/" + couponLogo;
                let start_time = new Date(fields.start_time).getTime()
                let end_time = new Date(fields.end_time).getTime()
                const filesArray = []
                filesArray.push({ "name": videoName, "path": projectTravelsPath }, { "name": thumbnailName, "path": projectTravelsPath }, { "name": couponLogo, "path": projectTravelsPath })
                var query = "Insert INTO"
                  + " vuscreen_mall_content "
                  + " (title,thumbnail,url,description,type,status,folder_id,position,price,coupon_code,coupon_code_percentage,coupon_card_url,ecom_link,start_time, end_time)"
                  + " VALUES ('" + fields.title + "','" + thumbnail + "','" + url + "','" + fields.description
                  + "','" + fields.type + "'," + fields.status + "," + fields.folder + "," + fields.position + "," + fields.price + ","
                  + "'" + fields.coupon_code + "','" + fields.coupon_code_percentage + "','" + coupon_card_url + "','" + fields.ecom_link
                  + "','" + start_time + "','" + end_time + "')";
                console.log(query)
                db.get().query(query, function (err, doc) {
                  if (err) { return handleError(res, err); }
                  else {
                    axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
                      .then(function (response) {
                        // handle success
                        console.log(response.data);
                      })
                      .catch(function (error) {
                        // handle error
                        console.log(error);
                      })
                    uploadToS3(filesArray)
                    res.redirect('/app/json/malls')
                  }
                })
              }
            });
          }
        });
      }
    });
  });
}

// Get list of Fnb Json data
var vuscreen_getAllFnbData_Pagination = function (req, cb) {
  var filter = '';
  // custom filters
  if (req.query.folder_id && req.query.status) {
    filter = " where folder_id IN (" + req.query.folder_id + ") AND status ='" + req.query.status + "'"
  } else if (req.query.status) {
    filter = " where status ='" + req.query.status + "'"
  } else if (req.query.folder_id) {
    filter = " where folder_id IN (" + req.query.folder_id + ")"
  }
  // only search filters
  // if (req.query.section) { filter = " where section ='" + req.query.section + "'" }
  if (req.query.title) { filter = " where title ='" + req.query.title + "'" }
  if (req.query.content_id) { filter = " where content_id ='" + req.query.content_id + "'" }

  var query = "select "
    + " * "
    + " from"
    + " vuscreen_fnb_content"
    + filter + " order by title asc"
  console.log(query)
  var option = { draw: req.query.draw, start: req.query.start, length: req.query.length };
  db.pagination(query, option, function (err, doc) {
    return cb(err, doc);
  })

};

// Get list of fnb
exports.vuscreen_fnb_index = function (req, res) {
  vuscreen_getAllFnbData_Pagination(req, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};


// get fnb folder list
exports.fnb_folder_list = function (req, res) {
  var query = "SELECT id, folder FROM vuscreen_fnb_folders"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      return res.status(200).json(doc);
    }

  })
}

// change status of fnb in json
exports.change_fnb_status = function (req, res) {
  var query = "Update "
    + " vuscreen_fnb_content SET "
    + "    status = " + req.body.status
    + " where "
    + " content_id=" + req.body.id

  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
        .then(function (response) {
          // handle success
          console.log(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      return res.status(200).json(doc);
    }

  })
}

// get fnb details
exports.get_fnb_detaills = function (req, res) {
  var query = "select * "
    + " from"
    + " vuscreen_fnb_content "
    + " where "
    + " content_id='" + req.params.id + "'"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
}

// save fnb details after edit
exports.edit_fnb = function (req, res) {
  var query = "Update "
    + ' vuscreen_fnb_content SET '
    + '    title = "' + req.body.title + '",'
    + '    description = "' + req.body.description + '",'
    + '    folder_id = ' + req.body.folder_id + ','
    + '    position = ' + req.body.position + ','
    + '    end_time = "' + req.body.end_time + '",'
    + '    platform = "' + req.body.platform + '",'
    + '    price = "' + req.body.price + '",'
    + '    coupon_code = "' + req.body.coupon_code + '",'
    + '    coupon_code_percentage = "' + req.body.coupon_code_percentage + '",'
    + '    coupon_card_url = "' + req.body.coupon_card_url + '",'
    + '    ecom_link = "' + req.body.ecom_link + '",'
    + '    ftype = "' + req.body.ftype + '",'
    + '    type = "' + req.body.type + '"'
    + ' where '
    + ' content_id=' + req.body.content_id
  console.log(query)
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
        .then(function (response) {
          // handle success
          console.log(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      return res.status(200).json(doc);
    }

  })
}

// add new fnb data
exports.add_fnb = function (req, res) {
  let form = new formidable.IncomingForm();
  //Formidable uploads to operating systems tmp dir by default
  form.maxFileSize = 200 * 1024 * 1024;
  form.uploadDir = path.resolve(projectTravelsPath); //set upload directory
  form.keepExtensions = true; //keep file extension
  form.parse(req, function (err, fields, files) {
    let videoName = files.video.name.replace(/\s/g, '');
    let thumbnailName = files.thumbnail.name.replace(/\s/g, '');
    let couponLogo = files.coupon_logo.name.replace(/\s/g, '');
    fs.rename(files.thumbnail.path, path.resolve(projectTravelsPath) + '/' + thumbnailName, function (err) {
      if (err) {
        throw err;
      } else {
        console.log("success")
        fs.rename(files.video.path, path.resolve(projectTravelsPath) + '/' + videoName, function (err) {
          if (err) {
            throw err;
          } else {
            console.log("success")
            fs.rename(files.coupon_logo.path, path.resolve(projectTravelsPath) + '/' + couponLogo, function (err) {
              if (err) {
                throw err;
              } else {
                console.log("success")
                let url = "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/Spicejet_Panel_Upload/thumbnails/" + videoName;
                let thumbnail = "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/Spicejet_Panel_Upload/thumbnails/" + thumbnailName;
                let coupon_card_url = "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/Spicejet_Panel_Upload/thumbnails/" + couponLogo;
                let start_time = new Date(fields.start_time).getTime()
                let end_time = new Date(fields.end_time).getTime()
                const filesArray = []
                filesArray.push({ "name": videoName, "path": projectTravelsPath }, { "name": thumbnailName, "path": projectTravelsPath }, { "name": couponLogo, "path": projectTravelsPath })
                var query = "Insert INTO"
                  + " vuscreen_fnb_content "
                  + " (title,thumbnail,url,description,type,status,folder_id,position,price,coupon_code,coupon_code_percentage,coupon_card_url,ecom_link,ftype,start_time, end_time)"
                  + " VALUES ('" + fields.title + "','" + thumbnail + "','" + url + "','" + fields.description
                  + "','" + fields.type + "'," + fields.status + "," + fields.folder + "," + fields.position + "," + fields.price + ","
                  + "'" + fields.coupon_code + "','" + fields.coupon_code_percentage + "','" + coupon_card_url + "','" + fields.ecom_link + "','" + fields.ftype
                  + "','" + start_time + "','" + end_time + "')";
                console.log(query)
                db.get().query(query, function (err, doc) {
                  if (err) { return handleError(res, err); }
                  else {
                    axios.get('http://stagapi.vuscreen.in/spicescreen/webapi/initailizeMaps')
                      .then(function (response) {
                        // handle success
                        console.log(response.data);
                      })
                      .catch(function (error) {
                        // handle error
                        console.log(error);
                      })
                    uploadToS3(filesArray)
                    res.redirect('/app/json/fnb')
                  }
                })
              }
            });
          }
        });
      }
    });
  });
}

function uploadToS3(filesArray) {
  for (let i = 0; i < filesArray.length; i++) {
    const element = filesArray[i];
    let extn = path.extname(element.name)
    let destPath = ""
    if (extn == ".mp4") {
      destPath = "videos/" + element.name
    } else if (extn == ".jpg" || extn == ".png") {
      destPath = "thumbnails/" + element.name
    } else if (extn == ".zip") {
      destPath = "games/" + element.name
    } else if (extn == ".pdf" || extn == ".mp3") {
      destPath = "read/" + element.name
    } else {
      destPath = "extras/" + element.name
    }
    fs.readFile(path.resolve(element.path) + "/" + element.name, function (err, data) {
      if (err) throw err; // Something went wrong!
      s3Client.putObject({
        Bucket: s3_details.bucket,
        Key: destPath,
        ACL: 'public-read',
        Body: data
      }, function (err, data) {
        if (err) {
          console.log(err)
          uploadToS3()
        } else {
          fs.unlink(path.resolve(element.path) + "/" + element.name, function (err) {
            if (err) {
              console.error(err);
            }
            console.log('Temp File Delete');
          });
        }
      });
    });

  }
}

function handleError(res, err) {
  return res.status(500).send(err);
}