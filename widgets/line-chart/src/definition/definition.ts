import type {
  IDefinition,
  IPanelDescriptionCreator,
  TZod,
} from "@infomaximum/widget-sdk";
import { WidgetSettingsSchema, type WidgetSettings } from "./settings";
import { createPanelDescription } from "./panel";

export class Definition implements IDefinition<WidgetSettings> {
  public createSettingsSchema(z: TZod) {
    return WidgetSettingsSchema(z);
  }

  public createPanelDescription: IPanelDescriptionCreator<WidgetSettings> =
    createPanelDescription;

  public getSortableIndicatorsKeys(): readonly (keyof WidgetSettings)[] {
    return [];
  }
}
