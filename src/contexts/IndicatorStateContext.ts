import React, { useContext } from "react";
import { IndicatorsState } from "../types";

const Context = React.createContext({
  setDragDropIndicators: (state: IndicatorsState) => {}
});

const { Provider, Consumer } = Context;

export const useIndicatorStateContext = () => useContext(Context);

export {
  Provider as IndicatorStateProvider,
  Consumer as IndicatorStateCosumer
};
