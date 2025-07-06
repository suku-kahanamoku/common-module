import { ITERATE } from "./modify-object.functions";
import { RESOLVE_MARKS } from "./modify-string.functions";

export function RESOLVE_FACTORY(item: Record<string, any>, factory: any) {
  if (factory) {
    item.gen_data = {};
    try {
      factory = JSON.parse(factory);
    } catch (error: any) {
      factory = {};
    }
    ITERATE(
      factory,
      (value, name) => (item.gen_data[name] = RESOLVE_MARKS(value, item))
    );
  }
}
