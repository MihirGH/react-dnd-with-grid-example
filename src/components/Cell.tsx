// Libraries
import React from "react";

// Constants
import {
  useSortableCell,
  useSortableCellWithContext
} from "../hooks/useSortableCell";

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
}

const BORDER_TOP_STYLE: React.CSSProperties = {
  borderTopWidth: "2px",
  borderTopColor: "black",
  borderTopStyle: "solid"
};

const HOVER_INDICATOR_BORDER_TOP_STYLE: React.CSSProperties = {
  borderTopWidth: "2px",
  borderTopColor: "blue",
  borderTopStyle: "solid"
};

const HOVER_INDICATOR_BORDER_BOTTOM_STYLE: React.CSSProperties = {
  borderBottomWidth: "2px",
  borderBottomColor: "blue",
  borderBottomStyle: "solid"
};

export const Cell = React.forwardRef<HTMLDivElement, Props & IndicatorsState>(
  (
    { text, rowIndex, columnIndex, dragStartIndex, hoverIndex, isOver },
    ref
  ) => {
    const showDragIndicator = dragStartIndex === rowIndex;
    const showHoverIndicator =
      isOver && hoverIndex !== dragStartIndex && hoverIndex === rowIndex;
    const showHoverIndicatorAtTop =
      showHoverIndicator && dragStartIndex > hoverIndex;
    const showHoverIndicatorAtBottom =
      showHoverIndicator && dragStartIndex < hoverIndex;

    return (
      <div
        className={`table-cell${
          columnIndex === 0 ? " first-column sortable-table-cell" : ""
        }${rowIndex === 0 ? " first-row" : ""}`}
        ref={ref}
      >
        <div
          style={{
            position: "absolute",
            inset: "0px",
            ...(showDragIndicator && BORDER_TOP_STYLE),
            ...(showHoverIndicatorAtTop && HOVER_INDICATOR_BORDER_TOP_STYLE),
            ...(showHoverIndicatorAtBottom &&
              HOVER_INDICATOR_BORDER_BOTTOM_STYLE)
          }}
        />
        {text}
      </div>
    );
  }
);

export const SortableCellContainer = (props: Props) => {
  const { id, rowIndex, columnIndex, moveRows } = props;

  const {
    ref,
    isDragging,
    isOver,
    dragStartIndex,
    hoverIndex
  } = useSortableCell({
    isSortable: columnIndex === 0,
    itemToRegister: { id, rowIndex, originalRowIndex: rowIndex },
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

export const SortableCellWithContextContainer = (
  props: Props & IndicatorsState
) => {
  const { id, rowIndex, columnIndex, moveRows } = props;

  const { ref, isDragging, isOver } = useSortableCellWithContext({
    isSortable: columnIndex === 0,
    itemToRegister: { id, rowIndex, originalRowIndex: rowIndex },
    moveRows
  });

  return <Cell {...props} ref={ref} isDragging={isDragging} isOver={isOver} />;
};
