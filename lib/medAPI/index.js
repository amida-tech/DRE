var fs = require('fs');
var	bb = require("blue-button");
var bbcms = require("blue-button-cms");
var request = require("request");

var	example1 = fs.readFileSync('./bluebutton-01-original.xml', 'utf-8'),
	example2 = fs.readFileSync('./bluebutton-02-updated.xml', 'utf-8'),
	example3 = fs.readFileSync("bluebutton-03-cms.txt").toString();

var bbexample1 = bb.parse(example1);
// console.log(bbexample1);
var bbexample2 = bb.parse(example2);
var bbexample3 = bbcms.parseText(example3);


//input example file
//output json

function queryfdaCode (filepath, inputfile) {

	// ex = fs.readFileSync(filepath, 'utf-8');
	// bbex = bb.parse(ex);
	var med1 = inputfile.data.medications;
	// console.log(med1);
	var output = {};
	var medcode = {};
	var medname = {};
	for (var i = 0; i < med1.length; i++)
		if (med1[i].product) {
			// console.log(med1[i].product);
			//if blue-button format
			if (med1[i].product.product&&med1[i].product.product.code) {
				medcode = med1[i].product.product.code;
				medname = med1[i].product.product.name;
				console.log(medname, medcode);
				request('https://api.fda.gov/drug/label.json?search=openfda.rxcui:'+medcode, function (error, response, body) {
					if (!error) {
						console.log(response.body);
						fs.appendFile('fdaResults.json', response.body, function (err) {
							if (err) throw err;
						});

					} else {
						console.log('openFDA rxcui error');
					};
				});
			} else { 
				console.log("no product code or name available "+med1[i].product);
			}
		} else {
			console.log("product not available");
		}
};


function queryfdaName (filepath, inputfile) {

	// ex = fs.readFileSync(filepath, 'utf-8');
	// bbex = bb.parse(ex);
	var med1 = inputfile.data.medications;
	// console.log(med1);
	var output = {};
	var medcode = {};
	var medname = {};
	for (var i = 0; i < med1.length; i++)
		if (med1[i].product) {
			// console.log(med1[i].product);
			//if blue-button format
			if (med1[i].product.product&&med1[i].product.product.name) {
				medname = med1[i].product.product.name;
				console.log(medname);
				request('https://api.fda.gov/drug/label.json?search=openfda.generic_name:'+medname, function (error, response, body) {
					if (!error) {
						console.log(response.body);
						fs.appendFile('fdaResults.json', response.body, function (err) {
							if (err) throw err;
						});

					} else {
						console.log('openFDA generic name error');
					};
				});
				request('https://api.fda.gov/drug/label.json?search=openfda.brand_name:'+medname, function (error, response, body) {
					if (!error) {
						console.log(response.body);
						fs.appendFile('fdaResults.json', response.body, function (err) {
							if (err) throw err;
						});

					} else {
						console.log('openFDA brand name error');
					};
				});
			} else { 
				console.log("no product code or name available "+med1[i].product);
			}
		} else {
			console.log("product not available");
		}
};


function queryRxImageCode (filepath, inputfile) {

	// ex = fs.readFileSync(filepath, 'utf-8');
	// bbex = bb.parse(ex);
	var med1 = inputfile.data.medications;
	// console.log(med1);
	var imgset = {};
	var medcode = {};
	var medname = {};
	for (var i = 0; i < med1.length; i++)
		if (med1[i].product) {
			// console.log(med1[i].product);
			//if blue-button format
			if (med1[i].product.product&&med1[i].product.product.code) {
				medcode = med1[i].product.product.code;
				medname = med1[i].product.product.name;
				console.log(medname, medcode);
				request('http://rximage.nlm.nih.gov/api/rximage/1/rxnav?rxcui='+medcode, function (error, response, body) {
					console.log(response.body);
					fs.appendFile('fdaResults.json', response.body, function (err) {
						if (err) throw err;
					});
				});
			} else { 
				console.log("no product code or name available ");
			}
		} else {
			console.log("product not available");
		}
};

// example: http://rximage.nlm.nih.gov/api/rximage/1/rxnav?rxcui=309114
// response:
// {
//     replyStatus: {
//         success: true,
//         imageCount: 4,
//         totalImageCount: 4,
//         date: "2015-04-27 11:03:15 GMT",
//         matchedTerms: {
//             rxcui: "309114"
//         }
//     },
//     nlmRxImages: [{
//             id: 185646439,
//             ndc11: "00093-3147-01",
//             part: 1,
//             relabelersNdc9: [{@
//                 sourceNdc9: "00093-3147",
//                 ndc9: [
//                     "10544-0020",
//                     "35356-0980",
//                     "42549-0565",
//                     "53808-0222",
//                     "55289-0058",
//                     "60429-0037",
//                     "66116-0255"
//                 ]
//             }],
//             status: "Former imprint",
//             rxcui: 309114,
//             splSetId: "19307ff0-71de-477b-965d-ea243e5ede3a",
//             acqDate: "12-02-2009",
//             name: "Cephalexin 500 MG Oral Capsule",
//             labeler: "Teva Pharmaceuticals USA Inc",
//             imageUrl: "http://rximage.nlm.nih.gov/image/images/gallery/original/00093-3147-01_RXNAVIMAGE10_24231258.jpg",
//             imageSize: 663359,
//             attribution: "National Library of Medicine | Lister Hill National Center for Biomedical Communications | Office of High Performance Computing and Communications | Medicos Consultants LLC"
//         }
//     }
// }





function queryRxNorm (filepath, inputfile) {

	// ex = fs.readFileSync(filepath, 'utf-8');
	// bbex = bb.parse(ex);
	var med1 = inputfile.data.medications;
	// console.log(med1);
	var imgset = {};
	var medname = {};
	for (var i = 0; i < med1.length; i++)
		if (med1[i].product) {
			// console.log(med1[i].product);
			//if blue-button format
			if (med1[i].product.product&&med1[i].product.product.name) {
				medname = med1[i].product.product.name;
				console.log(medname);
				request('http://rxnav.nlm.nih.gov/REST/rxcui?name='+medname, function (error, response, body) {
					console.log(response.body);
					fs.appendFile('fdaResults.json', response.body, function (err) {
						if (err) throw err;
					});
				});
			} else { 
				console.log("no product or name available ");
			}
		} else {
			console.log("product not available");
		}
};

//example: http://rxnav.nlm.nih.gov/REST/rxcui?name=lipitor
//returns: 
// <rxnormdata>
// 	<idGroup>
// 		<name>lipitor</name>
// 		<rxnormId>153165</rxnormId>
// 	</idGroup>
// </rxnormdata>




// queryRxImageCode('./bluebutton-01-original.xml', bbexample1);
// queryRxImageCode('./bluebutton-02-updated.xml', bbexample2);
// queryRxImageCode('./bluebutton-03-cms.txt', bbexample3);

// queryfdaCode('./bluebutton-01-original.xml', bbexample1);
// queryfdaCode('./bluebutton-02-updated.xml', bbexample2);
// queryfdaCode('./bluebutton-03-cms.txt', bbexample3);


app.get('/api/v1/openfda', function (req, res) {
	console.log(req.body);
	var inputData = req.body;
	queryfda(inputData, function(err, data) {
		var medInfo = data;
		res.send(medInfo);
	});
});



