// Libraries
import React, { useState, useCallback } from "react";
import { useDragLayer } from "react-dnd";
import { Grid } from "react-virtualized";
import update from "immutability-helper";

// Components
import { SortableCellContainer } from "./Cell";

// Styles
import "../tableStyles.css";

const COLUMNS_COUNT = 20;
const ROWS_COUNT = 10000;

function generateData() {
  const rows = [];

  for (let i = 0; i < ROWS_COUNT; i++) {
    rows[i] = [];

    for (let j = 0; j < COLUMNS_COUNT; j++) {
      rows[i].push(`r: ${i}, c: ${j}`);
    }
  }

  return rows;
}

const DragLayer = ({
  rowHeight,
  leftOffset,
  tableWidth
}: {
  rowHeight: number;
  leftOffset: number;
  tableWidth: number;
}): React.ReactElement | null => {
  const {
    initialSourceClientOffset,
    initialClientOffset,
    currentOffset
  } = useDragLayer((monitor) => ({
    clientOffset: monitor.getClientOffset(),
    initialSourceClientOffset: monitor.getInitialSourceClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  const displacementY =
    (currentOffset?.y ?? 0) - (initialSourceClientOffset?.y ?? 0);
  const yInitPointer = initialClientOffset?.y ?? 0;
  const yInitSource = initialSourceClientOffset?.y ?? 0;
  const top = (currentOffset?.y ?? 0) + yInitPointer - yInitSource + 1;

  return (
    <div
      style={{
        position: "fixed",
        border: "2px solid blue",
        height: `${rowHeight}px`,
        width: `${tableWidth}px`,
        display: !displacementY ? "none" : "block",
        top: `${top}px`,
        left: `${leftOffset}px`
      }}
    />
  );
};

const Table = ({
  dragStartIndex,
  hoverIndex
}: {
  dragStartIndex?: number;
  hoverIndex?: number;
}): React.ReactElement => {
  const [rows, setRows] = useState(() => generateData());

  const moveRows = useCallback((dragIndex, hoverIndex) => {
    setRows((prevRows) => {
      const dragCard = prevRows[dragIndex];
      return update(prevRows, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      });
    });
  }, []);

  const cellRenderer = ({ columnIndex, key, rowIndex, style }) => (
    <div key={key} style={style}>
      <SortableCellContainer
        id={rows[rowIndex][columnIndex]}
        rowIndex={rowIndex}
        columnIndex={columnIndex}
        text={rows[rowIndex][columnIndex]}
        moveRows={moveRows}
      />
    </div>
  );

  return (
    <>
      <DragLayer rowHeight={64} leftOffset={0} tableWidth={500} />
      <Grid
        cellRenderer={cellRenderer}
        columnCount={COLUMNS_COUNT}
        columnWidth={140}
        height={500}
        rowCount={ROWS_COUNT}
        rowHeight={64}
        width={500}
        rows={rows}
      />
    </>
  );
};

export default Table;
