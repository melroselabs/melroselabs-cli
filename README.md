<img src="https://melroselabs.com/assets/images/MelroseLabsLogo202007.svg" height="48px" alt="Melrose Labs" />

# Melrose Labs CLI
Melrose Labs Command Line Interface for voice, messaging, video and identity APIs

# Install
Use <code>npm</code> to install the package. If you don't have Node.js, then you can install it from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

```bash
npm i melroselabs-cli
```

# Use

Get API key from [_Melrose Labs Developers section_](https://melroselabs.com/developers/)

Set-up your API key from melroselabs.com:
```bash
$ melroselabs-cli setup sljdalsdioioqwijdqjdwqjdiwqjqw
```

Get help on commands:
```bash
$ melroselabs-cli help
Usage: melroselabs-cli <api> <service> ...

Where <api> can be:
 sms
 voice
 richmessaging
 iridium
 restsmpp
 compression
 location
 notification
 identity

For list of services for an API, type:

 melroselabs-cli <api> help


To set API key and update API definitions, type:

 melroselabs-cli setup <api-key>


To update API definitions, type:

 melroselabs-cli update

```

Make an API call:
```bash
$ melroselabs-cli voice tts create voiceText:"Hello and welcome"
File saved to out.mp3
```

# Examples

## Rich Messaging

Create a Card

```bash
$ melroselabs-cli richmessaging card create templateref:"10" 'data:{"propertyname":"Santorini Escape","urlimage":"https://richmsg.io/media/images/seaview-apartments.png","propertysummary":"A luxurious two-bedroom apartment with the best views over Santorini.","urldetails":"https://melroselabs.com/services/rich-messaging/","urlbooknow":"https://melroselabs.com/services/rich-messaging/"}' userref:"" callback:"" expires:""
{"messageID": "4UV", "shortURL": "https://richmsg.io/4UV"}
```

## Voice

Covert using Text-to-Speech and output as an MP3 file

```bash
$ melroselabs-cli voice tts create voiceText:"Hello and welcome"
File saved to out.mp3
```

## Iridium

Find Iridium satellites currently serving location

```bash
$ melroselabs-cli iridium satellites/visible/{location} retrieve location:55.598,-2.731
{"satellites": [{"name": "IRIDIUM 103", "signal": 0.123}, {"name": "IRIDIUM 166", "signal": 0.545}]}
```

## Location

Basic telephone number information

```bash
$ melroselabs-cli location telno/{telephoneno} get telephoneno:447944000000
{{"subject": "447944000000", "number": {"country": 44, "ndc": 4479446, "subscriber": ""}, "geo": {"country_name": "United Kingdom", "country_code": "GB", "continent": "", "continent_code": ""}, "network": {"name": "EE T-Mobile UK", "mccmnc": ["2342", "23430", "23431", "23432"]}}
```

## REST-SMPP

Send SMS

```bash
$ melroselabs-cli restsmpp sms create 'smpp_account_config:{"host":"smscsim.melroselabs.com","port":2775,"system_id":"168547","password":"5a67e0"}' 'message:{"source_addr":"447700123123","short_message":{"text":"Hello world!"}}' 'destinations:["447700888888"]'
{"transactionID": "65ed0d79-c896-4dba-ac91-2620bbdf234d", "messageID": ["3d232fbeab56d2c85035e22004dfa90f17c0"]}
```
## Identity

Note: Calls to Identity API must use an API key from https://melroselabs.com/services/one-time-password/

Create authentication domain

```bash
$ melroselabs-cli identity otp/user create domain:fd4cb8bf-2be0-48a5-b189-8416cb605ca7 user_id:mdh150599
{"domain": "fd4cb8bf-2be0-48a5-b189-8416cb605ca7", "user_id": "mdh150599", "secret": null, "type": "totp", "interval": 30}
```

Create TOTP user

```bash
$ melroselabs-cli identity otp/user create domain:fd4cb8bf-2be0-48a5-b189-8416cb605ca7 user_id:mdh150599 return_secret:true
{"domain": "fd4cb8bf-2be0-48a5-b189-8416cb605ca7", "user_id": "mdh150599", "secret": "BSG2QDVDRAJWFWLZ", "type": "totp", "interval": 30}
```

Verify TOTP code

```bash
$ melroselabs-cli identity otp/totp create domain:fd4cb8bf-2be0-48a5-b189-8416cb605ca7 user_id:mdh150599 code:673323
{"verified": true}

```
