# Soulseek NodeJS client

## ⚠ WIP
I'm currently working on this thing, and currently not usable.

Not published on NPM yet.

## Getting started
```js
const slsk = require('slsk-client')
slsk.connect({
  user: 'username',
  pass: 'password'
}, (err, client) => {
  client.search({
    req: 'random',
    timeout: 2000
  }, (err, res) => {
    if (err) return console.log(err)
    res = [
      {
        user: 'poulet',
        file: '@@poulet-music/random.mp3'
      }
    ]
    client.download({
      file: res[0]
    }, (err, buffer) => {
      //can res.send(buffer) if you use express
    })
  })
})
```

## API
### slsk
#### connect
##### argument
| key | required | value | note |
|-----|----------|-------|------|
|user| true |Your username|
|pass| true| Your password|
|host||choose a different host for Slsk server|
|port||choose a different port|
|incomingPort|Port used for incoming connection|For next version|

##### callback
Return client (see just here ⬇)

### client
#### search
##### argument
|key | value | note |
|-----|-------|------|
|req|Sent to slsk server/peers to search file, use space to add keyword|
|timeout|Slsk doesn't sent when search is finished. We ignore request after this time| Default: 2000ms|

##### callback

List of files
```json
[
  {
    "user": "jambon",
    "file": "@@jambon-slsk/myfile.m4a"
  }
]
```

#### download
Return buffered file

#### downloadFile