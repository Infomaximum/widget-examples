import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  type IWidget,
  type IPanelDescription,
  type ICustomWidgetProps,
  type IWidgetsContext,
  type IWidgetMeasure,
  type IWidgetDimension,
  type IWidgetDimensionHierarchy,
} from "@infomaximum/custom-widget";
import manifest from "../manifest.json";
import { fillSettings, type WidgetSettings } from "settings";
import { createPanelDescription } from "panel";
import LineChart from "LineChart";

class CustomWidget implements IWidget<WidgetSettings> {
  root: ReactDOM.Root | null = null;

  public initialize(container: HTMLElement) {
    this.root = ReactDOM.createRoot(container);
  }

  public update(
    container: HTMLElement,
    props: ICustomWidgetProps<WidgetSettings>
  ) {
    this.render(props);
  }

  public mount(
    container: HTMLElement,
    props: ICustomWidgetProps<WidgetSettings>
  ) {
    this.render(props);
  }

  public unmount() {
    this.root?.unmount();

    this.root = null;
  }

  private render(props: ICustomWidgetProps<WidgetSettings>) {
    this.root?.render(
      <React.StrictMode>
        <LineChart {...props} />
      </React.StrictMode>
    );
  }

  public static createPanelDescription(
    context: IWidgetsContext,
    settings: WidgetSettings
  ): IPanelDescription<WidgetSettings> {
    return createPanelDescription(context, settings);
  }

  public static fillSettings(
    settings: WidgetSettings,
    context: IWidgetsContext
  ) {
    return fillSettings(settings, context);
  }

  public static getDimensions(): (
    | IWidgetDimension
    | IWidgetDimensionHierarchy
  )[] {
    return [];
  }

  public static getMeasures(): IWidgetMeasure[] {
    return [];
  }
}

window.im.defineWidget(manifest.uuid, CustomWidget);
