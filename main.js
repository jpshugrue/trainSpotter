const dcodeIO = require("protobufjs");
var ProtoBuf = dcodeIO.ProtoBuf;
var xhr = new XMLHttpRequest();
xhr.open(
/* method */ "GET",
/* file */ "path/to/gtfs.pb",
/* async */ true
);
xhr.responseType = "arraybuffer";
var resp = xhr.response;
var builder = ProtoBuf.loadProtoFile("nyct-subway.proto").build("transit_realtime");
//FeedMessage is the “container” object of the entire feed
var msg = builder.FeedMessage.decode(xhr.response);
var jsonMsg = JSON.stringify(msg,null,4);
//prints feed object to the console
console.log(jsonMsg);
//feed will be the object that contains the feed in plain text JSON object.
var feed = JSON.parse(jsonMsg);
