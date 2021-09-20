// Libraries
import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

// Contexts
import { useIndicatorStateContext } from "../contexts/IndicatorStateContext";

// Constants
import { SORTABLE_ROW_ITEM_TYPE } from "../constants";

// Types
import { IndicatorsState } from "../types";

interface Item {
  id: string;
  rowIndex: number;
  originalRowIndex: number;
}

export const useBaseSortableCell = ({
  isSortable,
  itemToRegister,
  moveRows,
  setIndicators
}: {
  isSortable: boolean;
  itemToRegister: Item;
  moveRows: (dragIndex: number, hoverIndex: number) => void;
  setIndicators: (state: IndicatorsState) => void;
}): {
  ref: React.MutableRefObject<HTMLDivElement | null>;
  isDragging: boolean;
  isOver: boolean;
} => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isOver }, drop] = useDrop<
    Item,
    { dragIndex: number; dropIndex: number },
    { handlerId; isOver }
  >({
    accept: SORTABLE_ROW_ITEM_TYPE,

    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver()
      };
    },

    drop: (draggedItem: Item) => {
      return {
        dragIndex: draggedItem.originalRowIndex,
        dropIndex: itemToRegister.rowIndex
      };
    },

    hover(draggedItem: Item) {
      if (!ref.current) {
        return;
      }

      const dragIndex = draggedItem.rowIndex;
      const hoverIndex = itemToRegister.rowIndex;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      draggedItem.rowIndex = hoverIndex;
      setIndicators({
        dragStartIndex: draggedItem.originalRowIndex,
        hoverIndex
      });
    }
  });

  const [{ isDragging }, drag] = useDrag<
    Item,
    { dragIndex: number; dropIndex: number },
    { isDragging: boolean }
  >({
    type: SORTABLE_ROW_ITEM_TYPE,

    item: () => {
      setIndicators({
        dragStartIndex: itemToRegister.rowIndex,
        hoverIndex: -1
      });

      return { ...itemToRegister };
    },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      dragStartIndex: itemToRegister.rowIndex
    }),

    end: (draggedItem: Item, monitor) => {
      setIndicators({ dragStartIndex: -1, hoverIndex: -1 });

      if (!monitor.didDrop()) {
        moveRows(draggedItem.originalRowIndex, itemToRegister.originalRowIndex);
        return;
      }

      const dropResult = monitor.getDropResult();

      if (dropResult) {
        moveRows(dropResult.dragIndex, dropResult.dropIndex);
      }
    }
  });

  if (isSortable) drag(drop(ref));

  return {
    ref,
    isDragging,
    isOver
  };
};

export const useSortableCell = ({
  isSortable,
  itemToRegister,
  moveRows
}: {
  isSortable: boolean;
  itemToRegister: Item;
  moveRows: (dragIndex: number, hoverIndex: number) => void;
}): ReturnType<typeof useBaseSortableCell> & IndicatorsState => {
  const [indicatorsState, setIndicators] = useState<IndicatorsState>({
    dragStartIndex: -1,
    hoverIndex: -1
  });

  const { isDragging, isOver, ref } = useBaseSortableCell({
    isSortable,
    itemToRegister,
    moveRows,
    setIndicators
  });

  return { ref, isDragging, isOver, ...indicatorsState };
};

export const useSortableCellWithContext = ({
  isSortable,
  itemToRegister,
  moveRows
}: {
  isSortable: boolean;
  itemToRegister: Item;
  moveRows: (dragIndex: number, hoverIndex: number) => void;
}): ReturnType<typeof useBaseSortableCell> => {
  const { setDragDropIndicators: setIndicators } = useIndicatorStateContext();

  const { isDragging, ref } = useBaseSortableCell({
    isSortable,
    itemToRegister,
    moveRows,
    setIndicators
  });

  return {
    ref,
    isDragging,
    isOver: true
  };
};
