import type {
  IDefinition,
  IFillSettings,
  IGroupSettings,
  IPanelDescriptionCreator,
  IWidgetDimension,
  IWidgetDimensionHierarchy,
  IWidgetMeasure,
} from "@infomaximum/custom-widget";
import { fillSettings, type WidgetSettings } from "./settings";
import { createPanelDescription } from "./panel";

export class Definition implements IDefinition<WidgetSettings, IGroupSettings> {
  public createPanelDescription: IPanelDescriptionCreator<
    WidgetSettings,
    IGroupSettings
  > = createPanelDescription;

  public fillSettings: IFillSettings<WidgetSettings> = fillSettings;

  public getDimensions(): (IWidgetDimension | IWidgetDimensionHierarchy)[] {
    return [];
  }

  public getMeasures(): IWidgetMeasure[] {
    return [];
  }
}
