export const truckShippingCost  = (vehicle, goodsType, distance, weight) => {
  const tripSort = vehicle.sort( (a, b) => {
    if (!b) {
      return a
    }
    return a.capacity - b.capacity;
  });

  const largestTruckSize = tripSort.slice(-1)[0];
  let tripCost = tripSort.find(value => {
    return weight < value.weightLimit && value.type === goodsType
  });
  const requiredTrips = weight > 0 ? (Math.round((weight / largestTruckSize.weightLimit) * 100) / 100) : 0;
  const largeTrips = Math.floor(requiredTrips);
  const largeTripCost = largeTrips * largestTruckSize.pricePerKm * distance;
  const weightFraction = (requiredTrips % 1) * largestTruckSize.weightLimit;
  const requiredTruck = tripSort.find((value) => {
    if(!(weightFraction < value.capacity && value.vehicleType === goodsType)) {
      return value
    }
    return weightFraction < value.capacity && value.vehicleType === goodsType
  });
  const smallTripCost = requiredTruck.pricePerKm * distance;
  const totalCostTrip = largeTripCost + smallTripCost;
  return tripCost ? tripCost : totalCostTrip
};
