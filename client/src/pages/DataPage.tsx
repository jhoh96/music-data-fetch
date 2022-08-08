import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Text } from "@visx/text";
import { scaleLog } from "@visx/scale";
import { Wordcloud } from "@visx/wordcloud";
import { useLocation } from "react-router-dom";
import { CheckBox } from "grommet";

import "./pageStyle.css";

const colors = ["#143059", "#2F6B9A", "#82a6c2"];

export default function DataPage() {
  // word cloud stuff
  const [spiralType, setSpiralType] = useState<SpiralType>("archimedean");
  const [withRotation, setWithRotation] = useState(false);
  const [wordsList, setWordsList] = useState<string[]>([]);
  const array: string[] = [];

  // other page stuff
  const [songLyrics, setSongLyrics] = useState();
  const [cloudChecked, setCloudChecked] = useState(false);
  const { state } = useLocation();
  const lyricsUrl = state.lyricsUrl;
  const songID = state.id;


  // words
  const words = wordFreq(songLyrics)

  // @visx Checks for word frequency of given text - for Word Cloud
  function wordFreq(text) {
    // This if the input text is a STRING
    const words: string[] = text.replace(/\./g, "").split(/\s/);
    // This if the input text is AN ARRAY itself
    // const words = text;
    const freqMap: Record<string, number> = {};

    for (const w of words) {
      if (!freqMap[w]) freqMap[w] = 0;
      freqMap[w] += 1;
    }

    return Object.keys(freqMap).map((word) => ({
      text: word,
      value: freqMap[word],
    }));
  }

  // word cloud stuff
  function getRotationDegree() {
    const rand = Math.random();
    const degree = rand > 0.5 ? 60 : -60;
    return rand * degree;
  }

  // word cloud stuff
  const fontScale = scaleLog({
    domain: [
      Math.min(...words.map((w) => w.value)),
      Math.max(...words.map((w) => w.value)),
    ],
    range: [10, 100],
  });
  const fontSizeSetter = (datum: WordData) => fontScale(datum.value);
  const fixedValueGenerator = () => 0.5;
  type SpiralType = "archimedean" | "rectangular";

  useEffect(() => {
    try {
      Axios.get("http://localhost:3001/api/lyrics/" + songID, {
        method: "GET",
        params: {
          search: encodeURIComponent(lyricsUrl),
        },
      }).then((response: string) => {
        //render lyrics onto page OR store :string lyrics into array or
        // lyricsArray = response.data.split("\n").filter((x) => x.length);
        const reslyrics = response.data.split("\n").filter((x) => x.length);
        setSongLyrics(reslyrics);
      });
    } catch (err) {
      console.log(err);
      //fix error handling
    }
  }, [lyricsUrl, songID]);

  console.log(cloudChecked);

  return (
    <div className="song-data-main">
      <CheckBox
        checked={cloudChecked}
        label="Show lyrics cloud?"
        onClick={(event) => setCloudChecked(event.target.checked)}
        color={"green"}
      />
      {cloudChecked ? (
        <div>
          <div className="wordcloud">
            <Wordcloud
              words={words}
              width={width}
              height={height}
              fontSize={fontSizeSetter}
              font={"Impact"}
              padding={2}
              spiral={spiralType}
              rotate={withRotation ? getRotationDegree : 0}
              random={fixedValueGenerator}
            >
              {(cloudWords) =>
                cloudWords.map((w, i) => (
                  <Text
                    key={w.text}
                    fill={colors[i % colors.length]}
                    textAnchor={"middle"}
                    transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                    fontSize={w.size}
                    fontFamily={w.font}
                  >
                    {w.text}
                  </Text>
                ))
              }
            </Wordcloud>
            {showControls && (
              <div>
                <label>
                  Spiral type &nbsp;
                  <select
                    onChange={(e) =>
                      setSpiralType(e.target.value as SpiralType)
                    }
                    value={spiralType}
                  >
                    <option key={"archimedean"} value={"archimedean"}>
                      archimedean
                    </option>
                    <option key={"rectangular"} value={"rectangular"}>
                      rectangular
                    </option>
                  </select>
                </label>
                <label>
                  With rotation &nbsp;
                  <input
                    type="checkbox"
                    checked={withRotation}
                    onChange={() => setWithRotation(!withRotation)}
                  />
                </label>
                <br />
              </div>
            )}
            <style>{`
        .wordcloud {
          display: flex;
          flex-direction: column;
          user-select: none;
        }
        .wordcloud svg {
          margin: 1rem 0;
          cursor: pointer;
        }

        .wordcloud label {
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          margin-right: 8px;
        }
        .wordcloud textarea {
          min-height: 100px;
        }
      `}</style>
          </div>
        </div>
      ) : (
        <div id="hhmmm">HMMMMMM</div>
      )}
    </div>
  );
}
