import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { type IWidget, type ICustomWidgetProps } from "@infomaximum/widget-sdk";
import manifest from "../manifest.json";
import { type WidgetSettings } from "definition/settings";
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
  }

  private render(props: ICustomWidgetProps<WidgetSettings>) {
    this.root?.render(
      <React.StrictMode>
        <LineChart {...props} />
      </React.StrictMode>
    );
  }
}

window.im.widget.defineWidget(manifest.uuid, CustomWidget);
