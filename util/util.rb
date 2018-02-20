require 'json'
require 'set'

def buildOutRoutes
  result = {}
  trips_by_route = {}
  File.open("./static/trips.txt", "r") do |f|
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
  File.open("./static/custom/line_colors.txt", "r") do |f|
    f.each_line do |line|
      split = line.split(",")
      route_id = split[0]
      color = split[1]
      result[route_id][:color] = color if result[route_id]
    end
  end
  File.open("./static/stop_times.txt", "r") do |f|
    current_trip = nil
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
            result[route_id][:sequences] << [departure, arrival]
          end
        end
      end
    end
  end
  File.open("./static/stops.txt", "r") do |f|
    f.each_line do |line|
      split = line.split(",")
      stop_id = split[0]
      result.each do |route_id, val|
        if val[:stops].keys.include?(stop_id)
          val[:stops][stop_id][:stop_name] = split[2]
          val[:stops][stop_id][:lat] = split[4]
          val[:stops][stop_id][:lng] = split[5]
          val[:stops][stop_id][:parent] = split[9]
        end
      end
    end
  end
  File.open("./static/custom/lines.json", "w") do |f|
    f.write(JSON.pretty_generate(result))
    #
    # routes.each do |route_id, stops|
    #   stopStr = stops.join(",")
    #   f.write("#{route_id},#{stopStr}")
    #   f.write("\n")
    # end
  end
  # puts "Finally"
  # puts JSON.pretty_generate(result)

end

#   routes = {}
#   trips = {}
#   File.open("./static/trips.txt", "r") do |f|
#     f.each_line do |line|
#       split = line.split(",")
#       trips[split[2]] = [split[0]]
#     end
#   end
#   File.open("./static/stop_times.txt", "r") do |f|
#     f.each_line do |line|
#       split = line.split(",")
#       trips[split[0]] << split[3]
#     end
#   end
#   trips.each do |trip_id, arr|
#     if routes[arr[0]]
#       routes[arr[0]] = routes[arr[0]].concat(arr[1..-1])
#     else
#       routes[arr[0]] = arr[1..-1]
#     end
#     routes[arr[0]].uniq!
#   end
#   File.open("./static/lines.txt", "w") do |f|
#     routes.each do |route_id, stops|
#       stopStr = stops.join(",")
#       f.write("#{route_id},#{stopStr}")
#       f.write("\n")
#     end
#   end
# end
