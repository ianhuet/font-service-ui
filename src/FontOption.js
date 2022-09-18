import { useEffect, useState } from "preact/hooks";
import WebFont from "webfontloader";

export const FontOption = (props) => {
  const { fontName, loadedFontFaces, setLoadedFontFaces } = props;
  const [isFontLoaded, setIsFontLoaded] = useState(null);

  const fontFaceCssUrl = `https://fonts.flipdish.com/${fontName}.css`;

  const loadFont = () => {
    const loaderConfig = {
      custom: {
        families: [fontName],
        urls: [fontFaceCssUrl]
      },
      events: true,
      fontactive: () => {
        const newFontFaces = loadedFontFaces.concat([fontName]).sort();
        setLoadedFontFaces(newFontFaces);
        setIsFontLoaded(true);
      }
    };
    WebFont.load(loaderConfig);
  };

  useEffect(() => {
    if (!loadedFontFaces.includes(fontName)) {
      loadFont();
    }
  }, []);

  const copyTextToClipboard = (content) => {
    if (!navigator.clipboard) {
      return;
    }

    navigator.clipboard.writeText(content).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        alert("Copy to Clipdboard failed");
      }
    );
  };
  const handleAddToClipdboard = (content) => copyTextToClipboard(content);

  if (!isFontLoaded) {
    return <button>{`loading... ${fontName}`}</button>;
  }

  return (
    <button
      onClick={() => handleAddToClipdboard(fontFaceCssUrl)}
      style={`font-family: ${fontName}`}
    >
      <div>
        <h2>{fontName}</h2>
        <p>The quick brown fox jumps over the lazy dog</p>

        <p className="plainName">{fontName}</p>
      </div>
    </button>
  );
};

// export const FontOption = memo(FontOptionComponent);
