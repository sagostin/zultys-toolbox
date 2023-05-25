'use strict';
 (function () {
let groupVal = document.querySelector('#group')
let ip = window.location.hostname;
let websocketAddress;
let mxGroupName;

let d;
let strTime;
let strDate;
let timestamp;
let roomId;
let persistId;
let pack;
let ws;
let agent;
let chatActive = true;
let timeout = null;
let typing = true;

let errorMessage = document.querySelector('p.errorM');
let ipAddress = document.querySelector('#ip');
let loadingIcon = document.querySelector('.fa-refresh');
let startChat = document.querySelector('.chat-btn');
let startChatBlock = document.querySelector('.start-chat');
let customName = document.querySelector('.chat-intro input');
let webChat = document.querySelector('.web-chat');
let chatIcon = document.querySelector('.chat-icon');
let connectAgent = document.querySelector('.connect-agent');
let messageBox = document.querySelector('.message-box');
let chatSpace = document.querySelector('.chat-space');
let messageArea = document.querySelector('.messages');
let sendChatBtn = document.querySelector('button.send-chat');
let textArea = document.querySelector('textarea');
let collapseChat = document.querySelector('.collapse-chat');
let closeChat = document.querySelector('.close-chat');
let chatNotification = document.querySelector('.chat-notification');
let timeHold = document.querySelectorAll('.time-hold span.time-info');
let modalBox = document.querySelector('.close-modal');
let modalClose = document.querySelector('.modal-btn');
let leaveChat = document.querySelector('.leave-chat');
let declineChat = document.querySelector('.declined-chat');
// let joinedAgent = document.querySelector('.joined span');
let chatLeft = document.querySelector('div.chat-left');
let agentLeft = document.querySelector('.agent-left');
let typingBlock = document.querySelector('.typing');
let chatNote = document.querySelector('.chat-note');
let waitMessage = document.querySelector('.wait-message');
let animateMessage = document.querySelector('.wait-animate');
let chatRoom = document.querySelector('.chat-room');

// // let declinedBtn = document.querySelector('.declined-chat');
let chatState;
function hideConnectState() {
    waitMessage.classList.remove('visible');
    animateMessage.classList.remove('visible');
}

 function showConnectState() {
     waitMessage.classList.add('visible')
     animateMessage.classList.add('visible')
 }
function updateTime (){
    d = new Date();
    timestamp = Math.floor(Date.now() / 1000);
    strTime = d.toLocaleString(['en-US'], { hour: '2-digit', minute: '2-digit' });
    strDate = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
}

let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

let timeInfo = new Date();
for (let i = 0; i < timeHold.length; ++i) {
    timeHold[i].innerHTML = `${months[timeInfo.getMonth()]} ${timeInfo.getDate()}, ${timeInfo.getFullYear()} `;
}

let toolkit = new CstaToolkit();

let wsClient =  {
    init: function () {
    },
    sendMessage: function (message,roomId,name) {
        var packw = toolkit.createWebChatMsgNew(
            message,roomId,name,
            function (data) {
            }
        );
        ws.send(packw);
    },
    sendStatus: function(ackCode, msgId, persistId, recipId, groupId, ackType, from, fromName, roomId,timestamp,action,group){
        var status = toolkit.createImMsgAckStatus(
            ackCode, msgId, persistId, recipId, groupId, ackType, from, fromName, roomId,timestamp,action,group,
            function (data) {
            }
        );
        ws.send(status);
    }
};

// var PageTitleNotification = {
//     Vars:{
//         OriginalTitle: document.title,
//         Interval: null
//     },
//     On: function(notification, intervalSpeed){
//         var _this = this;
//         _this.Vars.Interval = setInterval(function(){
//             document.title = (_this.Vars.OriginalTitle == document.title)
//                 ? notification
//                 : _this.Vars.OriginalTitle;
//         }, (intervalSpeed) ? intervalSpeed : 1000);
//     },
//     Off: function(){
//         clearInterval(this.Vars.Interval);
//         document.title = this.Vars.OriginalTitle;
//     }
// }

     function clearOldSystemMessage(){
         [].forEach.call(document.querySelectorAll('.system-messages'),function(e){
             e.parentNode.removeChild(e);
         });
     }

function clearOldStatus(){
    [].forEach.call(document.querySelectorAll('.m-status'),function(e){
        e.parentNode.removeChild(e);
    });
}

 function clearOldStatusSeen(){
     [].forEach.call(document.querySelectorAll('.m-status-seen'),function(e){
         console.dir(e.parentNode.classList.remove('seen-m'))
         e.parentNode.removeChild(e);
     });
 }


 function createName(name){
    console.log(name)
     return name.split(' ').map(function (item,index) {
         if (index<2){
             return item[0].toUpperCase()}
     }).join('');
 }


 function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
    var loadPromise;
     var cancelNextLoad = function() {
         clearInterval(loadPromise);
     };
     function keepAlive(){
         cancelNextLoad()
         let msg =  toolkit.createKeepAlive()
         ws.send(msg)
         loadPromise = setInterval(keepAlive,30000)
     }
var callEventHandlers = function (eventName, eventData) {
    if(eventName === 'csta_error'){
        setTimeout(function () {
            chatError()
            errorMessage.style.display = 'block';
            errorMessage.innerHTML = `${eventData.error}`
        },1000);
        ws.close()
        return
    }
    if (eventData.statusNew === 'PARTNER_CONNECTED') {
        wsClient.sendMessage('Intro text: '+params.text+'; Page name: '+params.pageName);
        createNewChatMessage('out','Intro text: '+params.text+'; Page name: '+params.pageName);
    }
    if(eventName=== 'im_msg_ack' && eventData.ackCode === 'IMS_WC_ACCEPTED'){
        roomId =  eventData.roomId;
        agent = eventData.agent;
        chatState ='connected';
        console.log(chatState)
        keepAlive()
        // joinedAgent.innerHTML = `${eventData.agent} joined`
        setTimeout(function () {
            // connectAgent.classList.remove('visible');
            hideConnectState()
            chatSpace.style.display = 'block';
            messageBox.style.pointerEvents = 'all';
            // clearOldSystemMessage();
        },1500)



    }
    if (eventData.ackCode === 'IMS_WC_CANCELLED'){
        console.log(eventData)
        console.log('zac cancelled chat');
        if(chatState!=='decline') {
            chatState = 'cancel';
        }
        ws.close()
        // agentLeft.innerHTML = `${eventData.agent} left the chat`
        setTimeout(function () {
            hideConnectState()
            // connectAgent.classList.remove('visible');
            chatSpace.style.display = 'block';
            agentLeft.innerHTML = `Customer support agents are busy, please try again later`
            chatLeft.style.display = 'block';
            chatNote.style.display = 'none';
            messageBox.style.pointerEvents = 'none';
            updateScrollText();
        },1000)
        // updateScrollText()
    }
    if (eventData.ackCode === 'IMS_WC_DECLINED'){

        console.log('zac declined chat');
        console.log(eventData)
        chatState = 'decline';
        hideConnectState()
        clearOldSystemMessage();
        // typingBlock.style.display = 'none';
        // setTimeout(function () {
        //     connectAgent.classList.remove('visible');
        //     chatSpace.style.display = 'block';
        //     agentLeft.innerHTML = `Customer support agents are busy, please try again later`
        //     chatLeft.style.display = 'block';
        //     chatNote.style.display = 'none';
        //     messageBox.style.pointerEvents = 'none';
        // },1500)
        updateScrollText()
    }

    if (eventData.ackCode === 'IMS_DELIVERED'){
        console.log('zac delivered message');
        if (!messageArea.children[messageArea.children.length-1].classList.contains('out-message')
            || messageArea.children[messageArea.children.length-1].classList.contains('seen-m')){
            return
        }
        clearOldStatus()
        messageArea.children[messageArea.children.length-1].setAttribute('data-id',eventData.persistId);
        console.dir( messageArea.children[messageArea.children.length-1])
        let node = document.createElement("DIV");
        node.setAttribute('class','m-status')// Create a <li> node
        let textnode = document.createTextNode("Delivered");
        node.appendChild(textnode);
        messageArea.children[messageArea.children.length-1].appendChild(node)
    }

    if (eventData.ackCode === 'IMS_SEEN'){
        console.log('zac seen message');
        console.log(eventData.persistId);
        if (!messageArea.children[messageArea.children.length-1].classList.contains('out-message')){
            return
        }
        clearOldStatusSeen()
        // console.log(messageArea.children[messageArea.children.length-1].lastChild.className)
        // if(messageArea.children[messageArea.children.length-1].lastChild.className !=='incom-message'){
        //     messageArea.children[messageArea.children.length-1].setAttribute('data-id',eventData.persistId);
        //     messageArea.children[messageArea.children.length-1].lastChild.innerHTML = 'Seen'
        // }
        let el = document.querySelector(`[data-id='${eventData.persistId}']`);
        console.log(el)
        if(el===null && el.attributes['seen']==='true'){
            return
        }
        el.classList.add('seen-m');
        el.setAttribute('seen',true);
        console.dir(el);
        if(el.lastChild.className ==='m-status'){
            el.removeChild(el.lastChild)
        }
        let node = document.createElement("DIV");
        node.setAttribute('class','m-status-seen')// Create a <li> node
        let textnode = document.createTextNode("Seen");
        node.appendChild(textnode);
        console.log('appended')
        el.appendChild(node)
    }

    if(eventData.ackCode === 'IMS_TYPING'){
        if(eventData.status === 'true'){
            typingBlock.style.display = 'block';
            typingBlock.innerHTML = `<p class="find-agent">${eventData.agent} is typing<span>.</span><span>.</span><span>.</span></p>`
        } else {
            typingBlock.style.display = 'none';
        }
    }
    if(eventName === 'message'){
        if(eventData.fromName===null){
            eventData.fromName = 'ZAC'
        }
        var d = new Date(parseInt(eventData.timestamp*1000))
        let strTime = d.toLocaleString(['en-US'], { hour: '2-digit', minute: '2-digit' });
        let strDate = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
        eventData.time = strTime;
        eventData.date = strDate;
        console.log('message type event');
    }
    if(eventName === 'im_msg'){
        if (document.hidden) {
            console.log('tab hidden')
        }
        if(!chatActive) {
            if(chatNotification.firstElementChild.innerHTML === ''){
                chatNotification.style.display ='block';
                chatNotification.firstElementChild.innerHTML = 0;
            }
            chatNotification.firstElementChild.innerHTML = parseInt(chatNotification.firstElementChild.innerHTML) + 1;
        }
        if(eventData.fromName===null){
            eventData.fromName = eventData.fromId
        }
        if(chatActive && !document.hidden) {
            checkElementViewability();
        }
        if(eventData.packetType === 'PTC_SYS'){
            console.log('system message');
            console.dir(eventData);
            console.log(chatState);
            let d = new Date(parseInt(eventData.timestamp*1000))
            let strTime = d.toLocaleString(['en-US'], { hour: '2-digit', minute: '2-digit' });
            let node = document.createElement("DIV");
            node.setAttribute('class','system-messages');
            node.style.clear = 'both';
            node.innerHTML = `<span class="time-info"> ${strTime}</span> ${eventData.msg}`
            if(chatState === 'connecting'){
                connectAgent.appendChild(node)
            } else {
                messageArea.appendChild(node)
            }
            // let div = document.createElement('div');
            // div.classList.add('system-m')
            // div.innerHTML = `${eventData.msg}`;
            // waitMessage.appendChild(div)
            // updateTime ();
            return
        }
        agent = eventData.fromName;
        let d = new Date(parseInt(eventData.timestamp*1000))
        let strTime = d.toLocaleString(['en-US'], { hour: '2-digit', minute: '2-digit' });
        let strDate = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
        eventData.time = strTime;
        eventData.date = strDate;
        updateTime ();
        //console.log(timestamp)
        console.log(eventData)
        persistId = eventData.persistId;
        wsClient.sendStatus('IMS_DELIVERED',eventData.msgId,eventData.persistId,'','','WebChat','',customName.value,roomId, timestamp);
        // wsClient.sendStatus('IMS_SEEN','',eventData.persistId,'','','WebChat','',customName.value,roomId, timestamp);
        createNewChatMessage('in', eventData);
    }
};


document.addEventListener('visibilitychange', function(){
    if (document.hidden) {
        console.log('tab hidden')
    }
})

function isElementInView(element) {
    var containerRect = chatRoom.getBoundingClientRect();
    var elementBoundingBox = element.getBoundingClientRect();
    var elementTopY = elementBoundingBox.top - containerRect.top;
    var elementBottomY = (elementBoundingBox.top - containerRect.top) + elementBoundingBox.height;
    return elementTopY >= 0 && elementBottomY <= Math.min(chatRoom.clientHeight || 0);
}
var checkElementViewability = debounce(function () {
    let elements = document.querySelectorAll(".in-message .chat-txt span.message-txt");
    // console.log(elements)
    for(let i = 0; i < elements.length; i++) {
        if(isElementInView(elements[i])) {
            if(!elements[i].hasAttribute('seen')){
                elements[i].setAttribute('seen',true);
                wsClient.sendStatus('IMS_SEEN','',elements[i].parentNode.parentNode.parentNode.attributes['data-id'].value,'','','WebChat','',customName.value,roomId, timestamp);
            }
            // console.log("Element " + i + " is viewable");
        } else {
            // console.log("Element " + i + " is not viewable");
        }
    }
},250)

var proceedSession = function () {
    toolkit.setupEventCallbacks(
        function (event) {
            callEventHandlers('delivered', event);
        },
        function (event) {
            callEventHandlers('established', event);
        },
        function (event) {
            callEventHandlers('cleared', event);
        },
        function (event) {
            callEventHandlers('parked', event);
        },
        function (event) {
            callEventHandlers('held', event);
        },
        function (event) {
            callEventHandlers('retrieved', event);
        },
        function (event) {
            callEventHandlers('assigned', event);
        },
        function (event) {
            callEventHandlers('presence', event);
        },
        function (event) {
            callEventHandlers('csta_error', event);
        },
        function (event) {
            callEventHandlers('network_error', event);
        },
        function (event) {
            callEventHandlers('call_log', event);
        },
        function (event) {
            callEventHandlers('status', event);
        },
        function (event) {
            callEventHandlers('config', event);
        },
        function (event) {
            callEventHandlers('partner', event);
        },
        function (event) {
            callEventHandlers('message', event);
        },
        function (event) {
            callEventHandlers('agent_deleted', event);
        },
        function (event) {
            callEventHandlers('agent_added', event);
        },
        function (event) {
            callEventHandlers('im_msg', event);
        },
        function (event) {
            callEventHandlers('im_msg_ack', event);
        },
        function (event) {
            callEventHandlers('ws_agent_added', event);
        },
        function (event) {
            callEventHandlers('ws_agent_deleted', event);
        }
    );
    ws.send(pack)
}

function isOpen(ws) {
    return ws.readyState === ws.OPEN
}

function chatWaiting(){
    startChatBlock.style.display = 'none';
    chatRoom.classList.add('visible');
    connectAgent.classList.add('visible');
    showConnectState();
    messageBox.style.display = 'flex';
    messageBox.style.pointerEvents = 'none';
}
function setupWS (){
    try {
        console.log(ip.value)
        websocketAddress  = `wss://${ip}:7779`;
        console.log(ip.value,websocketAddress)
        mxGroupName = groupVal.value;
        ws = new WebSocket(websocketAddress);
        errorMessage.style.display = 'none';
    } catch (e) {
        console.log(e);
        console.log(groupVal.value,ip.value)
        // getChatInfo.classList.remove('loading')
        chatError()
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'Incorrect MX IP/DNS address configured in script.js';
        return
    }
    chatState = 'connecting';
    chatWaiting()

    ws.onopen = (e) => {
        ws.send('{session_id: ""}')
        console.log("WebSocket is open now.");
        console.log(ws)
    }


    ws.onerror = (e) => {
        console.log(e);
        cancelNextLoad()
        chatError();
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'Please enter valid MX IP/DNS address';
    }

    ws.onclose = function(event) {
        console.log(event)
        cancelNextLoad()
        console.log("WebSocket is closed now.");
        typingBlock.style.display = 'none';

        if(errorMessage.style.display === 'block'){
            wsClient.sendStatus('IMS_WC_CANCELLED','','','','','WebChat','',customName.value,roomId, timestamp);
            return
        }else {
            setTimeout(function () {
                // connectAgent.classList.remove('visible');
                // chatSpace.style.display = 'block';
                hideConnectState()
                if (chatState === 'cancel'){
                    agentLeft.innerHTML = `Thank you for chatting with us. We are always happy to help you!`
                } else if(chatState === 'decline'){
                    clearOldSystemMessage()
                    agentLeft.innerHTML = `Customer support agents are busy, please try again later`;
                } else if(chatState ==='restarted'){
                    clearOldSystemMessage()
                    chatLeft.style.display = 'none';
                    return
                }
                else {
                    agentLeft.innerHTML = `Network connection lost, please restart chat`;

                }
                chatLeft.style.display = 'block';
                chatNote.style.display = 'none';
                messageBox.style.pointerEvents = 'none';
            },1000)
            updateScrollText()
        }
    };


    pack = toolkit.createCommunication(
        'IMS_WC_REQUEST',
        '0',
        '0',
        "",
        'WebChat',mxGroupName,customName.value,
        function () {}
    );
    ws.onmessage=function(event){
        // console.log(event)
        if (isSessionToken(event.data)) {
            proceedSession(event.data);
        } else {
            // console.log(event)
            toolkit.parseData(event.data);
        }
    }


}

     window.onbeforeunload = function(e) {
         ws.close()
     };

var isSessionToken = function (message) {
    return (message.indexOf("session_valid") != -1);
};

function updateScrollText(){
    chatRoom.scrollTop = chatRoom.scrollHeight;
}

function createNewChatMessage(type,data) {
    if(type==='out'){
        updateTime()
        var div = document.createElement('div')
        div.classList.add('out-message')
        div.innerHTML = `<div class="incom-message" >
        <div class="out-message-text">
        <p class=""><span >${textArea.value}</span>
        <span class="time-message">${strTime}</span></p>
        </div>
        </div>`

        if(messageArea.children[messageArea.children.length-1] && messageArea.children[messageArea.children.length-1].classList.contains('out-message')){
            console.log('same out');
            div.classList.add('add-out-top')
        }
        messageArea.appendChild(div)
        textArea.value = '';
        clearOldStatus();
        // updateScrollText()
    } else {
        let scrolled;
        let username;
        if (chatRoom.scrollHeight - chatRoom.scrollTop === chatRoom.clientHeight)
        {
            scrolled = true;
        }
        var div = document.createElement('div');
        div.setAttribute("agent-id", data.fromId);
        div.classList.add('in-message');
        console.log(data)
        if(!data.fromName) {
            username = data.fromId;
        } else {
            username = data.fromName;
        }
        console.log(data);
        div.innerHTML = `<div class="incom-message" data-id="${data.persistId}" >
                         <span class="user-w">${createName(username)}</span>
                        <span class="agent-name">${agent}</span>
                        <div class="in-message-text" >
                            <p class="chat-txt"><span class="message-txt">${data.msg}</span>
                                <span class="time-message">${strTime}</span>
                            </p>
                                <!--<span class="time-message">05:56 PM</span>-->
                        </div>
                    </div>`

        if(messageArea.children[messageArea.children.length-1] && messageArea.children[messageArea.children.length-1].attributes['agent-id']!==undefined){
            if(messageArea.children[messageArea.children.length-1].attributes['agent-id'].value === data.fromId ){
                console.log('same Sender')

                div.innerHTML = `<div class="incom-message" data-id="${data.persistId}" >
                        <div class="in-message-text" >
                            <p class="chat-txt"><span class="message-txt">${data.msg}</span>
                                <span class="time-message">${strTime}</span>
                            </p>
                                <!--<span class="time-message">05:56 PM</span>-->
                        </div>
                    </div>`
                div.classList.add('add-m-top')
            }
        }


        messageArea.appendChild(div);
        if(scrolled){
            updateScrollText();
        }
    }
}

function removeErrorMessages(i){
    i.srcElement.classList.remove("border-red-500");
    errorMessage.style.visibility = 'hidden'
}

sendChatBtn.addEventListener('click',function () {
    if(!textArea.value || !textArea.value.trim()){
        textArea.value = '';
        return
    }

    updateTime ();
    wsClient.sendMessage(textArea.value,roomId,customName.value);
    createNewChatMessage('out',textArea.value);
    updateScrollText();
    sendChatBtn.firstElementChild.src = 'img/send.svg';
})

textArea.addEventListener("keydown", function(event) {
    if (event.keyCode == 13 && !event.shiftKey) {
        if(!textArea.value || !textArea.value.trim()){
            textArea.value = '';
            event.preventDefault()
            return
        }
        updateTime ();
        wsClient.sendMessage(textArea.value,roomId,customName.value);
        createNewChatMessage('out',textArea.value);
        updateScrollText();
        sendChatBtn.firstElementChild.src = 'img/send.svg';
        event.preventDefault()
        // Do more work
    }
});

textArea.onkeyup = function (e) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
        wsClient.sendStatus('IMS_TYPING','',persistId,'','','WebChat','',customName.value,roomId, timestamp,false,mxGroupName);
        typing = true;
    }, 500);

};

textArea.addEventListener("input", function (e) {
    if(typing){
        wsClient.sendStatus('IMS_TYPING','',persistId,'','','WebChat','',customName.value,roomId, timestamp,true,mxGroupName);
    }
    if(textArea.value === '') {
        sendChatBtn.firstElementChild.src = 'img/send.svg';
    } else {
        sendChatBtn.firstElementChild.src = 'img/sending.svg';
    }
    typing = false;

});

let resizeHandle = document.getElementById('resizable');
resizeHandle.addEventListener('mousedown', initialiseResize, false);
let original_width = 0;
let original_height = 0;
const minimum_size = 300;
const minimum_height = 450;
let original_x = 0;
let original_y = 0;
let original_mouse_x = 0;
let original_mouse_y = 0;

function initialiseResize(e) {
    e.preventDefault()
    original_width = parseFloat(getComputedStyle(webChat, null).getPropertyValue('width').replace('px', ''));
    original_height = parseFloat(getComputedStyle(webChat, null).getPropertyValue('height').replace('px', ''));
    original_x = webChat.getBoundingClientRect().left;
    original_y = webChat.getBoundingClientRect().top;
    original_mouse_x = e.pageX;
    original_mouse_y = e.pageY;
    window.addEventListener('mousemove', startResizing, false);
    window.addEventListener('mouseup', stopResizing, false);
}

function stopResizing(e) {
    checkElementViewability()
    console.log('stopped')
    window.removeEventListener('mousemove', startResizing, false);
    window.removeEventListener('mouseup', stopResizing, false);
}
//


function startResizing(e) {
    const width = original_width - (e.pageX - original_mouse_x)
    const height = original_height - (e.pageY - original_mouse_y)
    if (width >= minimum_size) {
        webChat.style.width = width + 'px'
        // webChat.style.left = original_x + (e.pageX - original_mouse_x) + 'px';
    }
    if (height >= minimum_size && height >= minimum_height) {
        webChat.style.height = height + 'px'
        // webChat.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
        chatRoom.style.height = height - 149 + 'px';
    }
}

function startChatting(){
    if(!customName.value){
        return
    }
    setupWS()
}

function hideChat() {
    chatActive = !chatActive
    console.log(chatActive)
    if(!chatActive) {
        if(chatNotification.firstElementChild.innerHTML === ''){
            chatNotification.style.display ='none';
        } else {
            chatNotification.style.display ='block';
        }
        webChat.style.display ='none';
        chatIcon.style.display ='block';
    } else {
        chatNotification.firstElementChild.innerHTML = '';
        webChat.style.display ='block';
        chatIcon.style.display ='none';
        chatNotification.style.display ='none';
    }
}

function showModal() {
    modalBox.style.display = 'block';
}

function closeModal() {
    modalBox.style.display = 'none';
}

function stopChat() {
    closeModal();
    chatError();
    console.log('clicked')
    chatLeft.style.display = 'none';
    console.dir(messageArea);
    chatRoom.classList.remove('visible')
    chatState = 'restarted'
    customName.value = '';
    messageArea.innerHTML = '';
    [].forEach.call(document.querySelectorAll('.system-m'),function(e){
        e.parentNode.removeChild(e);
    });
    clearOldSystemMessage()
    wsClient.sendStatus('IMS_WC_CANCELLED','','','','','WebChat','',customName.value,roomId, timestamp);
    ws.close()
    hideChat();
}

     function restartChat() {
         clearOldSystemMessage()
         closeModal();
         chatError();
         console.log('clicked')
         chatLeft.style.display = 'none';
         console.dir(messageArea)
         customName.value = '';
         messageArea.innerHTML = '';
         [].forEach.call(document.querySelectorAll('.system-m'),function(e){
             e.parentNode.removeChild(e);
         });
         wsClient.sendStatus('IMS_WC_CANCELLED','','','','','WebChat','',customName.value,roomId, timestamp);
         ws.close()
         // hideChat();
     }


function chatError(){
    console.log('chat error displayed')
    chatRoom.classList.remove('visible')
    startChatBlock.style.display = 'block';
    connectAgent.classList.remove('visible');
    messageBox.style.display = 'none';
    chatSpace.style.display = 'none';
}


customName.addEventListener("keydown", function(event) {
    if (event.keyCode == 13 && !event.shiftKey) {
        startChatting();
    }
})



chatRoom.addEventListener("scroll", checkElementViewability);
declineChat.addEventListener('click',restartChat);
leaveChat.addEventListener('click',stopChat);
modalClose.addEventListener('click',closeModal);
closeChat.addEventListener('click', showModal);
chatIcon.addEventListener('click',hideChat);
collapseChat.addEventListener('click',hideChat);
startChat.addEventListener('click',startChatting);
})()