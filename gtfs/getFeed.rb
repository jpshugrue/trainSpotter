require 'protobuf'
require 'google/transit/gtfs-realtime.pb'
require 'net/http'
require 'uri'
require_relative './config'

data = Net::HTTP.get(URI.parse("http://datamine.mta.info/mta_esi.php?key=#{@config[:mtaKey]}"))
feed = Transit_realtime::FeedMessage.decode(data)
for entity in feed.entity do
  if entity.field?(:trip_update)
    p entity.trip_update
  end
end
