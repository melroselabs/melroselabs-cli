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
