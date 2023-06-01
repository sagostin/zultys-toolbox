let ws
let toolkit = new CstaToolkit()

let websocketAddress;
try {
    console.log(ip.value)
    websocketAddress = `wss://${ip}:7779`;
    console.log(ip.value, websocketAddress)
    ws = new WebSocket(websocketAddress);
} catch (e) {
    console.log(e)
}
console.log("WebSocket is created now.")

ws.onerror = (e) => {
    console.log(e);
}

ws.onclose = function (event) {
    console.log(event)
    console.log("WebSocket is closed now.");
};

ws.onmessage = function (event) {
    // console.log(event)
    console.log(event)
    toolkit.parseData(event.data);
}

ws.onopen = (e) => {
    console.log("WebSocket is open now.");
    console.log(ws)
}

window.onbeforeunload = function(e) {
    ws.close()
};