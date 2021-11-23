// 202	SIP	172.28.10.99:5061	206.116.51.217:12102	Tx	2021-11-18 3:15:54 PM			1461506900-4877

let regex = /[0-9]+\s+[a-zA-Z]+\s+\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b:[0-9]+\s+\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b:[0-9]+\s+[a-zA-Z]+\s+[0-9]{4}-[0-9]{2}-[0-9]{2}\s+([0-9]+(:[0-9]+)+)\s+[a-zA-Z]+/i;

function loadFile() {

    let logFile = document.getElementById("logFile");
    let logData = logFile.files[0];
    console.log(logData.name)

    logData.text().then(data => {
        //console.log(data)
        logItems(data)
    }).catch(error => {
        console.log(error)
    })
}

/*
    [{}

 */

// convert to better format

function logItems(items) {
    let lines = [];
    lines.push(items.split(/\n/))

    let packets = [];
    let packet = []

    // go line by line to test the regex pattern
    for(let lineNum in lines[0]){
        let line = lines[0][lineNum]
        if(regex.test(line)) {
            if(packet.length > 0){
                packets.push(packet)
                packet = []
            }
            packet.push(line)
            // mark this line as the beginning of a new packet
            console.log("YES")
        }else{
            packet.push(line)
            // add this to the current packet being made
            console.log("NO")
        }
    }

    /*
    TODO
    init table
     */
}

function updateTable(packets){
    /*
    <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
     */
    let logTable = document.getElementById("logTable")
    for(let packet in packets){
        for(let lines in packet){

        }
    }
}

