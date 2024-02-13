import {
  EColorMode,
  type IBaseWidgetSettings,
  type IFillSettings,
  type IWidgetDimension,
  type IWidgetDimensionHierarchy,
  type IWidgetMeasure,
} from "@infomaximum/custom-widget";
import type { LayoutPosition } from "chart.js";

type RemoveIndex<T> = {
  [P in keyof T as keyof any extends P ? never : P]: T[P];
};

export type LegendPosition = RemoveIndex<LayoutPosition>;

export interface WidgetSettings extends IBaseWidgetSettings {
  limit: number;
  dimensions: (IWidgetDimension | IWidgetDimensionHierarchy)[];
  measures: IWidgetMeasure[];
  legend: boolean;
  legendPosition: LegendPosition;
  color: {
    mode: EColorMode.BASE;
    value: string;
    defaultColor?: string;
  };
}

export const fillSettings: IFillSettings<WidgetSettings> = (settings) => {
  settings.header ??= "";
  settings.headerSize ??= 14;
  settings.limit ??= 15;
  settings.dimensions ??= [];
  settings.measures ??= [];
  settings.legend ??= false;
  settings.legendPosition ??= "top";
  settings.color ??= {
    mode: EColorMode.BASE,
    value: "#FF0000",
    defaultColor: "#FF0000",
  };
};
