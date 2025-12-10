import { IconCaretUp, IconCaretDown } from '@tabler/icons-react';

// Define the interface for the props coming from elevator.tsx
interface ElevatorProps {
  floorNumber: number;
  isCurrentFloor: boolean;
  isRequested: boolean;
  onRequestFloor: (floor: number) => void;
  allFloors: number[];
}

export default function ElevatorListItem({
  floorNumber,
  isCurrentFloor,
  isRequested,
  onRequestFloor,
  allFloors
}: ElevatorProps) {

  return (
    <section className="elevator-list-item">
      <div className="elevator-list-item-wrap">

        {/* ARROWS (Outside Buttons) */}
        <div className="elevator-arrow">
          <div className="elevator-arrow-wrap">
            {floorNumber < 5 && (
              <div className="top-arrow" onClick={() => onRequestFloor(floorNumber)}>
                <IconCaretUp color={isRequested && !isCurrentFloor ? '#f59e0b' : 'currentColor'} />
              </div>
            )}
            {floorNumber > 0 && (
              <div className="down-arrow" onClick={() => onRequestFloor(floorNumber)}>
                <IconCaretDown color={isRequested && !isCurrentFloor ? '#f59e0b' : 'currentColor'} />
              </div>
            )}
          </div>
        </div>

        {/* ELEVATOR BOX */}
        {/* We change the class or style if it is the current floor */}
        <div className={`elevator-box ${isCurrentFloor ? 'active' : ''}`}>
          <div className="elevator-box-wrap">
            <div className="elevator-box-number">
              <span className="text">
                {floorNumber}
              </span>
            </div>

            {/* INTERNAL PANEL (Inside Buttons) - Only visible if current floor */}
            {isCurrentFloor && (
              <div className="elevator-box-panel">
                <div className="elevator-box-panel-wrap">
                  <div className="panel-number">
                    {/* We map floors so the buttons work dynamically */}
                    {allFloors.map((btnFloor) => (
                      <div
                        key={btnFloor}
                        className="number"
                        onClick={() => onRequestFloor(btnFloor)}
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="text">{btnFloor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}