import {Meteor} from 'meteor/meteor';

SseSamples = new Mongo.Collection("SseSamples");
SseProps = new Mongo.Collection("SseProps");

if (Meteor.isServer) {
    Meteor.publish("sse-data-descriptor", function (imageUrl) {
        return SseSamples.find({url: imageUrl});
    });

    Meteor.publish("sse-labeled-images", function (folder, fromIndex, pageLength) {
        return SseSamples.find(
            {folder: folder, $where: 'this.objects && this.objects.length>0'},
            {fields: {file: 1, url: 1}},
            {sort: {file: 1}},
            {skip: fromIndex * pageLength},
            {limit: pageLength}
        );
    });

    Meteor.publish('sse-props', function () {
        return SseProps.find({});
    });
}

