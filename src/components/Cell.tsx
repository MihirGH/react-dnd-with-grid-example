// Libraries
import React from "react";

// Constants
import { useSortableCell } from "../hooks/useSortableCell";

// Types
import { IndicatorsState } from "../types";

interface Props {
  id: string;
  text: string;
  rowIndex: number;
  columnIndex: number;
  moveRows: (dragIndex: number, hoverIndex: number) => void;
  isDragging?: boolean;
  isOver?: boolean;
  showCustomDragLayer: boolean;
}

export const Cell = React.forwardRef<HTMLDivElement, Props & IndicatorsState>(
  (
    { text, rowIndex, columnIndex, dragStartIndex, hoverIndex, isOver },
    ref
  ) => {
    return (
      <div
        className={`table-cell${
          columnIndex === 0 ? " first-column sortable-table-cell" : ""
        }${rowIndex === 0 ? " first-row" : ""}`}
        ref={ref}
      >
        {text}
      </div>
    );
  }
);

export const SortableCellContainer = (props: Props) => {
  const { id, rowIndex, columnIndex, showCustomDragLayer, moveRows } = props;

  const {
    ref,
    isDragging,
    isOver,
    dragStartIndex,
    hoverIndex
  } = useSortableCell({
    isSortable: columnIndex === 0,
    itemToRegister: { id, rowIndex, originalRowIndex: rowIndex },
    showCustomDragLayer,
    moveRows
  });

  return (
    <Cell
      {...props}
      ref={ref}
      isDragging={isDragging}
      isOver={isOver}
      dragStartIndex={dragStartIndex}
      hoverIndex={hoverIndex}
    />
  );
};
