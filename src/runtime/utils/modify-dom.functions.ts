export function SCROLL_TO_ELEMENT_BY_CLASS(id?: string) {
  if (id) {
    const element = document?.getElementsByClassName(`${id}`);
    if (element.length) {
      element[0].scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}
