export class HtmlEscape {
  static escape(source: string): string {
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#39;',
      '/': '&#x2F;'
    };
    return String(source).replace(/[&<>''\/]/g, s => entityMap[s]);
  }
  static unescape(source: string): string {
    return new DOMParser()
      .parseFromString(source, 'text/html')
      .documentElement.textContent;
  }
}
''''''''''''''''''
