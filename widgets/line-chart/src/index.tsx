import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  type IWidget,
  type IPanelDescription,
  type ICustomWidgetProps,
  type IWidgetsContext,
} from "@infomaximum/custom-widget";
import manifest from "../manifest.json";
import { fillSettings, type WidgetSettings } from "definition/settings";
import { createPanelDescription } from "definition/panel";
import LineChart from "LineChart";
import { Definition } from "definition/definition";

class CustomWidget implements IWidget<WidgetSettings> {
  public static definition = new Definition();

  root: ReactDOM.Root | null = null;

  public initialize(container: HTMLElement) {
    this.root = ReactDOM.createRoot(container);
  }

  public mount(
    container: HTMLElement,
    props: ICustomWidgetProps<WidgetSettings>
  ) {
    this.render(props);
  }

  public update(
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

  /** @deprecated 2401 - перенесена в definition */
  public static createPanelDescription(
    context: IWidgetsContext,
    settings: WidgetSettings
  ): IPanelDescription<WidgetSettings> {
    return createPanelDescription(context, settings);
  }

  /** @deprecated 2401 - перенесена в definition */
  public static fillSettings(
    settings: WidgetSettings,
    context: IWidgetsContext
  ) {
    return fillSettings(settings, context);
  }
}

window.im.defineWidget(manifest.uuid, CustomWidget);
