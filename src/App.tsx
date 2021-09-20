import React, { useState } from "react";
import Table, { TableWithContext } from "./components/Table";

const styles = {
  fontFamily: "sans-serif"
};

const App = () => {
  const [state, setState] = useState<"CONTEXT" | "WITHOUT_CONTEXT">(
    "WITHOUT_CONTEXT"
  );

  return (
    <div style={styles}>
      {state === "CONTEXT" ? <TableWithContext /> : <Table />}
      <button
        onClick={() =>
          setState((prevState) =>
            prevState === "CONTEXT" ? "WITHOUT_CONTEXT" : "CONTEXT"
          )
        }
      >
        {`Switch to: ${
          state === "CONTEXT" ? "Without Context" : "With Context"
        }`}
      </button>
    </div>
  );
};

export default App;
