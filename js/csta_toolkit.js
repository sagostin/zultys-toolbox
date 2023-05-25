/**
 * Created by denis.solovov on 3/21/14.
 */

// var CSTA_VER = 1.0.1;

function encodeUtf8(str) {
  return unescape(encodeURIComponent(str));
}

function decodeUtf8(str) {
  return decodeURIComponent(escape(str));
}

function escapeXml(unsafe) {
    if(!unsafe){
        return
    }
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

var eCstaEvent = {
    DELIVERED: 0,
    ESTABLISHED: 1,
    CLEARED: 2,
    PARKED: 3,
    HELD: 4,
    RETRIEVED: 5,
    ASSIGNED: 6,
    PRESENCE: 7,
    CSTA_ERROR: 8,
    NETWORK_ERROR: 9, //should be called on socket close
    CALL_LOG:10,
    WC_STATUS:11,
    WC_CONFIG:12,
    WC_PARTNER:13,
    WC_MSG:14,
    AGENT_DELETED: 15,
    AGENT_ADDED: 16,
	IM_MSG : 17,
	IM_MSG_ACK : 18,
    WC_AGENT_ADDED: 19,
    WC_AGENT_DELETED: 20,
    IM_GROUP_USER_ADDED: 21,
    IM_GROUP_USER_REMOVED: 22,
    EW_LOGIN_RESPONSE: 23,
    SCREENSHARE_START_GROUP: 24,
    SCREENSHARE_STOP_GROUP: 25,
    SCREENSHARE_TOKEN:26,
    SCREENSHARE_START_USER: 27,
    SCREENSHARE_STOP_USER: 28,
    UNKNOWN: 100
};

var eCstaBind = {
    CURRENT: 0,
    DEVICEID: 1,
    EXTERNAL: 2
};

var eAgentLoginState = {
  LOGGEDON: 0,
  LOGGEDOFF: 1
};

//csta events
function DeliveredEvent(monitorId,
                        callId,
                        deviceId,
                        alertingDevice,
                        alertingDisplayName,
                        networkCallingDevice,
                        callingDevice,
                        calledDevice,
                        lastRedirectionDevice,
                        localConnectionInfo,
                        cause)
{
    this.monitorId = monitorId;
    this.callId = callId;
    this.deviceId = deviceId;
    this.alertingDevice = alertingDevice;
    this.alertingDisplayName = alertingDisplayName;
    this.networkCallingDevice = networkCallingDevice;
    this.callingDevice = callingDevice;
    this.calledDevice = calledDevice;
    this.lastRedirectionDevice = lastRedirectionDevice;
    this.localConnectionInfo = localConnectionInfo;
    this.cause = cause;

    console.log('DeliveredEvent created');
}

function EstablishedEvent(monitorId,
                        callId,
                        deviceId,
                        answeringDevice,
                        answeringDisplayName,
                        callingDisplayName,
                        callingDevice,
                        calledDevice,
                        lastRedirectionDevice,
                        cause)
{
    this.monitorId = monitorId;
    this.callId = callId;
    this.deviceId = deviceId;
    this.answeringDevice = answeringDevice;
    this.answeringDisplayName = answeringDisplayName;
    this.callingDevice = callingDevice;
    this.callingDisplayName = callingDisplayName;
    this.calledDevice = calledDevice;
    this.lastRedirectionDevice = lastRedirectionDevice;
    this.cause = cause;

    console.log('EstablishedEvent created');
}

function ClearedEvent(monitorId,
                    callId,
                    deviceId,
                    releasingDevice,
                    localConnectionInfo,
                    cause)
{
    this.monitorId = monitorId;
    this.callId = callId;
    this.deviceId = deviceId;
    this.releasingDevice = releasingDevice;
    this.localConnectionInfo = localConnectionInfo;
    this.cause = cause;

    console.log('ClearedEvent created');
}

function HeldEvent(monitorId,
                   callId,
                   deviceId,
                    holdingDevice,
                    localConnectionInfo,
                    cause)
{
    this.monitorId = monitorId;
    this.callId = callId;
    this.deviceId = deviceId;
    this.holdingDevice = holdingDevice;
    this.localConnectionInfo = localConnectionInfo;
    this.cause = cause;
}

function RetrievedEvent(monitorId,
                        callId,
                        deviceId,
                        retrievingDevice,
                        localConnectionInfo,
                        cause)
{
    this.monitorId = monitorId;
    this.callId = callId;
    this.deviceId = deviceId;
    this.retrievingDevice = retrievingDevice;
    this.localConnectionInfo = localConnectionInfo;
    this.cause = cause;
}

function ParkedEvent(monitorId, parkId)
{
    this.monitorId = monitorId;
    this.parkId = parkId;
}

function PresenceEvent(from, status)
{
    this.from = from;
    this.status = status;
}

function AssignedEvent(device, type)
{
    this.device = device;
    this.type = type;
}

function CstaErrorEvent(errorMessage)
{
    this.errorMessage = errorMessage;
}

function NetworkErrorEvent(errorMessage)
{
    this.errorMessage = errorMessage;
}

function WcStatus(status, cause)
{
    this.status = status;
    this.cause = cause;
}

function WcConfig(msgLen)
{
    this.msgLen = msgLen;
}

function WcPartner(name, id, timestamp, statusOld, statusNew)
{
    this.name = name;
    this.id = id;
    this.timestamp = timestamp;
    this.statusOld = statusOld;
    this.statusNew = statusNew;
}

function WcMsg(name, id, timestamp, msg)
{
    this.name = name;
    this.id = id;
    this.timestamp = timestamp;
    this.msg = msg;
}

function AgentDeleted(roleId)
{
    this.roleId = roleId;
}

function AgentAdded(roleId, roleName, roleExt, loggedOnState, loginAvailable, enabled, isSupervisor, priority, mailboxAccess, canCall, canChat)
{
    this.roleId = roleId;
    this.roleName = roleName;
    this.roleExt = roleExt;
    this.loggedOnState = (loggedOnState == 'true');
    this.loginAvailable = (loginAvailable == 'true');
    this.enabled = (enabled == 'true');
    this.isSupervisor = (isSupervisor == 'true');
    this.priority = priority;
    this.mailboxAccess = (mailboxAccess == 'true');
    this.canCall = (canCall == 'true');
    this.canChat = (canChat == 'true');
}

function ImMsg(persistId, recipType, packetType, toRecipName, toRecipId, fromName, fromId, delivered, seen, text, roomId,timestamp,msgId)
{
    this.persistId = persistId;
    this.recipType = recipType;
    this.packetType = packetType;
    this.toRecipName = toRecipName;
    this.fromId = fromId;
    this.toRecipId = toRecipId;
    this.fromName = fromName;
    this.delivered = delivered;
    this.seen = seen;
    this.msg = text;
    this.roomId = roomId;
    this.timestamp = timestamp;
    this.msgId = msgId;
}

// function AgentUpdate() {
//
// }

function ImMsgAck(persistId, ackCode, recipId, recipType, roomId, agent,status,from)
{
    this.persistId = persistId;
    this.ackCode = ackCode;
    this.recipId = recipId;
    this.recipType = recipType;
    this.roomId = roomId;
    this.agent = agent;
    this.status = status;
    this.agentId = from;
}

function CallLogInfo(missed,
                     outgoing,
                     id,
                     startCall,
                     endCall,
                     callingNo,
                     calledNo,
                     firstName,
                     lastName,
                     ext,
                     serviceName,
                     serviceExt)
{
    this.missed = missed;
    this.outgoing = outgoing;
    this.missed = id;
    this.startCall = startCall;
    this.endCall = endCall;
    this.callingNo = callingNo;
    this.calledNo = calledNo;
    this.name = this.buildName(firstName, lastName, serviceName, serviceExt, outgoing, callingNo, calledNo);
    this.ext = ext;
    this.serviceName = serviceName;
    this.serviceExt = serviceExt;
}

CallLogInfo.prototype.buildName = function(firstName, lastName, serviceName, serviceExt, outgoing, callingNo, calledNo)
{
    var name = '';
    if (firstName.length > 0)
        name = firstName;
    if (lastName.length > 0)
        name = name + ' ' + lastName;
    if (name.length == 0)
        name = serviceName;
    if (name.length == 0)
        name = serviceExt;
    if ((name.length == 0) && outgoing)
        name = calledNo;
    if ((name.length == 0) && !outgoing)
        name = callingNo;

    return name;
}

function CallLog()
{
    this.records = new Array();
}

CallLog.prototype.Add = function(info)
{
    this.records.push(info);
}

function Presence(from, status)
{
    this.from = from;
    this.status = status;
}

function RoleInfo(roleId, roleName, roleExt, loggedOnState, loginAvailable)
{
    this.roleId = roleId;
    this.roleName = roleName;
    this.roleExt = roleExt;
    this.loggedOnState = loggedOnState == 'true';
    this.loginAvailable = loginAvailable == 'true';
}

function Roles()
{
    this.records = new Array();
}

Roles.prototype.Add = function(info)
{
    this.records.push(info);
}
/////
function RoleLoginInfo(success, name)
{
    this.success = success;
    this.name = name;
}

function RolesLogin()
{
    this.records = new Array();
}

RolesLogin.prototype.Add = function(info)
{
    this.records.push(info);
}

//\csta events

//parsers
function GeneralResponse(isError, errorMsg)
{
    this.isError = isError;
    this.errorMsg = errorMsg;
}

function LoginResponse(isError, errorMsg, apiVersion, ext, userId, wwwUuid)
{
    this.isError = isError;
    this.errorMsg = errorMsg;
    this.apiVersion = apiVersion;
    this.ext = ext;
    this.userId = userId
    this.wwwUuid = wwwUuid
}

function LogoutResponse(isError, errorMsg, forced)
{
    this.isError = isError;
    this.errorMsg = errorMsg;
    this.forced = forced;
}

function GetAgentResponse(isError, errorMsg, roles)
{
    this.isError = isError;
    this.errorMsg = errorMsg;
    this.roles = roles;
}

function SetAgentResponse(isError, errorMsg, roles)
{
    this.isError = isError;
    this.errorMsg = errorMsg;
    this.roles = roles;
}

function MonitorStartResponse(isError, errorMsg, monitorId)
{
    this.isError = isError;
    this.errorMsg = errorMsg;
    this.monitorId = monitorId;
}

function MakeCallResponse(isError, errorMsg, callId, deviceId)
{
    this.isError = isError;
    this.errorMsg = errorMsg;
    this.callId = callId;
    this.deviceId = deviceId;
}

//ErrorParser
function ErrorParser(domParser)
{
    this.parser = domParser;
    this.isError = false;
    this.errorMsg = "";
}

ErrorParser.prototype.Parse = function(xmlDoc,type)
{
    if (type==='csta') {
        if (xmlDoc.getElementsByTagName("operation")[0] != null)
            this.errorMsg = xmlDoc.getElementsByTagName("operation")[0].childNodes[0].nodeValue;

        this.isError = (this.errorMsg != null )&& (this.errorMsg.length != 0);
        console.log(this.isError)
        return
    }
    if (xmlDoc.getElementsByTagName("privateErrorCode")[0] != null)
        this.errorMsg = xmlDoc.getElementsByTagName("privateErrorCode")[0].childNodes[0].nodeValue;

    if (xmlDoc.getElementsByTagName("operation")[0] != null)
        this.errorMsg = xmlDoc.getElementsByTagName("operation")[0].childNodes[0].nodeValue;

    this.isError = (this.errorMsg != null )&& (this.errorMsg.length != 0);
}

//\ErrorParser

//GeneralParser
function GeneralParser(domParser, responseCb)
{
    this.parser = domParser;
    this.errorParser = new ErrorParser(this.parser);
    this.responseCb = responseCb;

}

GeneralParser.prototype.Parse = function(message)
{
    console.log(message, 'parsed error')
    //there are 3 possible outputs for login request:1)LoginResponse;2)LoginFailed;3)CstaErrorCode
    var xmlDoc = this.parser.parseFromString(message, "text/xml");
    this.errorParser.Parse(xmlDoc);

    return new GeneralResponse(this.errorParser.isError, this.errorParser.errorMsg);
}

//LoginParser
function LoginParser(domParser, responseCb)
{
    this.parser = domParser;
    this.errorParser = new ErrorParser(this.parser);
    this.responseCb = responseCb;

    this.apiVersion = "";
    this.ext = "";
}

LoginParser.prototype.parseLoginResponse = function(xmlDoc)
{
    //LoginResponse of LoginFailed can be here
    if (xmlDoc.getElementsByTagName("loginResponce")[0] != null)
    {
        this.apiVersion = xmlDoc.getElementsByTagName("loginResponce")[0].getAttribute("apiversion");
        this.ext = xmlDoc.getElementsByTagName("loginResponce")[0].getAttribute("ext");
        this.userId = xmlDoc.getElementsByTagName("loginResponce")[0].getAttribute("userId");
        this.wwwUuid = xmlDoc.getElementsByTagName("loginResponce")[0].getAttribute("wwwUuid");
    }
    else if (xmlDoc.getElementsByTagName("loginFailed")[0] != null)
    {
        this.errorParser.isError = true;
        this.errorParser.errorMsg = xmlDoc.getElementsByTagName("loginFailed")[0].childNodes[0].nodeValue;
    }
    else
        console.log('Unexpected login response format');
}

LoginParser.prototype.Parse = function(message)
{
    //there are 3 possible outputs for login request:1)LoginResponse;2)LoginFailed;3)CstaErrorCode
    var xmlDoc = this.parser.parseFromString(message, "text/xml");
    this.errorParser.Parse(xmlDoc);

    if (!this.errorParser.isError)
        this.parseLoginResponse(xmlDoc);

    return new LoginResponse(this.errorParser.isError, this.errorParser.errorMsg, this.apiVersion, this.ext, this.userId, this.wwwUuid);
}

//Logout parser
function LogoutParser(domParser, responseCb)
{
    this.parser = domParser;
    this.errorParser = new ErrorParser(this.parser);
    this.responseCb = responseCb;

    this.forced = false;
}

LogoutParser.prototype.Parse = function(message)
{
    var xmlDoc = this.parser.parseFromString(message, "text/xml");
    this.errorParser.Parse(xmlDoc);

    if (!this.errorParser.isError)
        this.forced = (xmlDoc.getElementsByTagName("Logout")[0].getAttribute("mode") === "forced");

    return new LogoutResponse(this.errorParser.isError, this.errorParser.errorMsg, this.forced);
}

//MonitorStart parser
function MonitorStartParser(domParser, responseCb)
{
    this.parser = domParser;
    this.errorParser = new ErrorParser(this.parser);
    this.responseCb = responseCb;

    this.monitorId = "";
}

MonitorStartParser.prototype.Parse = function(message)
{
    var xmlDoc = this.parser.parseFromString(message, "text/xml");
    this.errorParser.Parse(xmlDoc);

    if (!this.errorParser.isError)
        this.monitorId = xmlDoc.getElementsByTagName("monitorCrossRefID")[0].childNodes[0].nodeValue;

    return new MonitorStartResponse(this.errorParser.isError, this.errorParser.errorMsg, this.monitorId);
}

//MakeCall parser
function MakeCallParser(domParser, responseCb)
{
    this.parser = domParser;
    this.errorParser = new ErrorParser(this.parser);
    this.responseCb = responseCb;

    this.callId = "";
    this.deviceId = "";
}

MakeCallParser.prototype.Parse = function(message)
{
    var xmlDoc = this.parser.parseFromString(message, "text/xml");
    this.errorParser.Parse(xmlDoc);

    console.log('this.errorParser.isError=' + this.errorParser.isError);
    if (!this.errorParser.isError)
    {
        this.callId = xmlDoc.getElementsByTagName("callID")[0].childNodes[0].nodeValue;
        this.deviceId = xmlDoc.getElementsByTagName("deviceID")[0].childNodes[0].nodeValue;
    }

    return new MakeCallResponse(this.errorParser.isError, this.errorParser.errorMsg, this.callId, this.deviceId);
}

//GetAgentState parser
function GetAgentParser(domParser, responseCb)
{
    console.log('getagent parser created');
    this.parser = domParser;
    this.errorParser = new ErrorParser(this.parser);
    this.responseCb = responseCb;
}

GetAgentParser.prototype.Parse = function(message)
{
    console.log('getagent parser parse');
    var xmlDoc = this.parser.parseFromString(message, "text/xml");
    this.errorParser.Parse(xmlDoc);
    var roles = new Roles();

    if (!this.errorParser.isError)
    {
        var rowCount = xmlDoc.getElementsByTagName("agentStateList")[0].getAttribute("rowCount");
        console.log('getagent parser rowCount=' + rowCount);
        for(var i = 0; i < rowCount; ++i)
        {
            var roleId = '';
            if (xmlDoc.getElementsByTagName("agentStateEntry")[i].getElementsByTagName("roleId")[0].childNodes.length > 0)
                roleId = xmlDoc.getElementsByTagName("agentStateEntry")[i].getElementsByTagName("roleId")[0].childNodes[0].nodeValue;

            var roleName = '';
            if (xmlDoc.getElementsByTagName("agentStateEntry")[i].getElementsByTagName("roleName")[0].childNodes.length > 0)
                roleName = xmlDoc.getElementsByTagName("agentStateEntry")[i].getElementsByTagName("roleName")[0].childNodes[0].nodeValue;

            var roleExt = '';
            if (xmlDoc.getElementsByTagName("agentStateEntry")[i].getElementsByTagName("roleExt")[0].childNodes.length > 0)
                roleExt = xmlDoc.getElementsByTagName("agentStateEntry")[i].getElementsByTagName("roleExt")[0].childNodes[0].nodeValue;

            var loggedOnState = '';
            if (xmlDoc.getElementsByTagName("agentStateEntry")[i].getElementsByTagName("loggedOnState")[0].childNodes.length > 0)
                loggedOnState = xmlDoc.getElementsByTagName("agentStateEntry")[i].getElementsByTagName("loggedOnState")[0].childNodes[0].nodeValue;

            var loginAvailable = '';
            if (xmlDoc.getElementsByTagName("agentStateEntry")[i].getElementsByTagName("loginAvailable")[0].childNodes.length > 0)
                loginAvailable = xmlDoc.getElementsByTagName("agentStateEntry")[i].getElementsByTagName("loginAvailable")[0].childNodes[0].nodeValue;

            var info = new RoleInfo(roleId, roleName, roleExt, loggedOnState, loginAvailable);
            roles.Add(info);
        }
    }

    return new GetAgentResponse(this.errorParser.isError, this.errorParser.errorMsg, roles);
}

//SetAgentState parser
function SetAgentParser(domParser, responseCb)
{
    this.parser = domParser;
    this.errorParser = new ErrorParser(this.parser);
    this.responseCb = responseCb;
}

SetAgentParser.prototype.Parse = function(message)
{
    var xmlDoc = this.parser.parseFromString(message, "text/xml");
    this.errorParser.Parse(xmlDoc);

    var rolesLogin = new RolesLogin();
    if (!this.errorParser.isError)
    {
        for(var i = 0; i < xmlDoc.getElementsByTagName("group").length; ++i)
        {
            var success = xmlDoc.getElementsByTagName("group")[i].getAttribute("success") == "true";
            var name = '';
            if (xmlDoc.getElementsByTagName("group")[i].childNodes.length > 0)
                name = xmlDoc.getElementsByTagName("group")[i].childNodes[0].nodeValue;

            var info = new RoleLoginInfo(success, name);
            rolesLogin.Add(info);
        }
    }

    return new SetAgentResponse(this.errorParser.isError, this.errorParser.errorMsg, rolesLogin);
}
//////////////
//csta events parser
//////////////
function parseDelivered(domParser, message)
{
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var monitorId = '';
    if (xmlDoc.getElementsByTagName("monitorCrossRefID")[0].childNodes.length > 0)
        monitorId = xmlDoc.getElementsByTagName("monitorCrossRefID")[0].childNodes[0].nodeValue;

    var callId = '';
    if (xmlDoc.getElementsByTagName("callID")[0].childNodes.length > 0)
        callId = xmlDoc.getElementsByTagName("callID")[0].childNodes[0].nodeValue;

    var deviceId = '';
    if (xmlDoc.getElementsByTagName("deviceID")[0].childNodes.length > 0)
        deviceId = xmlDoc.getElementsByTagName("deviceID")[0].childNodes[0].nodeValue;

    var alertingDevice = '';
	var tmpObj = xmlDoc.getElementsByTagName("alertingDevice")[0].getElementsByTagName("deviceIdentifier");
    if (tmpObj.length > 0 && tmpObj[0].childNodes.length > 0)
        alertingDevice = xmlDoc.getElementsByTagName("alertingDevice")[0].getElementsByTagName("deviceIdentifier")[0].childNodes[0].nodeValue;

    var alertingDisplayName = '';
    if (xmlDoc.getElementsByTagName("alertingDisplayName")[0].childNodes.length > 0)
        alertingDisplayName = xmlDoc.getElementsByTagName("alertingDisplayName")[0].childNodes[0].nodeValue;

    var networkCallingDevice = '';
	tmpObj = xmlDoc.getElementsByTagName("networkCallingDevice")[0].getElementsByTagName("deviceIdentifier");
    if (tmpObj.length > 0 && tmpObj[0].childNodes.length > 0)
        networkCallingDevice = xmlDoc.getElementsByTagName("networkCallingDevice")[0].getElementsByTagName("deviceIdentifier")[0].childNodes[0].nodeValue;

    var callingDevice = '';
	tmpObj = xmlDoc.getElementsByTagName("callingDevice")[0].getElementsByTagName("deviceIdentifier");
    if (tmpObj.length > 0 && tmpObj[0].childNodes.length > 0)
        callingDevice = xmlDoc.getElementsByTagName("callingDevice")[0].getElementsByTagName("deviceIdentifier")[0].childNodes[0].nodeValue;

    var calledDevice = '';
	tmpObj = xmlDoc.getElementsByTagName("calledDevice")[0].getElementsByTagName("deviceIdentifier");
    if (tmpObj.length > 0 && tmpObj[0].childNodes.length > 0)
        calledDevice = xmlDoc.getElementsByTagName("calledDevice")[0].getElementsByTagName("deviceIdentifier")[0].childNodes[0].nodeValue;

    var lastRedirectionDevice = '';
	tmpObj = xmlDoc.getElementsByTagName("lastRedirectionDevice")[0].getElementsByTagName("deviceIdentifier");
    if (tmpObj.length > 0 && tmpObj[0].childNodes.length > 0)
        lastRedirectionDevice = xmlDoc.getElementsByTagName("lastRedirectionDevice")[0].getElementsByTagName("deviceIdentifier")[0].childNodes[0].nodeValue;

    var localConnectionInfo = '';
    if (xmlDoc.getElementsByTagName("localConnectionInfo")[0].childNodes.length > 0)
        localConnectionInfo = xmlDoc.getElementsByTagName("localConnectionInfo")[0].childNodes[0].nodeValue;

    var cause = '';
    if (xmlDoc.getElementsByTagName("cause")[0].childNodes.length > 0)
     cause = xmlDoc.getElementsByTagName("cause")[0].childNodes[0].nodeValue;

    console.log('monitorCrossRefID=' + monitorId);
    console.log('callID=' + callId);
    console.log('deviceID=' + deviceId);
    console.log('alertingDevice=' + alertingDevice);
    console.log('alertingDisplayName=' + alertingDisplayName);
    console.log('networkCallingDevice=' + networkCallingDevice);
    console.log('callingDevice=' + callingDevice);
    console.log('calledDevice=' + calledDevice);
    console.log('lastRedirectionDevice=' + lastRedirectionDevice);
    console.log('localConnectionInfo=' + localConnectionInfo);
    console.log('cause=' + cause);

    return new DeliveredEvent(monitorId,
                                callId,
                                deviceId,
                                alertingDevice,
                                alertingDisplayName,
                                networkCallingDevice,
                                callingDevice,
                                calledDevice,
                                lastRedirectionDevice,
                                localConnectionInfo,
                                cause);
}

function parseEstablished(domParser, message)
{
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var monitorId = '';
    if (xmlDoc.getElementsByTagName("monitorCrossRefID")[0].childNodes.length > 0)
        monitorId = xmlDoc.getElementsByTagName("monitorCrossRefID")[0].childNodes[0].nodeValue;

    var callId = '';
    if (xmlDoc.getElementsByTagName("callID")[0].childNodes.length > 0)
        callId = xmlDoc.getElementsByTagName("callID")[0].childNodes[0].nodeValue;

    var deviceId = '';
    if (xmlDoc.getElementsByTagName("deviceID")[0].childNodes.length > 0)
        deviceId = xmlDoc.getElementsByTagName("deviceID")[0].childNodes[0].nodeValue;

    var answeringDevice = '';
	var tmpObj = xmlDoc.getElementsByTagName("answeringDevice")[0].getElementsByTagName("deviceIdentifier");
    if (tmpObj.length> 0 && tmpObj[0].childNodes.length > 0)
        answeringDevice = xmlDoc.getElementsByTagName("answeringDevice")[0].getElementsByTagName("deviceIdentifier")[0].childNodes[0].nodeValue;

    var answeringDisplayName = '';
    if (xmlDoc.getElementsByTagName("answeringDisplayName")[0].childNodes.length > 0)
        answeringDisplayName = xmlDoc.getElementsByTagName("answeringDisplayName")[0].childNodes[0].nodeValue;

    var callingDisplayName = '';
    if (xmlDoc.getElementsByTagName("callingDisplayName")[0].childNodes.length > 0)
        callingDisplayName = xmlDoc.getElementsByTagName("callingDisplayName")[0].childNodes[0].nodeValue;

    var callingDevice = '';
	tmpObj = xmlDoc.getElementsByTagName("callingDevice")[0].getElementsByTagName("deviceIdentifier");
    if (tmpObj.length> 0 && tmpObj[0].childNodes.length > 0)
        callingDevice = xmlDoc.getElementsByTagName("callingDevice")[0].getElementsByTagName("deviceIdentifier")[0].childNodes[0].nodeValue;

    var calledDevice = '';
	tmpObj = xmlDoc.getElementsByTagName("calledDevice")[0].getElementsByTagName("deviceIdentifier");
    if (tmpObj.length> 0 && tmpObj[0].childNodes.length > 0)
        calledDevice = xmlDoc.getElementsByTagName("calledDevice")[0].getElementsByTagName("deviceIdentifier")[0].childNodes[0].nodeValue;

    var lastRedirectionDevice = '';
	tmpObj = xmlDoc.getElementsByTagName("lastRedirectionDevice")[0].getElementsByTagName("deviceIdentifier");
    if (tmpObj.length> 0 && tmpObj[0].childNodes.length > 0)
        lastRedirectionDevice = xmlDoc.getElementsByTagName("lastRedirectionDevice")[0].getElementsByTagName("deviceIdentifier")[0].childNodes[0].nodeValue;

    var cause = '';
    if (xmlDoc.getElementsByTagName("cause")[0].childNodes.length > 0)
        cause = xmlDoc.getElementsByTagName("cause")[0].childNodes[0].nodeValue;

    return new EstablishedEvent(monitorId,
                            callId,
                            deviceId,
                            answeringDevice,
                            answeringDisplayName,
                            callingDisplayName,
                            callingDevice,
                            calledDevice,
                            lastRedirectionDevice,
                            cause);
}

function parseCleared(domParser, message)
{
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var monitorId = '';
    if (xmlDoc.getElementsByTagName("monitorCrossRefID")[0].childNodes.length > 0)
        monitorId = xmlDoc.getElementsByTagName("monitorCrossRefID")[0].childNodes[0].nodeValue;

    var callId = '';
    if (xmlDoc.getElementsByTagName("callID")[0].childNodes.length > 0)
        callId = xmlDoc.getElementsByTagName("callID")[0].childNodes[0].nodeValue;

    var deviceId = '';
    if (xmlDoc.getElementsByTagName("deviceID")[0].childNodes.length > 0)
        deviceId = xmlDoc.getElementsByTagName("deviceID")[0].childNodes[0].nodeValue;

    var deviceIdentifier = '';
    if (xmlDoc.getElementsByTagName("deviceIdentifier")[0].childNodes.length > 0)
        cause = xmlDoc.getElementsByTagName("deviceIdentifier")[0].childNodes[0].nodeValue;

    var cause = '';
    if (xmlDoc.getElementsByTagName("cause")[0].childNodes.length > 0)
        cause = xmlDoc.getElementsByTagName("cause")[0].childNodes[0].nodeValue;

    return new ClearedEvent(monitorId,
                            callId,
                            deviceId,
                            deviceIdentifier,
                            cause);
}

function parseHeld(domParser, message)
{
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var monitorId = '';
    if (xmlDoc.getElementsByTagName("monitorCrossRefID")[0].childNodes.length > 0)
        monitorId = xmlDoc.getElementsByTagName("monitorCrossRefID")[0].childNodes[0].nodeValue;

    var callId = '';
    if (xmlDoc.getElementsByTagName("callID")[0].childNodes.length > 0)
        callId = xmlDoc.getElementsByTagName("callID")[0].childNodes[0].nodeValue;

    var deviceIdentifier = '';
    if (xmlDoc.getElementsByTagName("deviceIdentifier")[0].childNodes.length > 0)
        deviceIdentifier = xmlDoc.getElementsByTagName("deviceIdentifier")[0].childNodes[0].nodeValue;

    var deviceId = '';
    if (xmlDoc.getElementsByTagName("deviceID")[0].childNodes.length > 0)
        deviceId = xmlDoc.getElementsByTagName("deviceID")[0].childNodes[0].nodeValue;

    var cause = '';
    if (xmlDoc.getElementsByTagName("cause")[0].childNodes.length > 0)
        cause = xmlDoc.getElementsByTagName("cause")[0].childNodes[0].nodeValue;

    return new HeldEvent(monitorId,
                            callId,
                            deviceId,
                            deviceIdentifier,
                            cause);
}

function parseLoginSession(domParser, message)
{
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var status = xmlDoc.getElementsByTagName("loginResponce")[0].getAttribute("Code");
    var websession = xmlDoc.getElementsByTagName("loginResponce")[0].getAttribute("wwwUuid");
    var token =  xmlDoc.getElementsByTagName("loginResponce")[0].getAttribute("screenSharingTokenString");
    var server = xmlDoc.getElementsByTagName("loginResponce")[0].getAttribute("screenSharingServerUrl");
    var port = xmlDoc.getElementsByTagName("loginResponce")[0].getAttribute("screenSharingServerPort");
    var token_counter = xmlDoc.getElementsByTagName("loginResponce")[0].getAttribute("screenSharingTokenCounter");
    return {
        session: websession,
        status: status,
        type: 'loginResponce',
        scr_sharing_token:token,
        token_counter: token_counter,
        scr_server: server,
        scr_port: port
    }
}
function parseLoginFailed(domParser, message)
{
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var status = 'failed';
    var session = false;
    var errorCode = xmlDoc.getElementsByTagName("loginFailed")[0].getAttribute("Code");
    var text = xmlDoc.getElementsByTagName("loginFailed")[0].textContent
    console.log(text);
    if (errorCode === '5') {
        text = 'Connect Failed. Session Link is already in use.'
    }
    return {
        session: session,
        status: status,
        code:errorCode,
        text: text
    }
}

function parseRetrieved(domParser, message)
{
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var monitorId = '';
    if (xmlDoc.getElementsByTagName("monitorCrossRefID")[0].childNodes.length > 0)
        monitorId = xmlDoc.getElementsByTagName("monitorCrossRefID")[0].childNodes[0].nodeValue;

    var callId = '';
    if (xmlDoc.getElementsByTagName("callID")[0].childNodes.length > 0)
        callId = xmlDoc.getElementsByTagName("callID")[0].childNodes[0].nodeValue;

    var deviceIdentifier = '';
    if (xmlDoc.getElementsByTagName("deviceIdentifier")[0].childNodes.length > 0)
        deviceIdentifier = xmlDoc.getElementsByTagName("deviceIdentifier")[0].childNodes[0].nodeValue;

    var deviceId = '';
    if (xmlDoc.getElementsByTagName("deviceID")[0].childNodes.length > 0)
        deviceId = xmlDoc.getElementsByTagName("deviceID")[0].childNodes[0].nodeValue;

    var cause = '';
    if (xmlDoc.getElementsByTagName("cause")[0].childNodes.length > 0)
        cause = xmlDoc.getElementsByTagName("cause")[0].childNodes[0].nodeValue;

    return new RetrievedEvent(monitorId,
                                callId,
                                deviceId,
                                deviceIdentifier,
                                cause);
}

function parseParked(domParser, message)
{
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var monitorId = '';
    if (xmlDoc.getElementsByTagName("monitorCrossRefID")[0].childNodes.length > 0)
        monitorId = xmlDoc.getElementsByTagName("monitorCrossRefID")[0].childNodes[0].nodeValue;

    var parkId = '';
    if (xmlDoc.getElementsByTagName("parkID")[0].childNodes.length > 0)
        parkId = xmlDoc.getElementsByTagName("parkID")[0].childNodes[0].nodeValue;

    return new ParkedEvent(monitorId, parkId);
}

function parseCallLog(domParser, message)
{
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var callLog = new CallLog();

    for(var i = 0; i < xmlDoc.getElementsByTagName("callinfo").length; ++i)
    {
        var missed = xmlDoc.getElementsByTagName("callinfo")[i].getAttribute("missed") == "true";
        var outgoing = xmlDoc.getElementsByTagName("callinfo")[i].getAttribute("direction") == "outgoing";
        var recId = '';
		var tmpObj = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("record_id");
        if (tmpObj.length > 0 && tmpObj[0].childNodes.length > 0)
            recId = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("record_id")[0].childNodes[0].nodeValue;

        var connectTs = '';
		tmpObj = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("connectTimestamp");
        if (tmpObj.length  > 0 && tmpObj[0].childNodes.length > 0)
            connectTs = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("connectTimestamp")[0].childNodes[0].nodeValue;

        var disconnectTs = '';
		tmpObj = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("disconnectTimestamp");
        if (tmpObj.length  > 0 && tmpObj[0].childNodes.length > 0)
            disconnectTs = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("disconnectTimestamp")[0].childNodes[0].nodeValue;

        var callingNo = '';
		tmpObj = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("callingPartyNo");
        if (tmpObj.length  > 0 && tmpObj[0].childNodes.length > 0)
            callingNo = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("callingPartyNo")[0].childNodes[0].nodeValue;

        var calledNo = '';
		tmpObj = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("originalCalledPartyNo");
        if (tmpObj.length  > 0 && tmpObj[0].childNodes.length > 0)
            calledNo = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("originalCalledPartyNo")[0].childNodes[0].nodeValue;

        var firstName = '';
		tmpObj = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("firstName");
        if (tmpObj.length  > 0 && tmpObj[0].childNodes.length > 0)
            firstName = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("firstName")[0].childNodes[0].nodeValue;

        var lastName = '';
		tmpObj = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("lastName");
        if (tmpObj.length  > 0 && tmpObj[0].childNodes.length > 0)
            lastName = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("lastName")[0].childNodes[0].nodeValue;

        var ext = '';
		tmpObj = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("extension");
        if (tmpObj.length  > 0 && tmpObj[0].childNodes.length > 0)
            ext = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("extension")[0].childNodes[0].nodeValue;

        var serviceName = '';
		tmpObj = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("serviceName");
        if (tmpObj.length  > 0 && tmpObj[0].childNodes.length > 0)
            serviceName = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("serviceName")[0].childNodes[0].nodeValue;

        var serviceExt = '';
		tmpObj = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("serviceExtension");
        if (tmpObj.length  > 0 && tmpObj[0].childNodes.length > 0)
            serviceExt = xmlDoc.getElementsByTagName("callinfo")[i].getElementsByTagName("serviceExtension")[0].childNodes[0].nodeValue;

        var info = new CallLogInfo(missed,
                                    outgoing,
                                    recId,
                                    connectTs,
                                    disconnectTs,
                                    callingNo,
                                    calledNo,
                                    firstName,
                                    lastName,
                                    ext,
                                    serviceName,
                                    serviceExt);
        callLog.Add(info);
    }

    return callLog;
}

function parsePresence(domParser, message)
{
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var from = xmlDoc.getElementsByTagName("presence")[0].getAttribute("from");
    var status = xmlDoc.getElementsByTagName("presence")[0].getAttribute("status");
    if(status === 'NotAvaliable') {
        status = 'NotAvailable'
    }
    return new Presence(from, status);
}

function parseWcStatus(domParser, message)
{
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var status = '';
    if (xmlDoc.getElementsByTagName("status")[0] != null)
        status = xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue;

    var cause = '';
    if (xmlDoc.getElementsByTagName("cause")[0] != null)
        cause = xmlDoc.getElementsByTagName("cause")[0].childNodes[0].nodeValue;

    return new WcStatus(status, cause);
}

function parseWcConfig(domParser, message)
{
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var msgLen = '';
    if (xmlDoc.getElementsByTagName("msgLen")[0] != null)
        msgLen = xmlDoc.getElementsByTagName("msgLen")[0].childNodes[0].nodeValue;

    return new WcConfig(msgLen);
}

function parseWcPartner(domParser, message)
{
    var xmlDoc = domParser.parseFromString(message, "text/xml");

    var name = '';
    if (xmlDoc.getElementsByTagName("name")[0] != null)
        name = xmlDoc.getElementsByTagName("name")[0].childNodes[0].nodeValue;

    var id = '';
    if (xmlDoc.getElementsByTagName("id")[0] != null)
        id = xmlDoc.getElementsByTagName("id")[0].childNodes[0].nodeValue;

    var timestamp = '';
    if (xmlDoc.getElementsByTagName("timestamp")[0] != null)
        timestamp = xmlDoc.getElementsByTagName("timestamp")[0].childNodes[0].nodeValue;

    var statusOld = '';
    if (xmlDoc.getElementsByTagName("statusOld")[0] != null)
        statusOld = xmlDoc.getElementsByTagName("statusOld")[0].childNodes[0].nodeValue;

    var statusNew = '';
    if (xmlDoc.getElementsByTagName("statusNew")[0] != null)
        statusNew = xmlDoc.getElementsByTagName("statusNew")[0].childNodes[0].nodeValue;

    return new WcPartner(name, id, timestamp, statusOld, statusNew);
}

function parseWcMsg(domParser, message)
{
    var xmlDoc = domParser.parseFromString(message, "text/xml");

    var name = '';
    if (xmlDoc.getElementsByTagName("name")[0] != null)
        name = xmlDoc.getElementsByTagName("name")[0].childNodes[0].nodeValue;

    var id = '';
    if (xmlDoc.getElementsByTagName("id")[0] != null)
        id = xmlDoc.getElementsByTagName("id")[0].childNodes[0].nodeValue;

    var timestamp = '';
    if (xmlDoc.getElementsByTagName("timestamp")[0] != null)
        timestamp = xmlDoc.getElementsByTagName("timestamp")[0].childNodes[0].nodeValue;

    var msg = '';
    if (xmlDoc.getElementsByTagName("msg")[0] != null)
        msg = xmlDoc.getElementsByTagName("msg")[0].childNodes[0].nodeValue;

    return new WcMsg(name, id, timestamp, msg);
}

function parseAgentDeleted(domParser, message)
{
    var xmlDoc = domParser.parseFromString(message, "text/xml");

    var roleId = '';
    if (xmlDoc.getElementsByTagName("roleId")[0] != null)
        roleId = xmlDoc.getElementsByTagName("roleId")[0].childNodes[0].nodeValue;

    return new AgentDeleted(roleId);
}
function parseWcAgentAdded(domParser, message) {
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var fromName = xmlDoc.getElementsByTagName("WcUserAdded")[0].getAttribute("name");
    var roomId = xmlDoc.getElementsByTagName("WcUserAdded")[0].getAttribute("roomId");

    return new ImMsgAck('', '', '', '', roomId, fromName, 'agent added');
}
function parseWcAgentDeleted(domParser, message) {
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var fromName = xmlDoc.getElementsByTagName("WcUserRemoved")[0].getAttribute("name");
    var roomId = xmlDoc.getElementsByTagName("WcUserRemoved")[0].getAttribute("roomId");

    return new ImMsgAck('', '', '', '', roomId, fromName, 'agent left');
}
//
// function parseWcAgentAdded(domParser, message)
// {
//     var xmlDoc = domParser.parseFromString(message, "text/xml");
//
//
// }

function parseAgentAdded(domParser, message)
{
    var xmlDoc = domParser.parseFromString(message, "text/xml");

    var roleId = '';
    if (xmlDoc.getElementsByTagName("roleId")[0] != null)
        roleId = xmlDoc.getElementsByTagName("roleId")[0].childNodes[0].nodeValue;

    var roleName = '';
    if (xmlDoc.getElementsByTagName("roleName")[0] != null)
        roleName = xmlDoc.getElementsByTagName("roleName")[0].childNodes[0].nodeValue;

    var roleExt = '';
    if (xmlDoc.getElementsByTagName("roleExt")[0] != null)
        roleExt = xmlDoc.getElementsByTagName("roleExt")[0].childNodes[0].nodeValue;

    var loggedOnState = '';
    if (xmlDoc.getElementsByTagName("loggedOnState")[0] != null)
        loggedOnState = xmlDoc.getElementsByTagName("loggedOnState")[0].childNodes[0].nodeValue;

    var loginAvailable = '';
    if (xmlDoc.getElementsByTagName("loginAvailable")[0] != null)
        loginAvailable = xmlDoc.getElementsByTagName("loginAvailable")[0].childNodes[0].nodeValue;

    var enabled = '';
    if (xmlDoc.getElementsByTagName("enabled")[0] != null)
        enabled = xmlDoc.getElementsByTagName("enabled")[0].childNodes[0].nodeValue;

    var isSupervisor = '';
    if (xmlDoc.getElementsByTagName("isSupervisor")[0] != null)
        isSupervisor = xmlDoc.getElementsByTagName("isSupervisor")[0].childNodes[0].nodeValue;

    var priority = '';
    if (xmlDoc.getElementsByTagName("priority")[0] != null)
        priority = xmlDoc.getElementsByTagName("priority")[0].childNodes[0].nodeValue;

    var mailboxAccess = '';
    if (xmlDoc.getElementsByTagName("mailboxAccess")[0] != null)
        mailboxAccess = xmlDoc.getElementsByTagName("mailboxAccess")[0].childNodes[0].nodeValue;

    var canCall = '';
    if (xmlDoc.getElementsByTagName("canCall")[0] != null)
        canCall = xmlDoc.getElementsByTagName("canCall")[0].childNodes[0].nodeValue;

    var canChat = '';
    if (xmlDoc.getElementsByTagName("canChat")[0] != null)
        canChat = xmlDoc.getElementsByTagName("canChat")[0].childNodes[0].nodeValue;

    return new AgentAdded(roleId, roleName, roleExt, loggedOnState, loginAvailable, enabled, isSupervisor, priority, mailboxAccess, canCall, canChat);
}

function parseImMsg(domParser, message){
    console.log(message + ' from zac')
    var xmlDoc = domParser.parseFromString(message, "text/xml");
	var persistId = xmlDoc.getElementsByTagName("message")[0].getAttribute("persistId");
    var recipType = xmlDoc.getElementsByTagName("message")[0].getAttribute("recipType");
	var packetType = xmlDoc.getElementsByTagName("message")[0].getAttribute("packetType");
    var toRecipName = xmlDoc.getElementsByTagName("message")[0].getAttribute("toRecipName");
	var toRecipId = xmlDoc.getElementsByTagName("message")[0].getAttribute("toRecipId");
	var fromName = xmlDoc.getElementsByTagName("message")[0].getAttribute("name");
	var fromId = xmlDoc.getElementsByTagName("message")[0].getAttribute("from");
	var delivered = xmlDoc.getElementsByTagName("message")[0].getAttribute("delivered");
	var seen = xmlDoc.getElementsByTagName("message")[0].getAttribute("seen");
	var timestamp = xmlDoc.getElementsByTagName("message")[0].getElementsByTagName("text")[0].getAttribute('timestamp')
	var text = '';
	var msgId =  xmlDoc.getElementsByTagName("message")[0].getAttribute("msgId");
	var tmpObj = xmlDoc.getElementsByTagName("message")[0].getElementsByTagName("text");
	if (tmpObj.length > 0 && tmpObj[0].childNodes.length > 0)
	    console.log(tmpObj[0].childNodes[0].nodeValue)
		text = tmpObj[0].childNodes[0].nodeValue;

	var roomId;
	tmpObj = xmlDoc.getElementsByTagName("message")[0].getElementsByTagName("extWeb");
	if (tmpObj.length > 0 && tmpObj[0].childNodes.length > 0)
		roomId = xmlDoc.getElementsByTagName("message")[0].getElementsByTagName("extWeb")[0].getElementsByTagName("roomId")[0].childNodes[0].nodeValue;
	return new ImMsg(persistId, recipType, packetType, toRecipName, toRecipId, fromName, fromId, delivered, seen, text, roomId,timestamp,msgId);
}

function parseScreenShareStartGroup(domParser, message){
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var eventName =  xmlDoc.getElementsByTagName('ImGroupStartScreenSharingEvent');
    var pipeline = xmlDoc.getElementsByTagName("pipelineId")[0].childNodes[0].nodeValue;
    var endpoint = xmlDoc.getElementsByTagName("endpointId")[0].childNodes[0].nodeValue;
    var presenterId = xmlDoc.getElementsByTagName("presenterId")[0].childNodes[0].nodeValue;
    var sessionId = xmlDoc.getElementsByTagName("sessionId")[0].childNodes[0].nodeValue;
    console.dir(eventName,pipeline)

    return {
        eventName: eventName[0].localName,
        pipeline: pipeline,
        endpoint: endpoint,
        sessionId: sessionId,
        presenterId: presenterId
    }
}

function parseScreenShareStartUser(domParser, message){
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var eventName =  xmlDoc.getElementsByTagName('StartScreenSharingEvent');
    var sessionId = xmlDoc.getElementsByTagName('sessionId')[0].childNodes[0].nodeValue;
    var pipeline = xmlDoc.getElementsByTagName("pipelineId")[0].childNodes[0].nodeValue;
    var endpoint = xmlDoc.getElementsByTagName("endpointId")[0].childNodes[0].nodeValue;
    var presenterId = xmlDoc.getElementsByTagName("presenterId")[0].childNodes[0].nodeValue;
    console.dir(eventName,pipeline)

    return {
        eventName: eventName[0].localName,
        pipeline: pipeline,
        endpoint: endpoint,
        presenterId: presenterId,
        sessionId: sessionId
    }
}

function parseScreenShareStopGroup(domParser, message){
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var eventName =  xmlDoc.getElementsByTagName('ImGroupStopScreenSharingEvent');
    var group = xmlDoc.getElementsByTagName("groupId")[0].childNodes[0].nodeValue;

    console.dir(eventName,group)

    return {
        eventName: eventName[0].localName,
        group: group
    }
}

function parseScreenShareStopUser(domParser, message){
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var eventName =  xmlDoc.getElementsByTagName('StopScreenSharingEvent');
    // var type = xmlDoc.getElementsByTagName("extWeb")[0].childNodes[0].nodeValue;
    // var roomId = xmlDoc.getElementsByTagName("roomId")[0].childNodes[0].nodeValue;
    var sessionId = xmlDoc.getElementsByTagName("sessionId")[0].childNodes[0].nodeValue;

    console.dir(eventName)

    return {
        eventName: eventName[0].localName,
        // type: type,
        // roomId: roomId,
        sessionId: sessionId
    }
}

function parseScreenShareToken(domParser, message){
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var eventName =  xmlDoc.getElementsByTagName('ScreenSharingTokenEvent');
    var token = xmlDoc.getElementsByTagName("token_string")[0].childNodes[0].nodeValue;
    var token_counter = xmlDoc.getElementsByTagName("token_counter")[0].childNodes[0].nodeValue;

    console.dir(eventName,token_counter,token)

    return {
        eventName: eventName[0].localName,
        token: token,
        token_counter: token_counter
    }
}

function parseScreenShareLeftResponse(domParser, message){
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var eventName =  xmlDoc.getElementsByTagName('ScreenSharingLeftResponse');
    console.dir(eventName)
    return {
        eventName: eventName[0].localName,
    }
}
function parseScreenSharingJoinedResponse(domParser, message){
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var eventName =  xmlDoc.getElementsByTagName('ScreenSharingJoinedResponse');
    console.dir(eventName)
    return {
        eventName: eventName[0].localName,
    }
}

function parseStartScreenSharingResponse(domParser, message){
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var eventName =  xmlDoc.getElementsByTagName('StartScreenSharingResponse');
    var session =  xmlDoc.getElementsByTagName('sessionId')[0].childNodes[0].nodeValue;
    console.dir(eventName,session)
    return {
        eventName: eventName[0].localName,
        session: session
    }
}

function parseStopScreenSharingResponse(domParser, message){
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var eventName =  xmlDoc.getElementsByTagName('StopScreenSharingResponse');
    // var session =  xmlDoc.getElementsByTagName('sessionId');
    console.dir(eventName)
    return {
        eventName: eventName[0].localName
    }
}

function parseImGroupUserAdded(domParser, message){
    console.log(message + 'chat group member added from zac');
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var userId = xmlDoc.getElementsByTagName("userId")[0].childNodes[0].nodeValue;
    var groupId = xmlDoc.getElementsByTagName("groupId")[0].childNodes[0].nodeValue;
    var groupName = xmlDoc.getElementsByTagName("name")[0].childNodes[0].nodeValue;
    var userName = xmlDoc.getElementsByTagName("userName")[0].childNodes[0].nodeValue;
    var userType = xmlDoc.getElementsByTagName("userType")[0].childNodes[0].nodeValue;
    var presence = xmlDoc.getElementsByTagName("presence")[0].childNodes[0].nodeValue;
    if(presence==='NotAvaliable'){
        presence = 'NotAvailable'
    }
     return {
         userId:userId,
         groupId:groupId,
         groupName: groupName,
         userName: userName,
         userType: userType,
         presence: presence,
         packetType:'ImUserAdded'
     };
}

function parseImGroupUserRemoved(domParser, message){
    console.log(message + 'chat group member deleted from zac');
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var userId = xmlDoc.getElementsByTagName("userId")[0].childNodes[0].nodeValue;
    var groupId = xmlDoc.getElementsByTagName("groupId")[0].childNodes[0].nodeValue;
    var userType = xmlDoc.getElementsByTagName("userType")[0].childNodes[0].nodeValue;
    return {
        userId:userId,
        groupId:groupId,
        userType: userType,
        packetType:'ImUserRemoved'
    };
}
function parseImMsgAck(domParser, message){
	var xmlDoc = domParser.parseFromString(message, "text/xml");
	
	var persistId = xmlDoc.getElementsByTagName("messageAck")[0].getAttribute("persistId");
	var ackCode = xmlDoc.getElementsByTagName("messageAck")[0].getAttribute("code");
	var recipId = xmlDoc.getElementsByTagName("messageAck")[0].getAttribute("to");
	var recipType = xmlDoc.getElementsByTagName("messageAck")[0].getAttribute("recipType");
	var roomId = xmlDoc.getElementsByTagName("messageAck")[0].getAttribute("roomId");
    var timestamp = xmlDoc.getElementsByTagName("messageAck")[0].getAttribute("timestamp");
    var agent = xmlDoc.getElementsByTagName("messageAck")[0].getAttribute("name");
    var from = xmlDoc.getElementsByTagName("messageAck")[0].getAttribute("from");
	var tmpObj = xmlDoc.getElementsByTagName("messageAck")[0].getElementsByTagName("webchat");
    var roomId;
    var status;
    console.log(from)
    if(ackCode === 'IMS_TYPING'){
        status = xmlDoc.getElementsByTagName("messageAck")[0].getElementsByTagName("typing")[0].getAttribute("actionStart");
        console.dirxml(status)
    }
	if (tmpObj.length > 0 && tmpObj[0].childNodes.length > 0)
		roomId = xmlDoc.getElementsByTagName("messageAck")[0].getElementsByTagName('webchat')[0].getElementsByTagName('roomId')[0].childNodes[0].nodeValue;

	tmpObj = xmlDoc.getElementsByTagName("messageAck")[0].getElementsByTagName("extWeb");
	if (tmpObj.length > 0 && tmpObj[0].childNodes.length > 0)
		roomId = tmpObj[0].getElementsByTagName("roomId")[0].childNodes[0].nodeValue;

	return new ImMsgAck(persistId, ackCode, recipId, recipType, roomId, agent, status,from);
}

//\csta events parser
function parseCstaError(domParser, message){
    var xmlDoc = domParser.parseFromString(message, "text/xml");
    var errorText = xmlDoc.getElementsByTagName("CSTAErrorCode")[0].getElementsByTagName("operation")[0].childNodes[0].nodeValue;
    return {
        error : errorText
    }
}

function CstaToolkit()
{
    this.parser = new DOMParser();
    this.callbacks = new Array();
    this.invokeId = 0;
}

CstaToolkit.prototype.setupEventCallbacks = function(delivered,
                                                       established,
                                                        cleared,
                                                        parked,
                                                        held,
                                                        retrieved,
                                                        assigned,
                                                        presence,
                                                        csta_error,
                                                        network_error,
                                                        call_log,
                                                        wc_status,
                                                        wc_config,
                                                        wc_partner,
                                                        wc_msg,
                                                        agent_deleted,
                                                        agent_added,
														im_msg,
														im_msg_ack,
                                                     ws_agent_added,
                                                     ws_agent_deleted,
                                                     screensharing)
{
    this.delivered = delivered;
    this.established = established;
    this.cleared = cleared;
    this.parked = parked;
    this.held = held;
    this.retrieved = retrieved;
    this.assigned = assigned;
    this.presence = presence;
    this.csta_error = csta_error;
    this.network_error = network_error;
    this.call_log = call_log;
    this.wc_status = wc_status;
    this.wc_config = wc_config;
    this.wc_partner = wc_partner;
    this.wc_msg = wc_msg;
    this.agent_deleted = agent_deleted;
    this.agent_added = agent_added;
	this.im_msg = im_msg;
	this.im_msg_ack = im_msg_ack;
	this.ws_agent_added = ws_agent_added;
    this.ws_agent_deleted = ws_agent_deleted;
    this.screensharing = screensharing;
   // // console.log(this);
   //  console.log('setupEventCallbacks finished');
}

CstaToolkit.prototype.setupResponseCallbacks = function (login_session,error,screenshare) {
    {
        this.loginwww = login_session;
        this.loginerror = error;
        this.screeshare = screenshare
    }

   console.log(this.loginwww);
}

CstaToolkit.prototype.serializeHeader = function(dataLength)
{
    var header = "";
    header += String.fromCharCode(0);
    header += String.fromCharCode(0);
    var dataLen = dataLength + 8;
    var len1 = Math.floor(dataLen / 256);
    var len2 = Math.floor(dataLen - len1 * 256);
    header += String.fromCharCode(len1);
    header += String.fromCharCode(len2);
    var invokeId = this.invokeId.toString();
    var len = invokeId.length;
    if(len < 4)
    {
        for (var i = 0; i < 4 - len; i++)
            header += String.fromCharCode(0x30);
    }
    for (var i = 0; i < len; i++)
        header += invokeId[i];

    //header should be encoded to base64 to satisfy text content of wss requirements
    var headerB64 = btoa(header);
    //headerB64 += '\n';
    var encodedHeader = String.fromCharCode(headerB64.length);
    encodedHeader += headerB64;

    this.invokeId++;
    //9999 is hardcoded invokeId used by events
    if (this.invokeId == 9999)
        this.invokeId = 0;

    return encodedHeader;
}

CstaToolkit.prototype.serializeLogin = function(login, password, version, isPlain, forced)
{
    // todo add support for multiple login capabilities
    var request = "<loginRequest type='User' platform='MXIE' version='" + version + "' clientType='web' loginCapab='Audio|Video|Im|911Support|WebChat|ScreenSharing|VideoConf|SchedConf|HttpFileTransfer' mediaCapab='Voicemail|Fax|CallRec' dcmode='phone' forced='" + (forced ? "true" : "false")+ "'><userName>" + login + "</userName><pwd>";
    var pwd = isPlain ? password : (CryptoJS.SHA1(password).toString(CryptoJS.enc.Base64) + "\n");
    request += pwd;
    request += "</pwd></loginRequest>";

    return request;
}


CstaToolkit.prototype.serializeCreateWebSession = function(roomId,name){
    var dispName = escapeXml(name);
    console.log(name)
    // let dispName = escapeXml(name);
    // console.log(dispName)
	return `<?xml version="1.0" encoding="utf-8"?><loginRequest type="User" platform="ExtWeb" forced='true' version="1.0" abNotify="true" dispName="${dispName}" clientType="Web"
	  loginCapab="Im|WebChat|ScreenSharing"  apiVersion="17"><userName>webuser_${roomId}</userName></loginRequest>`
}

CstaToolkit.prototype.serializeLogout = function()
{
    return "<logout></logout>";
}

CstaToolkit.prototype.serializeCallLog = function(timestamp)
{
    return "<iq type='get' id='calllog' timestamp='" + timestamp + "'></iq>";
}
CstaToolkit.prototype.serializeImGroups = function (data) {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><GetImGroups><userId>7219455219191371</userId></GetImGroups>";
}

CstaToolkit.prototype.serializeImGroupUsers = function (data) {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><GetImGroupUsers><groupId>-6297178105870417943</groupId></GetImGroupUsers>";
}

CstaToolkit.prototype.serializeAssignDevice = function(bindDevice, bindDeviceId)
{
    var data = "<?xml version='1.0' encoding='UTF-8'?><AssignDevice xmlns='http://www.ecma-international.org/standards/ecma-323/csta/ed4'>";
    if (bindDevice == eCstaBind.DEVICEID)
        data += "<deviceID type='device'>" + bindDeviceId + "</deviceID>";
    else if (bindDevice == eCstaBind.EXTERNAL)
        data += "<deviceID type='address'>" + bindDeviceId + "</deviceID>";

    data += "</AssignDevice>";

    return data;
}

CstaToolkit.prototype.serializeGetAgent = function(ext)
{
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><GetAgentState xmlns=\"http://www.ecma-international.org/standards/ecma-323/csta/ed4\"><device>" + ext + "</device></GetAgentState>";
}

CstaToolkit.prototype.serializeSetAgent = function(ext, agentState, roles)
{
    var requestedState = (agentState == eAgentLoginState.LOGGEDON) ? "loggedOn" : "loggedOff";
    var data = "<?xml version='1.0' encoding='UTF-8'?><SetAgentState xmlns='http://www.ecma-international.org/standards/ecma-323/csta/ed4'>" +
        "<device>" + ext + "</device><requestedAgentState>" + requestedState + "</requestedAgentState><agentID></agentID><password></password><physicalDevice></physicalDevice>";

    for(var i = 0; i < roles.length; ++i)
        data += "<group>" + roles[i] + "</group>";

    data += "</SetAgentState>";

    return data;
}

CstaToolkit.prototype.serializeMonitorStart = function(monitorId)
{
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><MonitorStart xmlns=\"http://www.ecma-international.org/standards/ecma-323/csta/ed4\"><monitorObject><deviceObject>" + monitorId + "</deviceObject></monitorObject></MonitorStart>";
}

CstaToolkit.prototype.serializeMonitorStop = function(monitorId)
{
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><MonitorStop xmlns=\"http://www.ecma-international.org/standards/ecma-323/csta/ed4\"><monitorCrossRefID>" + monitorId + "</monitorCrossRefID></MonitorStop>";
}

CstaToolkit.prototype.serializeMakeCall = function(toExt, role)
{
    var group = "";
    if ((role != null) && (role != "User"))
        group = "<group>" + role + "</group>";

    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><MakeCall xmlns=\"http://www.ecma-international.org/standards/ecma-323/csta/ed4\"><callingDevice typeOfNumber=\"deviceID\">\
            </callingDevice><calledDirectoryNumber>" + toExt + "</calledDirectoryNumber>" + group + "</MakeCall>";
}

CstaToolkit.prototype.serializeAnswerCall = function(callId, deviceId)
{
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><AnswerCall xmlns=\"http://www.ecma-international.org/standards/ecma-323/csta/ed4\">\
            <callToBeAnswered><callID>" + callId + "</callID><deviceID>" + deviceId + "</deviceID></callToBeAnswered></AnswerCall>";
}

CstaToolkit.prototype.serializeClearCall = function(callId, deviceId)
{
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><ClearConnection xmlns=\"http://www.ecma-international.org/standards/ecma-323/csta/ed4\">\
            <connectionToBeCleared><callID>" + callId + "</callID><deviceID>" + deviceId + "</deviceID></connectionToBeCleared></ClearConnection>";
}

CstaToolkit.prototype.serializeHoldCall = function(callId, deviceId)
{
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><HoldCall xmlns=\"http://www.ecma-international.org/standards/ecma-323/csta/ed4\">\
            <callToBeHeld><callID>" + callId + "</callID><deviceID>" + deviceId + "</deviceID></callToBeHeld></HoldCall>";
}

CstaToolkit.prototype.serializeRetrieveCall = function(callId, deviceId)
{
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><RetrieveCall xmlns=\"http://www.ecma-international.org/standards/ecma-323/csta/ed4\">\
            <callToBeRetrieved><callID>" + callId + "</callID><deviceID>" + deviceId + "</deviceID></callToBeRetrieved></RetrieveCall>";
}

CstaToolkit.prototype.serializeParkCall = function(callId, deviceId)
{
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><ParkCall xmlns=\"http://www.ecma-international.org/standards/ecma-323/csta/ed4\">\
            <parking><callID>" + callId + "</callID><deviceID>" + deviceId + "</deviceID></parking></ParkCall>";
}

CstaToolkit.prototype.serializeTransferCall = function(callId, deviceId, toExt)
{
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><SingleStepTransferCall xmlns=\"http://www.ecma-international.org/standards/ecma-323/csta/ed4\">\
            <activeCall><callID>" + callId + "</callID><deviceID>" + deviceId + "</deviceID></activeCall><transferredTo>" + toExt + "</transferredTo></SingleStepTransferCall>";
}

CstaToolkit.prototype.serializePresenceCall = function(status)
{
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><presence status='"+ status + "' />";
}

CstaToolkit.prototype.serializeScreenSharingJoined = function(status)
{
    return `<?xml version="1.0" encoding="UTF-8"?><ScreenSharingJoined/>`;
}

CstaToolkit.prototype.serializeScreenSharingTokenRequest = function(token_counter)
{
    return `<?xml version="1.0" encoding="UTF-8"?><ScreenSharingToken><token_counter>${token_counter}</token_counter></ScreenSharingToken>`;
}

CstaToolkit.prototype.serializeGroupScreenSharingStart = function(groupId,pipelineId,endPoint)
{
    return `<?xml version="1.0" encoding="UTF-8"?><StartScreenSharing><type>group</type><groupId>${groupId}</groupId><webParams><pipelineId>${pipelineId}</pipelineId><endpointId>${endPoint}</endpointId></webParams></StartScreenSharing>`;
}

CstaToolkit.prototype.serializeUserScreenSharingStart = function(roomId,pipelineId,endPoint)
{
    return `<?xml version="1.0" encoding="UTF-8"?><StartScreenSharing><type>extWeb</type><roomId>${roomId}</roomId><webParams><pipelineId>${pipelineId}</pipelineId><endpointId>${endPoint}</endpointId></webParams></StartScreenSharing>`;
}

CstaToolkit.prototype.serializeScreenSharingLeave = function(status)
{
    return `<?xml version="1.0" encoding="UTF-8"?><ScreenSharingLeft/>`;
}

CstaToolkit.prototype.serializeGroupScreenSharingStop = function(groupId,session)
{

    return `<?xml version="1.0" encoding="UTF-8"?><StopScreenSharing><type>group</type><groupId>${groupId}</groupId><sessionId>${session}</sessionId></StopScreenSharing>`;
}

CstaToolkit.prototype.serializeUserScreenSharingStop = function(roomId,session)
{

    return `<?xml version="1.0" encoding="UTF-8"?><StopScreenSharing><type>extWeb</type><roomId>${roomId}</roomId><sessionId>${session}</sessionId></StopScreenSharing>`;
}

CstaToolkit.prototype.serializeWebCStart = function(destination, name, page, id)
{
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><webChatStart xmlns=\"http://www.ecma-international.org/standards/ecma-323/csta/ed4\">\
        <destination>" + destination + "</destination>\
        <name>" + name + "</name>\
        <page>" + page + "</page>\
        <id>" + id + "</id>\
        </webChatStart>";
}

CstaToolkit.prototype.serializeWebCMsg = function(message)
{
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><webChatMsg xmlns=\"http://www.ecma-international.org/standards/ecma-323/csta/ed4\">\
        <msg>" + message + "</msg></webChatMsg>";
}

CstaToolkit.prototype.serializeWebChatMessage = function(message,roomId,name)
{
    message = escapeXml(message)
    return `<?xml version=\"1.0\" encoding=\"UTF-8\"?><message to="" msgId="0" name='${name}' url="" recipType="WebChat"><text>${message}</text><webchat><roomId>${roomId}</roomId></webchat></message>`;

// <?xml version="1.0" encoding="UTF-8"?><message to="" msgId="0" name="" url="" recipType="WebChat">
//     <text>wc_msg1</text><webchat><roomId>-3703711184030191590</roomId></webchat></message>

}

CstaToolkit.prototype.serializeWebCStop = function(sessionId)
{
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><webChatStop xmlns=\"http://www.ecma-international.org/standards/ecma-323/csta/ed4\">\
        <sessionId>" + destination + "</sessionId></webChatStop>";
}
///
CstaToolkit.prototype.serializeImMsg = function(message, to, msgId, from, user, recipType, roomId)
{
	//for webchat serialization
	//<webchat><callGroupName>%1%</callGroupName><name>%2%</name><cid>%3%</cid><page>%4%</page><roomId>%5%</roomId></webchat>
	//<message to=\"%1%\" msgId=\"%2%\" from=\"%3%\" url=\"%4%\" recipType=\"%5%\">%6%</message>

     let msg = escapeXml(message);
    let name = escapeXml(user);
    console.log(name,message)
	var context = `<extWeb><roomId>${roomId}</roomId></extWeb>`;
    return `<?xml version=\"1.0\" encoding=\"UTF-8\"?><message to='${to}' msgId='${msgId}' from='${from}' name='${name}' recipType='${recipType}'><text>${msg}</text>${context}</message>`;
}

CstaToolkit.prototype.serializeImMsgAckStatus = function(ackCode, msgId, 
	persistId, recipId, groupId, recipType, from, name, roomId,timestamp,action, groupName)
{
    name = escapeXml(name);
    // console.log(recipType)
    // console.log(groupId)
    // console.log(ackCode, from, name)
    //for webchat serialization
    //<webchat><callGroupName>%1%</callGroupName><name>%2%</name><cid>%3%</cid><page>%4%</page><roomId>%5%</roomId></webchat>
    //<messageAck code=\"%s\" msgId=\"%d\" persistId=\"%s\" userId=\"%s\" groupId=\"%s\" timestamp=\"%u\" ackType=\"%s\" packetType=\"%s\" from=\"%s\" name=\"%s\">%s</messageAck>",
    if(ackCode==='IMS_TYPING' && recipType !== 'ExtWeb'){
        return `<?xml version="1.0" encoding="UTF-8"?><messageAck to="" code="IMS_TYPING" msgId="${msgId}" reqId="0" persistId="" recipType="${recipType}"><webchat>
<roomId>${roomId}</roomId><callGroupName>${groupName}</callGroupName><name>${name}</name><cid>testChatCid</cid><page>testPage</page></webchat><typing actionStart="${action}"/>
</messageAck>`;
    } else if(ackCode==='IMS_TYPING' && recipType === 'ExtWeb') {
        console.log(name)
        return `<?xml version="1.0" encoding="UTF-8"?><messageAck to="" code="IMS_TYPING" recipType="ExtWeb" from="${name}"  name='${name}' groupId="${groupId}" packetType="PTC_TEXT" msgId="${msgId}"
         reqId="0" persistId=""><typing actionStart="${action}"/><extWeb><roomId>${roomId}</roomId></extWeb></messageAck>`;
    }
    else if(recipType === 'WebChat') {
        return `<?xml version=\"1.0\" encoding=\"UTF-8\"?><messageAck code="${ackCode}"	msgId='${msgId}' persistId='${persistId}' userId='${recipId}' \
	groupId='${groupId}' recipType='${recipType}' timestamp='${timestamp}' packetType='PTC_TEXT' from='${from}' name='${name}'><webchat><roomId>${roomId}</roomId></webchat></messageAck>`;
    }
    else if(recipType === 'ExtWeb') {
        return `<?xml version=\"1.0\" encoding=\"UTF-8\"?><messageAck code="${ackCode}"	msgId='${msgId}' persistId='${persistId}' userId='${recipId}' \
	groupId='${groupId}' recipType='${recipType}' timestamp='${timestamp}' packetType='PTC_TEXT' from='${from}' name='${name}'><extWeb><roomId>${roomId}</roomId></extWeb></messageAck>`;
    }
}

CstaToolkit.prototype.serializeImMsgAckTypingStatus = function( msgId, persistId, groupName, recipType, name, status, roomId)
{
    //for webchat serialization
    //<webchat><callGroupName>%1%</callGroupName><name>%2%</name><cid>%3%</cid><page>%4%</page><roomId>%5%</roomId></webchat>
    //<messageAck code=\"%s\" msgId=\"%d\" persistId=\"%s\" userId=\"%s\" groupId=\"%s\" timestamp=\"%u\" ackType=\"%s\" packetType=\"%s\" from=\"%s\" name=\"%s\">%s</messageAck>",

    return `<?xml version="1.0" encoding="UTF-8"?><messageAck to="" code="IMS_TYPING" msgId="0" reqId="0" persistId="" recipType="${recipType}"><webchat>
<roomId>${roomId}</roomId><callGroupName>${groupName}</callGroupName><name>myName</name><cid>testChatCid</cid><page>testPage</page></webchat><typing actionStart="true"/></messageAck>`;
}

CstaToolkit.prototype.serializeImMsgAck = function(ackCode, msgId, persistId, recipId, groupId, ackType, from, name, roomId,timestamp)
{
	//for webchat serialization
	//<webchat><callGroupName>%1%</callGroupName><name>%2%</name><cid>%3%</cid><page>%4%</page><roomId>%5%</roomId></webchat>
	//<messageAck code=\"%s\" msgId=\"%d\" persistId=\"%s\" userId=\"%s\" groupId=\"%s\" timestamp=\"%u\" ackType=\"%s\" packetType=\"%s\" from=\"%s\" name=\"%s\">%s</messageAck>",
	var context = `<extWeb><roomId>${roomId}</roomId></extWeb>`;

    return `<?xml version=\"1.0\" encoding=\"UTF-8\"?><messageAck code='${ackCode}'	msgId='${msgId}' persistId='${persistId}' userId='${recipId}' \
	groupId='${groupId}' ackType='${ackType}' timestamp='${timestamp}' packetType='PTC_TEXT' from='${from}' name='${name}'>${context}</messageAck>`;
}

CstaToolkit.prototype.serializeCommunication = function(ackCode, msgId, reqId, persistId ,recipType, group, name)
{
    name = escapeXml(name)
    return `<?xml version=\"1.0\" encoding=\"UTF-8\"?><messageAck to="" code='${ackCode}' reqId='${reqId}' \
     msgId='${msgId}' persistId='${persistId}' recipType='${recipType}'><webchat><callGroupName>${group}</callGroupName><name>${name}</name><cid>testChatCid</cid><page>testPage</page></webchat></messageAck>`;
}
//\end of serialize
/////////

CstaToolkit.prototype.createLogin = function(login, password, version, isPlain, forced, response)
{
    this.callbacks.push([this.invokeId.toString(), new LoginParser(this.parser, response)]);
    var data = this.serializeLogin(login, password, version, isPlain, forced);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createLogout = function(response)
{
	this.callbacks.push([this.invokeId.toString(), new LogoutParser(this.parser, response)]);
    var data = this.serializeLogout();
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createWebSession = function(roomId,name)
{
    var data = this.serializeCreateWebSession(roomId,name);
    var header = this.serializeHeader(encodeUtf8(data).length);
    return header + data;
}

CstaToolkit.prototype.createKeepAlive = function()
{
    var data = "<keepalive/>";
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.GetImGroups = function(data)
{
    var data = this.serializeImGroups(data);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.GetImGroupUsers = function(data)
{
    var data = this.serializeImGroupUsers(data);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createAssignDevice = function(bindDevice, bindDeviceId)
{
    var data = this.serializeAssignDevice(bindDevice, bindDeviceId);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createGetAgent = function(ext, response)
{
    this.callbacks.push([this.invokeId.toString(), new GetAgentParser(this.parser, response)]);
    var data = this.serializeGetAgent(ext);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createSetAgent = function(ext, agentState, roles, response)
{
    this.callbacks.push([this.invokeId.toString(), new SetAgentParser(this.parser, response)]);
    var data = this.serializeSetAgent(ext, agentState, roles);
    console.log('setAgentState data=' + data);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createMonitorStart = function(monitorId, response)
{
    this.callbacks.push([this.invokeId.toString(), new MonitorStartParser(this.parser, response)]);
    var data = this.serializeMonitorStart(monitorId);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createMonitorStop = function(monitorId, response)
{
    this.callbacks.push([this.invokeId.toString(), new GeneralParser(this.parser, response)]);
    var data = this.serializeMonitorStop(monitorId);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createCallLog = function(timestamp)
{
    var data = this.serializeCallLog(timestamp);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createMakeCall = function(toExt, role, response)
{
    this.callbacks.push([this.invokeId.toString(), new MakeCallParser(this.parser, response)]);
    var data = this.serializeMakeCall(toExt, role, response);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createAnswerCall = function(callId, deviceId, response)
{
    this.callbacks.push([this.invokeId.toString(), new GeneralParser(this.parser, response)]);
    var data = this.serializeAnswerCall(callId, deviceId, response);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createClearCall = function(callId, deviceId, response)
{
    this.callbacks.push([this.invokeId.toString(), new GeneralParser(this.parser, response)]);
    var data = this.serializeClearCall(callId, deviceId, response);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createHoldCall = function(callId, deviceId, response)
{
    this.callbacks.push([this.invokeId.toString(), new GeneralParser(this.parser, response)]);
    var data = this.serializeHoldCall(callId, deviceId, response);
    console.log('createHoldCall, data=' + data);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createRetrieveCall = function(callId, deviceId, response)
{
    this.callbacks.push([this.invokeId.toString(), new GeneralParser(this.parser, response)]);
    var data = this.serializeRetrieveCall(callId, deviceId, response);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createParkCall = function(callId, deviceId, response)
{
    this.callbacks.push([this.invokeId.toString(), new GeneralParser(this.parser, response)]);
    var data = this.serializeParkCall(callId, deviceId, response);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createTransferCall = function(callId, deviceId, to, response)
{
    this.callbacks.push([this.invokeId.toString(), new GeneralParser(this.parser, response)]);
    var data = this.serializeTransferCall(callId, deviceId, to, response);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createPresenceCall = function(status)
{
    var data = this.serializePresenceCall(status);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createScreenSharingJoined = function(status)
{
    var data = this.serializeScreenSharingJoined(status);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createScreenSharingTokenRequest = function(token_counter)
{
    var data = this.serializeScreenSharingTokenRequest(token_counter);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createScreenSharingGroupStart= function(groupId,pipelineId,endpoint)
{
    var data = this.serializeGroupScreenSharingStart(groupId,pipelineId,endpoint);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createScreenSharingUserStart= function(roomId,pipelineId,endpoint)
{
    var data = this.serializeUserScreenSharingStart(roomId,pipelineId,endpoint);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createScreenSharingLeave = function(status)
{
    var data = this.serializeScreenSharingLeave(status);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createGroupScreenSharingStop = function (groupId,sessionId) {
    var data = this.serializeGroupScreenSharingStop(groupId,sessionId);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createUserScreenSharingStop = function (roomId,sessionId) {
    var data = this.serializeUserScreenSharingStop(roomId,sessionId);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createWebChatStart = function(destination, name, page, id, response)
{
    this.callbacks.push([this.invokeId.toString(), new GeneralParser(this.parser, response)]);
    var data = this.serializeWebCStart(destination, name, page, id);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createWebChatStop = function(sessionId, response)
{
    this.callbacks.push([this.invokeId.toString(), new GeneralParser(this.parser, response)]);
    var data = this.serializeWebCStop(sessionId);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createWebChatMsg = function(msg, response)
{
    this.callbacks.push([this.invokeId.toString(), new GeneralParser(this.parser, response)]);
    var data = this.serializeWebCMsg(msg);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createWebChatMsgNew = function(msg, roomId,name)
{
    var data = this.serializeWebChatMessage(msg,roomId,name);
    var header = this.serializeHeader(encodeUtf8(data).length);
    return header + data;
}

//
CstaToolkit.prototype.createImMsg = function(message, to, msgId, from, name, recipType, roomId)
{
    var data = this.serializeImMsg(message, to, msgId, from, name, recipType, roomId);
    var header = this.serializeHeader(encodeUtf8(data).length);
    return header + data;
}

CstaToolkit.prototype.createCommunication = function(ackCode, msgId, reqId, persistId ,recipType, group, name)
{
    var data = this.serializeCommunication(ackCode, msgId, reqId, persistId ,recipType, group, name);
    var header = this.serializeHeader(encodeUtf8(data).length);
    return header + data;
}

CstaToolkit.prototype.createImMsgAck = function(ackCode, msgId, persistId, recipId, groupId, ackType, from, fromName, roomId, timestamp)
{
    var data = this.serializeImMsgAck(ackCode, msgId, persistId, recipId, groupId, ackType, from, fromName, roomId,timestamp);
    var header = this.serializeHeader(data.length);
    return header + data;
}

CstaToolkit.prototype.createImMsgAckStatus = function(ackCode, msgId, persistId, recipId, groupId, recipType, from, fromName, roomId, timestamp,action,group)
{

    var data = this.serializeImMsgAckStatus(ackCode, msgId, persistId, recipId, groupId, recipType, from, fromName, roomId,timestamp,action,group);
    var header = this.serializeHeader(encodeUtf8(data).length);
    return header + data;
}
//

CstaToolkit.prototype.extractInvokeId = function(header)
{
    var invokeId =  parseInt(header.substring(4, 8));
    // console.log('package with invokeId found=' + invokeId);
    return invokeId.toString();
}

CstaToolkit.prototype.parseData = function(message)
{
    var encodedLength = message.charCodeAt(0);
    var encodedHeader = message.substr(1, encodedLength);
    var rawData = message.substr(1 + encodedLength, message.length - 1 - encodedLength);
    var decodedHeader = atob(encodedHeader);
    var invokeId = this.extractInvokeId(decodedHeader);
    if (invokeId == 9999)
        this.processEvent(rawData);
    else
        this.processResponse(invokeId, rawData);
}

CstaToolkit.prototype.detectEventType = function(message)
{
    if (message.indexOf("DeliveredEvent") !== -1)
        return eCstaEvent.DELIVERED;
    else if (message.indexOf("EstablishedEvent") !== -1)
        return eCstaEvent.ESTABLISHED;
    else if (message.indexOf("ConnectionClearedEvent") !== -1)
        return eCstaEvent.CLEARED;
    else if (message.indexOf("HeldEvent") !== -1)
        return eCstaEvent.HELD;
    else if (message.indexOf("RetrievedEvent") !== -1)
        return eCstaEvent.RETRIEVED;
    else if (message.indexOf("callParkInfo") !== -1)
        return eCstaEvent.PARKED;
    else if (message.indexOf("AssignDeviceInfo") !== -1)
        return eCstaEvent.ASSIGNED;
    else if (message.indexOf("CSTAErrorCode") !== -1){
        console.log('error csta')
        return eCstaEvent.CSTA_ERROR;
    }
    else if (message.indexOf("callloginfo") !== -1)
        return eCstaEvent.CALL_LOG;
    else if (message.indexOf("webChatStatusEvent") !== -1)
        return eCstaEvent.WC_STATUS;
    else if (message.indexOf("webChatConfigEvent") !== -1)
        return eCstaEvent.WC_CONFIG;
    else if (message.indexOf("webChatPartnerEvent") !== -1)
        return eCstaEvent.WC_PARTNER;
    else if (message.indexOf("webChatMsgEvent") !== -1)
        return eCstaEvent.WC_MSG;
    else if (message.indexOf("AgentDeleteEvent") !== -1)
        return eCstaEvent.AGENT_DELETED;
    else if (message.indexOf("AgentAddEvent") !== -1)
        return eCstaEvent.AGENT_ADDED;
	else if (message.indexOf("message ") !== -1)
        return eCstaEvent.IM_MSG;
	else if (message.indexOf("messageAck") !== -1)
        return eCstaEvent.IM_MSG_ACK;
    else if(message.indexOf("WcUserAdded") !== -1)
        return eCstaEvent.WC_AGENT_ADDED
    else if(message.indexOf("WcUserRemoved") !== -1)
        return eCstaEvent.WC_AGENT_DELETED
    else if(message.indexOf("ImGroupUserAdded") !== -1)
        return eCstaEvent.IM_GROUP_USER_ADDED
    else if(message.indexOf("ImGroupUserRemoved") !== -1)
        return eCstaEvent.IM_GROUP_USER_REMOVED
    else if (message.indexOf("presence") !== -1)
        return eCstaEvent.PRESENCE;
    else if (message.indexOf("ImGroupStartScreenSharingEvent") !== -1)
        return eCstaEvent.SCREENSHARE_START_GROUP;
    else if (message.indexOf("ImGroupStopScreenSharingEvent") !== -1)
        return eCstaEvent.SCREENSHARE_STOP_GROUP;
    else if (message.indexOf("ScreenSharingTokenEvent") !== -1)
        return eCstaEvent.SCREENSHARE_TOKEN;
    else if (message.indexOf("StartScreenSharingEvent") !== -1)
        return eCstaEvent.SCREENSHARE_START_USER;
    else if (message.indexOf("StopScreenSharing") !== -1)
        return eCstaEvent.SCREENSHARE_STOP_USER;
    return eCstaEvent.UNKNOWN;
}




CstaToolkit.prototype.processEvent = function(message)
{
    // console.log('CstaToolkit.prototype.processEvent=' + message);

    switch(this.detectEventType(message))
    {

        case eCstaEvent.DELIVERED: this.delivered(parseDelivered(this.parser, message)); break;
        case eCstaEvent.ESTABLISHED: this.established(parseEstablished(this.parser, message)); break;
        case eCstaEvent.CLEARED: this.cleared(parseCleared(this.parser, message)); break;
        case eCstaEvent.HELD: this.held(parseHeld(this.parser, message)); break;
        case eCstaEvent.RETRIEVED: this.retrieved(parseRetrieved(this.parser, message)); break;
        case eCstaEvent.PARKED: this.parked(parseParked(this.parser, message)); break;
        case eCstaEvent.CALL_LOG: this.call_log(parseCallLog(this.parser, message)); break;
        case eCstaEvent.PRESENCE: this.presence(parsePresence(this.parser,message)); break;
        case eCstaEvent.WC_STATUS: this.wc_status(parseWcStatus(this.parser,message)); break;
        case eCstaEvent.WC_CONFIG: this.wc_config(parseWcConfig(this.parser,message)); break;
        case eCstaEvent.WC_PARTNER: this.wc_partner(parseWcPartner(this.parser,message)); break;
        case eCstaEvent.WC_MSG: this.wc_msg(parseWcMsg(this.parser,message)); break;
        case eCstaEvent.AGENT_DELETED: this.agent_deleted(parseAgentDeleted(this.parser,message)); break;
        case eCstaEvent.AGENT_ADDED: this.agent_added(parseAgentAdded(this.parser,message)); break;
		case eCstaEvent.IM_MSG: this.im_msg(parseImMsg(this.parser,message)); break;
		case eCstaEvent.IM_MSG_ACK: this.im_msg_ack(parseImMsgAck(this.parser,message)); break;
        case eCstaEvent.WC_AGENT_ADDED: this.ws_agent_added(parseWcAgentAdded(this.parser,message)); break;
        case eCstaEvent.WC_AGENT_DELETED: this.ws_agent_deleted(parseWcAgentDeleted(this.parser,message)); break;
        case eCstaEvent.IM_GROUP_USER_ADDED:this.im_msg(parseImGroupUserAdded(this.parser,message)); break;
        case eCstaEvent.IM_GROUP_USER_REMOVED:this.im_msg(parseImGroupUserRemoved(this.parser,message)); break;
        case eCstaEvent.SCREENSHARE_START_USER:this.screensharing(parseScreenShareStartUser(this.parser,message)); break;
        case eCstaEvent.SCREENSHARE_STOP_USER:this.screensharing(parseScreenShareStopUser(this.parser,message)); break;
        case eCstaEvent.SCREENSHARE_START_GROUP:this.screensharing(parseScreenShareStartGroup(this.parser,message)); break;
        case eCstaEvent.SCREENSHARE_STOP_GROUP:this.screensharing(parseScreenShareStopGroup(this.parser,message)); break;
        case eCstaEvent.SCREENSHARE_TOKEN:this.screensharing(parseScreenShareToken(this.parser,message)); break;
        //case eCstaEvent.ASSIGNED: this.assigned(parseAssigned(this.parser, message)); break;//TODO - should we show it somewhere?
       case eCstaEvent.CSTA_ERROR: this.csta_error(parseCstaError(this.parser, message)); break;

        default: console.log('Unknown event retrieved =' + message);
    }
}

CstaToolkit.prototype.getParserIndex = function(invokeId)
{
    for(var i=0; i < this.callbacks.length; ++i)
    {
        if (this.callbacks[i][0] == invokeId)
            return i;
    }

    return -1;
}

CstaToolkit.prototype.processResponse = function(invokeId, message)
{
    var prIndex = this.getParserIndex(invokeId);
    if (prIndex != -1)
    {
        console.log(invokeId)
        var response = this.callbacks[prIndex][1].Parse(message);
        this.callbacks[prIndex][1].responseCb(response);
        this.callbacks.splice(prIndex, 1);
    }
    else if(message.indexOf("loginResponce") !== -1) {
        this.loginwww(parseLoginSession(this.parser, message))
    }
    else if(message.indexOf("StartScreenSharingResponse")!== -1) {
        this.screeshare(parseStartScreenSharingResponse(this.parser, message))
    }
    else if(message.indexOf("StopScreenSharingResponse")!== -1) {
        this.screeshare(parseStopScreenSharingResponse(this.parser, message))
    }

else if(message.indexOf("ScreenSharingLeftResponse") !== -1) {
        this.screeshare(parseScreenShareLeftResponse(this.parser, message))
    }
    else if(message.indexOf("ScreenSharingJoinedResponse") !== -1) {
        this.screeshare(parseScreenSharingJoinedResponse(this.parser, message))
    }

    // else if(message.indexOf("ScreenSharingTokenEvent") !== -1) {
    //     this.screeshare(parseScreenShareLeftResponse(this.parser, message))
    // }
    else if(message.indexOf("loginFailed") !== -1) {
        console.log(message)
        console.log(this.loginwww);
        this.loginerror(parseLoginFailed(this.parser, message))
        return {
            name:'dd'
        }
    }
    else {
        console.log('Unable to find callback for invokeId=' + invokeId);
        this.csta_error(parseCstaError(this.parser, message))
    }
}
