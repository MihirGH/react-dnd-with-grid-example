// Libraries
import { useRef } from "react";
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd";

// Constants
import { SORTABLE_ROW_ITEM_TYPE } from "../../constants";

const style = {
  backgroundColor: "aliceblue",
  cursor: "move"
};

interface DragItem {
  id: string;
  index: number;
  type: string;
}

export const IndexColumn = ({
  id,
  text,
  index,
  moveRows
}: {
  id: string;
  text: string;
  index: number;
  moveRows: (dragIndex: number, hoverIndex: number) => void;
}) => {
  const ref = useRef(null);

  const [{ handlerId, isOver }, drop] = useDrop({
    accept: SORTABLE_ROW_ITEM_TYPE,

    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver()
      };
    },

    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveRows(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: SORTABLE_ROW_ITEM_TYPE,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 1 : 1;

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        ...style,
        opacity,
        backgroundColor: isOver ? "red" : "aliceblue"
      }}
      data-handler-id={handlerId}
    >
      {text}
    </div>
  );
};
