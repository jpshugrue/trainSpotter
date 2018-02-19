def buildOutRoutes
  routes = {}
  trips = {}
  File.open("./static/trips.txt", "r") do |f|
    f.each_line do |line|
      split = line.split(",")
      trips[split[2]] = [split[0]]
    end
  end
  File.open("./static/stop_times.txt", "r") do |f|
    f.each_line do |line|
      split = line.split(",")
      trips[split[0]] << split[3]
    end
  end
  trips.each do |trip_id, arr|
    if routes[arr[0]]
      routes[arr[0]] = routes[arr[0]].concat(arr[1..-1])
    else
      routes[arr[0]] = arr[1..-1]
    end
    routes[arr[0]].uniq!
  end
  File.open("./static/lines.txt", "w") do |f|
    routes.each do |route_id, stops|
      stopStr = stops.join(",")
      f.write("#{route_id},#{stopStr}")
      f.write("\n")
    end
  end
end
