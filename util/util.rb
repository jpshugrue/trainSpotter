require 'json'
require 'set'
require 'byebug'

def build_out_routes
  result = {}
  trips_by_route = {}
  File.open("../static/trips.txt", "r") do |f|
    f.each_line do |line|
      split = line.split(",")
      route_id = split[0]
      trip_id = split[2]
      if !result[route_id]
        result[route_id] = { stops: {}, sequences: [], color: "" }
      end
      if !trips_by_route[route_id]
        trips_by_route[route_id] = Set.new([trip_id])
      else
        trips_by_route[route_id] << trip_id
      end
    end
  end
  File.open("../static/custom/line_colors.txt", "r") do |f|
    f.each_line do |line|
      split = line.split(",")
      route_id = split[0]
      color = split[1].chomp
      result[route_id][:color] = color if result[route_id]
    end
  end
  File.open("../static/stop_times.txt", "r") do |f|
    current_trip = nil
    departure = nil
    f.each_line do |line|
      split = line.split(",")
      trip_id = split[0]
      stop_id = split[3]
      if current_trip != trip_id
        current_trip = trip_id
        departure = stop_id
        arrival = nil
      else
        arrival = stop_id
      end
      trips_by_route.each do |route_id, trip_ids|
        if trip_ids.include?(trip_id)
          result[route_id][:stops][stop_id] = {}
          if departure && arrival
            if !result[route_id][:sequences].include?([departure, arrival])
              result[route_id][:sequences] << [departure, arrival]
            end
          end
        end
      end
      departure = stop_id
    end
  end
  File.open("../static/stops.txt", "r") do |f|
    f.each_line do |line|
      split = line.split(",")
      stop_id = split[0]
      result.each do |route_id, val|
        if val[:stops].keys.include?(stop_id)
          val[:stops][stop_id][:stop_name] = split[2]
          val[:stops][stop_id][:lat] = split[4]
          val[:stops][stop_id][:lng] = split[5]
          val[:stops][stop_id][:parent] = split[9].chomp
        end
      end
    end
  end
  File.open("../static/custom/lines.json", "w") do |f|
    f.write(JSON.pretty_generate(result))
  end
end

def calculate_time(dep_time, arr_time)
  dep_ms = convert_to_ms(dep_time)
  arr_ms = convert_to_ms(arr_time)
  arr_ms - dep_ms
end

def convert_to_ms(time)
  total = 0
  arr = time.split(":").map(&:to_i)
  total += arr[0] * 3600000
  total += arr[1] * 60000
  total += arr[2] * 1000
  total
end

def parse_trip_id(trip_id)
  trip_id.split("_", 2)[1]
end

def build_out_stops
  result = {}

  File.open("../static/stops.txt", "r") do |f|
    f.each_line do |line|
      split = line.split(",")
      stop_id = split[0]
      result[stop_id] = {}
      result[stop_id][:stop_name] = split[2]
      result[stop_id][:lat] = split[4]
      result[stop_id][:lng] = split[5]
      result[stop_id][:parent] = split[9].chomp
    end
  end

  File.open("../static/custom/stops.json", "w") do |f|
    f.write(JSON.pretty_generate(result))
  end
end

def build_out_sequences
  result = {}

  File.open("../static/stop_times.txt", "r") do |f|
    current_trip = nil
    origin = nil
    departure_time = nil
    f.each_line do |line|
      split = line.split(",")
      trip_id = split[0]
      arrival_time = split[1]
      stop_id = split[3]
      if trip_id.include?("WKD")
        day_type = "WKD"
      elsif trip_id.include?("SAT")
        day_type = "SAT"
      elsif trip_id.include?("SUN")
        day_type = "SUN"
      else
        day_type = "ALL"
      end
      if current_trip != trip_id
        current_trip = trip_id
      else
        destination = stop_id
        time = calculate_time(departure_time, arrival_time)
        if !result[origin]
          result[origin] = {}
        end
        if !result[origin][destination]
          result[origin][destination] = {}
        end
        if !result[origin][destination][day_type]
          result[origin][destination][day_type] = [time]
        elsif !result[origin][destination][day_type].include?(time)
          result[origin][destination][day_type] << time
        end
      end
      origin = stop_id
      departure_time = arrival_time
    end
  end

  File.open("../static/custom/sequences.json", "w") do |f|
    f.write(JSON.pretty_generate(result))
  end
end
