import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Text } from "@visx/text";
import { scaleLog } from "@visx/scale";
import { Wordcloud } from "@visx/wordcloud";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckBox, Spinner, Image, Button } from "grommet";

import "./pageStyle.css";

interface ExampleProps {
  width: number;
  height: number;
  showControls?: boolean;
}

export interface WordData {
  text: string;
  value: number;
}

const colors = ["#143059", "#2F6B9A", "#82a6c2"];

export default function DataPage({
  width,
  height,
  showControls,
}: ExampleProps) {
  // Initial Props/States received
  const { state } = useLocation();
  const navigate = useNavigate();
  const lyricsUrl = state.lyricsUrl;
  const songID = state.id;
  const title = state.title;

  // word cloud stuff
  const [spiralType, setSpiralType] = useState<SpiralType>("archimedean");
  const [withRotation, setWithRotation] = useState(false);
  const [wordsList, setWordsList] = useState<string[]>([]);
  const array: string[] = [];

  // States
  // const [songLyrics, setSongLyrics] = useState();
  const [songLyricsArray, setSongLyricsArray] = useState([]);
  const [wordCloudArray, setWordCloudARray] = useState([])
  const [cloudChecked, setCloudChecked] = useState(false);
  const [lyricsLoaded, setLyricsLoaded] = useState(false);

  const patterns = [
    "[Chorus]",
    "[Verse ",
    "[Bridge]",
    "[Pre-Chorus]",
    "Dom Kennedy & Hit-Boy “CORSA” Official Lyrics & Meaning | Verified",
  ];

  // words
  const words = wordFreq(wordCloudArray);

  // @visx Checks for word frequency of given text - for Word Cloud
  function wordFreq(text) {
    var newArray = []
    var words = text;
    for (let i = 0; i < words.length; i++) {
      for (let j = 0; j < patterns.length; j++) {
        if (words[i].includes(patterns[j])) {
          words.splice(i, 1);
        }
      }
    }

    for(let i=0; i<words.length; i++) {
        let temp = words[i].split(' ')
        for(const ver of temp) {
          newArray.push(ver.replace(/[^a-zA-Z0-9 ]/g, ''))
        }
    }

    words = [...newArray]
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
        const reslyrics = response.data.split("\n").filter((x) => x.length);
        setSongLyricsArray(reslyrics);
        setWordCloudARray(reslyrics)
        setLyricsLoaded(true);
 
      });
    } catch (err) {
      console.log(err);
    }
  }, [songID, lyricsUrl]);

  return (
    <div className="song-data-main">
      <h1>{title}</h1>
      {lyricsLoaded ? (
        songLyricsArray.map((verse) => {
          return <p key={verse.id}>{verse}</p>;
        })
      ) : (
        <div>
          <Spinner message={"test"} />
          <span>Fetching Lyrics & Data..This could take a minute...</span>
        </div>
      )}
      <CheckBox
        checked={cloudChecked}
        label="Display word cloud"
        onClick={(event) => setCloudChecked(event.target.checked)}
        color={"green"}
      />
      {cloudChecked ? (
        <div>
          <div className="wordcloud">
            <Wordcloud
              words={words}
              width={1000}
              height={1000}
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
        <p />
      )}

      <Button
        primary
        label="Return to search!"
        onClick={() => {
          navigate("/");
        }}
      />
    </div>
  );
}
