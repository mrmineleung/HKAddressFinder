var empty = require('is-empty');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
app.set('views', './views');
app.set('view engine', 'ejs');

app.listen(process.env.PORT || 8099, function() {
  console.log('It\'s working');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var eng_address = [];


app.get('/', function(req, res, next) {

  res.render('index', { e: null });

});


app.get('/about', function(req, res, next) {

  res.render('about', { title: 'Hey', message: 'Hello there!' });

});



app.get('/search', function(req, res, next) {

  var value = req.query.id;

  var address = '';
  var eng_bname = '';
  var eng_sname = '';
  var eng_bno = '';
  var eng_district = '';
  var eng_region = '';
  var eng_descriptor = '';
  var eng_blockno = '';
  var eng_indi = '';
  var eng_ename = '';
  var eng_vname = '';
  var eng_vno = '';


  if (!empty(value)) {
    request.get({
      uri: "https://www.als.ogcio.gov.hk/lookup?q=" + value,
      method: "GET",
      json: true,
      headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8'
      },
      timeout: 10000,
      followRedirect: true,
      maxRedirects: 10
    }, function(error, response, body) {
      
      // Error Checking
      if (error || response.statusCode !== 200 || empty(body.SuggestedAddress)) {
        res.render('index', { e: 'No match record.' });
        return;
      }

      // Testing
      // console.log('Length : ' + body.SuggestedAddress.length);
      // console.log(JSON.stringify(body));

      var coord = [];


      for (var i = 0; i < body.SuggestedAddress.length; i++) {

        if (!("SuggestedAddress" in body)) {
          body.SuggestedAddress = 'N/A';
        }

        if (!("Address" in body.SuggestedAddress[i])) {
          body.SuggestedAddress[i].Address = 'N/A';
        }
        if (!("PremisesAddress" in body.SuggestedAddress[i].Address)) {
          body.SuggestedAddress[i].Address.PremisesAddress = 'N/A';
        }

        if (!("EngPremisesAddress" in body.SuggestedAddress[i].Address.PremisesAddress)) {
          body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress = 'N/A';
        }

        if (!("EngStreet" in body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress)) {
          body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress.EngStreet = 'N/A';
        }

        if (!("EngDistrict" in body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress)) {
          body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress.EngDistrict = 'N/A';

        }

        if (!("EngVillage" in body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress)) {
          body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress.EngVillage = 'N/A';

        }




        address = body.SuggestedAddress[i].Address;
        eng_bname = body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress.BuildingName;
        eng_sname = body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress.EngStreet.StreetName;
        eng_bno = body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress.EngStreet.BuildingNoFrom;
        eng_district = body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress.EngDistrict.DcDistrict;
        eng_region = body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress.Region;
        eng_vname = body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress.EngVillage.VillageName;
        eng_vno = body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress.EngVillage.BuildingNoFrom;
        var temp;


        if (eng_bno === undefined) {
          eng_bno = 'N/A';
        }

        if (eng_bname === undefined) {
          eng_bname = 'N/A';
        }

        if (eng_sname === undefined) {
          eng_sname = 'N/A';
        }

        if (eng_district === undefined) {
          eng_district = 'N/A';
        }

        if (eng_region === undefined) {
          eng_region = 'N/A';
        }

        if (eng_vname === undefined) {
          eng_vname = 'N/A';
        }

        if (eng_vno === undefined) {
          eng_vno = 'N/A';
        }



        if (eng_bname != 'N/A') {
          temp = eng_vno + ' ' + eng_vname + ', ' + eng_bname + ', ' + eng_bno + ' ' + eng_sname + ', ' + eng_district + ', ' + eng_region;
        }
        else {
          temp = eng_vno + ' ' + eng_vname + ', ' + eng_bno + ' ' + eng_sname + ', ' + eng_district + ', ' + eng_region;
        }

        if (address.PremisesAddress.EngPremisesAddress.EngBlock != null) {

          if (!("EngEstate" in body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress)) {
            body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress.EngEstate = 'N/A';
          }

          if (!("EngBlock" in body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress)) {
            body.SuggestedAddress[i].Address.PremisesAddress.EngPremisesAddress.EngBlock = 'N/A';
          }

          eng_descriptor = address.PremisesAddress.EngPremisesAddress.EngBlock.BlockDescriptor;
          eng_blockno = address.PremisesAddress.EngPremisesAddress.EngBlock.BlockNo;
          eng_indi = address.PremisesAddress.EngPremisesAddress.EngBlock.BlockDescriptorPrecedenceIndicator;
          eng_ename = address.PremisesAddress.EngPremisesAddress.EngEstate.EstateName;


          if (eng_descriptor === undefined) {
            eng_descriptor = 'N/A';
          }

          if (eng_blockno === undefined) {
            eng_blockno = 'N/A';
          }

          if (eng_indi === undefined) {
            eng_indi = 'N/A';
          }

          if (eng_ename === undefined) {
            eng_ename = 'N/A';
          }

          if (eng_indi == 'Y')
            temp = eng_descriptor + ' ' + eng_blockno + ', ' + eng_vno + ' ' + eng_vname + ' ' + eng_ename + ', ' + eng_bno + ' ' + eng_sname + ', ' + eng_district + ', ' + eng_region;
          else temp = eng_blockno + ' ' + eng_descriptor + ', ' + eng_vno + ' ' + eng_vname + ' ' + eng_ename + ', ' + eng_bno + ' ' + eng_sname + ', ' + eng_district + ', ' + eng_region;

        }


        // Reformat the address
        var newStr = temp.replace('N/A', '');
        newStr = newStr.replace('N/A,', '');
        newStr = newStr.replace(' N/A N/A,', '');
        newStr = newStr.replace(' N/A ', '');
        newStr = newStr.replace('N/A ', '');
        newStr = newStr.replace(' N/A', '');
        
        // Show the reformatted address
        // console.log(newStr.trim());

        eng_address[i] = newStr.trim();
        
        let lat = address.PremisesAddress.GeospatialInformation[0].Latitude;
        let lng = address.PremisesAddress.GeospatialInformation[0].Longitude;
        // Testing
        // console.log(lat, lng);
        coord.push({lat:parseFloat(lat),lng:parseFloat(lng)});
        
        console.log(eng_address[i]+" | "+coord[i].lat+", "+coord[i].lng);

      }
      // Testing
      // console.log(coord);
      res.render('search', { value, body, eng_bname, eng_sname, eng_bno, eng_district, eng_region, eng_address, coord });

    });

  }
  else res.render('index', { e: 'Please Enter any keyword(s).' });
});

app.get('/map', function(req, res, next) {

  res.render('map', { lat: req.query.lat, lng: req.query.lng  });

});

app.use('/dist', express.static(__dirname + '/dist'));

module.exports = app;
