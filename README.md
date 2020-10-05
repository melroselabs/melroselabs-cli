# melroselabs-cli
Melrose Labs CLI for voice, messaging, video and identity APIs

# Install
```bash
npm i melroselabs-cli
```

# Use

Set-up your API key from melroselabs.com:
```bash
$ melroselabs-cli setup sljdalsdioioqwijdqjdwqjdiwqjqw
```

Get help on commands:
```bash
$ melroselabs-cli help
Usage: melroselabs-cli <api> <service> ...

Where <api> can be:
 voice
 sms
 richmessaging
 iridium
 compression
 location
 notification
 restsmpp
 identity

For list of services for an API, type:

 melroselabs-cli <api> help

```

Make an API call:
```bash
$ melroselabs-cli voice tts create voiceText:"Hello and welcome"
File saved to out.mp3
```
