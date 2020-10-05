#!/usr/bin/env node
"use strict";

const https = require("https");
const fs = require("fs");
const ini = require("ini");
const request = require('request');

class Config {
  constructor() {
  }

  read() {
    this.credentials = ini.parse(
      fs.readFileSync(this.readFilename(), 'utf-8')
    );
    return this.credentials;
  }

  write(data, local=false) {
    fs.writeFileSync(
      this.writeFilename(local),
      ini.stringify(data)
    );
  }

  readFilename() {
    const filename = localFile();
    if (fs.existsSync(filename)) { return filename; }
    return homeFile();
  }

  writeFilename(local=false) {
    if (local) { return localFile(); }
    return homeFile();
  }
  
  clear() {
	  if (fs.existsSync(this.writeFilename(false))) fs.unlinkSync(this.writeFilename(false))
	  if (fs.existsSync(this.writeFilename(true))) fs.unlinkSync(this.writeFilename(true))
  }
  
  apiDefinitionFilename(api_name) {
    return homeFile()+"_"+api_name+".json";
  }
}

const localFile = function() {
  return `${process.cwd()}/.melroselabsrc`;
};

const homeFile = function() {
  const key = (process.platform == 'win32') ? 'USERPROFILE' : 'HOME';
  return `${process.env[key]}/.melroselabsrc`;
};

// REST HTTPS calls

function callback(error,respone) {
	console.log(error);
	console.log(response);
}

function requestPOST(params) {

	//console.log(JSON.stringify(params))
	
	var options = {
	  'encoding': null,
	  'method': 'POST',
	  'url': 'https://api.melroselabs.com/voice/tts/',
	  'headers': {
	    'x-api-key': config.credentials.api_key,
	    'Content-Type': 'application/json'
	  },
	  body: JSON.stringify(params)
	};
	
	request(options, function (error, response) { 
	  
	  if (error) throw new Error(error);
	  
	  if ( response.caseless.get('Content-Type') == 'audio/mp3' )
	  {
		  // response is of type audio/mp3
		  let filename = "out.mp3";
		  //console.log(response)
		  fs.writeFile(filename, response.body, "binary", (err) => {
			  if (err) throw err;
			  console.log("File saved to "+filename);
			});
	  }
	  
	  if ( response.caseless.get('Content-Type') == 'application/json' ) console.log( response.body );

	});
}

function requestGETAPIList(api_name) {
	
	var url = "https://melroselabs.com/docs/api/api_list.json"
	
	return new Promise((resolve, reject) => {
		request (url, (error,response,body) => {
			if (error) reject(error);
			if (response.statusCode!=200) {
				reject('Unable to download API list '+response.statusCode);
			}
			resolve(JSON.parse(body))
		})
		
	});
}

function requestGETAPIDefinitions(api_name) {

	// API definitions are in swagger 2.0 json format

	var options = {
	  'encoding': null,
	  'method': 'GET',
	  'url': 'https://melroselabs.com/docs/api/'+api_name+'/'+api_name+'.json'
	};
	
	request(options, function (error, response) { 
	  
	  if (error) throw new Error(error);
	  
	  if (response.statusCode!=200) {
		  throw new Error("Unable to download API definition for "+api_name);
	  }
	  
	  let filename = config.apiDefinitionFilename(api_name);
	  //console.log(response)
	  fs.writeFile(filename, response.body, "binary", (err) => {
		  if (err) throw err;
		  console.log(api_name+": API definition saved to "+filename);
		});
	  
	});
}

async function updateAPIDefinitions() {
	console.log("Downloading API definitions...")
	var api_list = await requestGETAPIList();
	//console.log(api_list)
	for(let val of api_list["items"]) requestGETAPIDefinitions(val)
}

async function helpHighLevel() {
	console.log("Where <api> can be:");
	var api_list = await requestGETAPIList();
	for(let val of api_list["items"]) console.log(" "+val);
	console.log("\nFor list of services for an API, type:\n\n melroselabs-cli <api> help\n");
}

// help - high level

if ((process.argv.length<3)||((process.argv.length==3)&&((process.argv[2] == "help")||(process.argv[2] == "--help")||(process.argv[2] == "-h")))) {
	console.log("Usage: melroselabs-cli <api> <service> ...\n");
	helpHighLevel();
	
	return;
}

// load config

const config = new Config();

if (process.argv[2] == "setup") { // setup <api-key>
	// only download API definitions if key currently unset
	var performDownloadAPIDefinitions = !fs.existsSync(config.readFilename());
	// write API key
	config.write({api_key:process.argv[3]})
	console.log("API key set")
	// download API definitions
	if (performDownloadAPIDefinitions) updateAPIDefinitions();
	return;
}

if (process.argv[2] == "update") { // update (download) API definitions
	// download API definitions
	updateAPIDefinitions();
	return;
}

// api help

if ((process.argv.length==4)&&(process.argv[3] == "help")) {

	// API name (e.g. "identity", "voice")
	var api_name = process.argv[2]
	
	if (!fs.existsSync(config.apiDefinitionFilename(api_name))) {
		console.log("Unknown API: "+api_name);
		return;
	}
	
	console.log("Usage: melroselabs-cli "+api_name+" <service> ...\n");
	
	var textschema = fs.readFileSync(config.apiDefinitionFilename(api_name), 'utf-8');
	var schema = JSON.parse(textschema)
	//console.log(schema["paths"])
	
	console.log("Where <service> can be:");
	
	for (const [key, value] of Object.entries(schema["paths"])) {
	
		//console.log(value["post"])
		
		let service = key;
		if (key[0]=="/") service = key.substr(1);
		
		if (value["post"]) console.log(" "+service.padEnd(20," ")+": "+value["post"]["summary"]);
	}
	console.log("");

	return;
}


if ((process.argv.length==5)&&(process.argv[4] == "help")) {

	// API name (e.g. "identity", "voice")
	var api_name = process.argv[2]
	
	if (!fs.existsSync(config.apiDefinitionFilename(api_name))) {
		console.log("Unknown API: "+api_name);
		return;
	}
	
	
	var textschema = fs.readFileSync(config.apiDefinitionFilename(api_name), 'utf-8');
	var schema = JSON.parse(textschema)
	//console.log(schema["paths"])

var api_path = "/"+process.argv[3]
//console.log(api_path)
if (schema["paths"][api_path] == null) {
	console.log("Unknown path: "+process.argv[3]);
	return;
}


	console.log("Usage: melroselabs-cli "+api_name+" "+process.argv[3]+" <parameters>\n");
	
	console.log("Where <parameters> are:");

	var api_method = "post";
		
	var rest_api_param_definition_name = schema["paths"][api_path][api_method]["parameters"][0]["name"];
	var rest_api_param_definition = schema["definitions"][rest_api_param_definition_name];
	var rest_api_param_definition_required = rest_api_param_definition["required"]

	for (const [key, value] of Object.entries(rest_api_param_definition["properties"])) {
		console.log(" "+key.padEnd(16," ") + " : " + value["description"]);
		if (value["enum"]) {
			let str = "                    Choices:";
			let i = 0;
			for(let a of value["enum"]) { if (i%8==0) str += "\n                      "; i++; str += a.padEnd(16," "); }
			console.log(str)
		}
	}
	
	//
	
	console.log("");

	return;
}

// require API key to proceed beyond here

if (!fs.existsSync(config.readFilename())) {
	console.log("API key not found. Get key from melroselabs.com.\n\nAdd using:\n\n  melroselabs-cli setup <api-key>\n");
	return;
}

if (process.argv[2] == "clear") { // clear configuration
	// write API key
	config.clear()
	console.log("API key cleared")
	return;
}

config.read(); // load credentials from file

// main

// API name (e.g. "identity", "voice")
var api_name = process.argv[2]

// load API definition
//console.log(homeFile()+"_"+api_name+".json")
if (!fs.existsSync(config.apiDefinitionFilename(api_name))) {
	console.log("Unknown API: "+api_name);
	return;
}
var textschema = fs.readFileSync(config.apiDefinitionFilename(api_name), 'utf-8');
var schema = JSON.parse(textschema)
//console.log(schema)

var api_path = "/"+process.argv[3]
//console.log(api_path)
if (schema["paths"][api_path] == null) {
	console.log("Unknown path: "+process.argv[3]);
	return;
}

var api_method = process.argv[4] // post, get, put (might change to create, etc)
if (api_method == "create") api_method = "post";
if (api_method == "update") api_method = "put";
//console.log(api_method)
if (schema["paths"][api_path][api_method] == null) {
	console.log("Unknown method: "+process.argv[4]);
	return;
}

var rest_api_param_definition_name = schema["paths"][api_path][api_method]["parameters"][0]["name"];
//console.log(rest_api_param_definition_name)

var rest_api_param_definition = schema["definitions"][rest_api_param_definition_name];
//console.log(rest_api_param_definition)

var rest_api_param_definition_required = rest_api_param_definition["required"]
//console.log(rest_api_param_definition_required)

var api_params = [];
var params = {};

//console.log(process.argv.length)
for(let i=5;i<process.argv.length;i++)
{
	let a = process.argv[i];
	let n = a.search(":");
	if (n>0) {
		let label = a.substr(0,n);
		let value = a.substr(n+1);
		
		api_params.push(label);
		
		params[label] = value;
	}
}

var required_params_present = true

function checkRequiredPresent(item)
{
	if (!api_params.includes(item)) { console.log("Missing required parameter - "+item); required_params_present = false; }
}

rest_api_param_definition_required.forEach(checkRequiredPresent);
if (!required_params_present) return;

//

if (api_method == "post") requestPOST(params)

