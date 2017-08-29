const net = require('net')
const hex = require('hex')

var client = net.createConnection(2416, 'server.slsknet.org')

var peers = {}

client.on('connect', function() {
  console.log('connect')
  //                      length       code         l user        user                        l pass        pass                      version
  let buf = Buffer.from('4f000000' + '01000000' + '0c000000' + '49416d576562536572766572' + '0b000000' + '' + '9d000000' +
  // l hash     hash                                                                  version
  '20000000' + '3334326566663061366637323062623335666139643366643264666162303163' + '11000000' + '08000000' + '02000000' + 'ba080000', 'hex')
  client.write(buf)
  setTimeout(() => {
    console.log('search')
    //                      length        code        ticket      l content     content
    let buf2 = Buffer.from('15000000' + '1a000000' + '0de2e116' + '09000000' + '6d6f627920706c6179', 'hex')

    //let buf2 = Buffer.from('1d000000' + '26000000' + '01010101' + '09000000' + '6d6f627920706c6179', 'hex')
    client.write(buf2)
  }, 2000)
})

let savedData

client.on('data', function(data) {
  //data = data.slice(0, 100)
  if (savedData) {
    data = Buffer.concat([savedData, data])
  }
  // must recover saved datas
  //hex(data)
  let pointer = 0
  while (pointer < data.length) {
    let oPointer = pointer
    let size = data.readUInt32LE(pointer)
    //console.log('pointer: ' + pointer.toString(16) + ' length: ' + data.length.toString(16) + ' size: ' + size.toString(16))

    if (pointer + size > data.length) {
      //save data after pointer
      //console.log('save datas')
      //savedData = data.slice(pointer, data.length)
      break
    }

    if (size == 0) {
      pointer += 4
      continue
    }

    pointer += 4
    if (data.readUInt32LE(pointer) == 18) {
      pointer += 4
      let username = data.toString('utf8', pointer + 4, pointer + 4 + data.readUInt32LE(pointer))
      pointer += 4 + username.length
      let type = data.toString('utf8', pointer + 4, pointer + 4 + data.readUInt32LE(pointer))
      pointer += 4 + type.length
      let ip = []
      for (let i = 0 ; i < 4 ; i++) {
        ip.push(data.readUInt8(pointer + i))
      }
      pointer += 4
      let port = data.readUInt32LE(pointer)
      pointer += 4
      let token = data.toString('hex', pointer, pointer + 4)
      //let token = data.readUInt32LE(pointer)
      console.log('ConnectToPeer ' + username + ' ' + type + ' ' + ip[0] + '.' + ip[1] + '.' + ip[2] + '.' + ip[3] + ':' + port + ' ' + token)

      //do this async for next times
      let conn = net.createConnection(port, ip[0] + '.' + ip[1] + '.' + ip[2] + '.' + ip[3])
      peers[username] = conn

      conn.on('connect', () => {
        let buf = Buffer.from('05' + '00000000' + token, 'hex')
      })

      conn.on('data', d => {
        console.log(username)
        hex(d)
      })

      conn.on('error', err => {
        //console.log(err)
      })
    }

    //console.log()
    //console.log()
    pointer = oPointer + size + 4
  }
})

//message length  code      content
//4 bytes         4 bytes   ...