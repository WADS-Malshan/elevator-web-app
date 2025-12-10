"use client";

import { useElevator } from "@/app/hooks/useElevator";
import ElevatorListItem from "../../elements/elevator-list-item/elevator-list-item";

export default function Elevator() {
  const { currentFloor, addRequest, requests, FLOORS } = useElevator();

  return (
    <section className="elevator">
      <div className="elevator-wrap">
        <div className="elevator-list">
          <div className="elevator-list-wrap">
            {/* Map over floors 5 down to 0 */}
            {FLOORS.map((floor) => (
              <ElevatorListItem
                key={floor}
                floorNumber={floor}
                isCurrentFloor={currentFloor === floor}
                isRequested={requests.includes(floor)}
                onRequestFloor={addRequest}
                allFloors={FLOORS}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}