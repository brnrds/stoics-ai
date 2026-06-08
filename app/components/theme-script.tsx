import { themeInlineScript } from "@/lib/theme";

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: themeInlineScript(),
      }}
    />
  );
}
