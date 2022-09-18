import { render } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import InfiniteList from "react-infinite-scroll-list";

import { FontOption } from "./FontOption";
import { Search } from "./Search";
import "./style.scss";

const offset = 20;

export function App() {
  const index = useRef(0);

  const [searchResultSet, setSearchResultSet] = useState([]);
  const [displayedFonts, setDisplayedFonts] = useState([]);
  const [fontSource, setFontSource] = useState([]);
  const [loadedFontFaces, setLoadedFontFaces] = useState([]);
  const [uniqueFonts, setUniqueFonts] = useState([]);

  const addFontsToDisplay = () => {
    const newIndex = index.current + offset;
    setDisplayedFonts([
      ...displayedFonts,
      ...searchResultSet.slice(index.current, newIndex)
    ]);
    index.current += offset;
  };

  const resetFontsOnDisplay = () => {
    index.current = 0;
    setDisplayedFonts([...searchResultSet.slice(index.current, offset)]);
    index.current += offset;
  };

  useEffect(() => {
    const getUniqueFontNames = (source) => {
      const firstFontName = source[0];
      const uniqueFontNames = source.reduce(
        (acc, fontName) => {
          const lastFontName = acc[acc.length - 1];
          if (!fontName.startsWith(lastFontName)) {
            acc.push(fontName);
          }
          return acc;
        },
        [firstFontName]
      );

      return uniqueFontNames;
    };

    fetch(`https://fonts.flipdish.com/index.json`)
      .then((response) => response.json())
      .then((source) => {
        const sortedFonts = source.sort();
        const uniqueNamesList = getUniqueFontNames(sortedFonts);

        setFontSource(source);
        setSearchResultSet(uniqueNamesList);
        setUniqueFonts(uniqueNamesList);
      });
  }, []);

  useEffect(() => {
    resetFontsOnDisplay();
  }, [searchResultSet]);

  return (
    <div>
      <h1>Flipdish Self-hosted Font Service</h1>

      <ul className="stats">
        <li>Unique fonts: {uniqueFonts.length}</li>
        <li>Variations: {fontSource.length - uniqueFonts.length}</li>
        <li>Total: {fontSource.length}</li>
        <li>Search Result: {searchResultSet.length}</li>
      </ul>

      <p>Display Fonts: {displayedFonts.map((font) => `${font}, `)}</p>
      <p>Loaded Font-Faces: {loadedFontFaces.map((font) => `${font}, `)}</p>

      <Search setSearchResultSet={setSearchResultSet} source={uniqueFonts} />

      <ul class="list">
        <InfiniteList
          isEndReached={displayedFonts.length >= searchResultSet.length}
          onReachThreshold={addFontsToDisplay}
          root="viewport"
          threshold={0}
        >
          {displayedFonts.map((fontName) => (
            <li class="fontOption">
              <FontOption
                fontName={fontName}
                loadedFontFaces={loadedFontFaces}
                setLoadedFontFaces={setLoadedFontFaces}
              />
            </li>
          ))}
        </InfiniteList>
      </ul>
    </div>
  );
}

if (typeof window !== "undefined") {
  render(<App />, document.getElementById("root"));
}
