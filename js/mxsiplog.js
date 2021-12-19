// 202	SIP	172.28.10.99:5061	206.116.51.217:12102	Tx	2021-11-18 3:15:54 PM			1461506900-4877
let debug = false

function loadFile() {

    let logFile = document.getElementById("logFile");
    let logData = logFile.files[0];
    console.log(logData.name)

    logData.text().then(data => {
        debug ? console.log(data) : debug
        logItems(data)
    }).catch(error => {
        console.log(error)
    })
}

function logItems(items) {
    let lines = []
    lines.push(items.split(/\n/))

    let raw_packets = [];

    let payload_packet = ""
    let info_raw = ""

    let raw_regex = /[0-9]+\s+[a-zA-Z]+\s+\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b:[0-9]+\s+\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b:[0-9]+\s+[a-zA-Z]+\s+[0-9]{4}-[0-9]{2}-[0-9]{2}\s+([0-9]+(:[0-9]+)+)\s+[a-zA-Z]+/i;

    // go line by line to test the regex pattern
    for (let lineNum in lines[0]) {
        let line = lines[0][lineNum]
        if (raw_regex.test(line)) {
            if (info_raw != "") {
                raw_packets.push([info_raw, payload_packet])
                payload_packet = ""
                info_raw = ""
                debug ? console.log("clearing and pushing") : debug
            } else {
                info_raw = line
                debug ? console.log("setting info : " + info_raw) : debug
            }
        } else {
            payload_packet != "" ? payload_packet = payload_packet.concat("\n").concat(line) : payload_packet = payload_packet.concat(line)
            // add this to the current packet being made
            debug ? console.log("adding payload : " + payload_packet) : debug
        }
    }

    let json = []

    //console.log(raw_packets)
    raw_packets.forEach(info_header => json.push(parse_HEP(info_header)))

    console.log(JSON.stringify(json))
}

function updateTable(packet) {
    /*
    <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
     */

}

