import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Text } from "@visx/text";
import { scaleLog } from "@visx/scale";
import { Wordcloud } from "@visx/wordcloud";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckBox,
  DataTable,
  Button,
  Box,
  Meter,
  Image,
  NameValueList,
  NameValuePair,
} from "grommet";
import { NLTK } from "../assets/NLTK.ts";
import ScaleLoader from "react-spinners/ScaleLoader";

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

const colors = ["#55A1F2", "#29A67D", "#49F2BB"];
// const mainTheme = "#7D4CDB";
const secondaryTheme = "#6FFFB0";

export default function DataPage({
  width,
  height,
  showControls,
}: ExampleProps) {
  // Initial Props/States received
  const { state } = useLocation();
  const navigate = useNavigate();
  const date = new Date();
  const lyricsUrl = state.lyricsUrl || undefined;
  // const songID = state.id || undefined;
  const title = state.title || undefined;
  const albumCover = state.albumCover || undefined;
  const isHot = state.isHot || undefined;
  const pageViews = state.pageViews || undefined;
  const releaseDate = state.releaseDateComp || {
    year: undefined,
    month: undefined,
    day: undefined,
  };
  var wordCount = 0;
  // const artistID = state.artistID || undefined;

  // word cloud stuff
  const [spiralType, setSpiralType] = useState<SpiralType>("archimedean");
  const [withRotation, setWithRotation] = useState(false);

  // States
  // const [songLyrics, setSongLyrics] = useState();
  const [songLyricsArray, setSongLyricsArray] = useState([]);
  // const [wordCloudArray, setWordCloudArray] = useState([]); // If we need to separately keep track (mem issues)
  const [cloudChecked, setCloudChecked] = useState(false);
  const [lyricsLoaded, setLyricsLoaded] = useState(false);
  const mostUsed = [];

  const patterns = [
    "Dom Kennedy & Hit-Boy “CORSA” Official Lyrics & Meaning | Verified",
  ];

  // words
  const words = wordFreq(songLyricsArray);
  // @visx Checks for word frequency of given text - for Word Cloud
  function wordFreq(text) {
    var newArray = [];
    var words = text;

    for (let i = 0; i < words.length; i++) {
      for (let j = 0; j < patterns.length; j++) {
        if (
          //eslint-disable-next-line
          words[i].match(/\[(?!\d+\])[^\[\]]+\]/g) ||
          words[i].includes(patterns[j])
        ) {
          words.splice(i, 1);
        }
      }
    }

    for (let i = 0; i < words.length; i++) {
      let temp = words[i].split(" ");
      for (const ver of temp) {
        newArray.push(ver.replace(/[^a-zA-Z0-9 ]/g, "").toUpperCase());
      }
    }

    words = [...newArray];
    newArray = []; //if we need to empty it
    const freqMap: Record<string, number> = {};
    if (words.length < 4) {
      words.push("Not");
      words.push("Enough");
      words.push("Words");
      words.push("Available");
    }

    for (const w of words) {
      if (!freqMap[w]) freqMap[w] = 0;
      freqMap[w] += 1;
    }

    // Maps most frequently used words + value, number made up by me
    for (const word of Object.entries(freqMap)) {
      if (word[0] === undefined || word === undefined) continue;
      if (!NLTK.includes(word[0].toUpperCase())) {
        let val = { word: word[0], frequency: word[1] };
        mostUsed.push(val);
      }
    }

    if (mostUsed.length < 4) {
      mostUsed.push({ word: "Not", value: "1" });
      mostUsed.push({ word: "Enough", value: "1" });
      mostUsed.push({ word: "Words", value: "1" });
      mostUsed.push({ word: "Available", value: "1" });
    }

    // sort by frequency
    mostUsed.sort((a, b) => b.frequency - a.frequency);

    //console logs
    // console.log(words);
    wordCount = words.length;

    return (
      Object.keys(freqMap).map((word) => ({
        text: word,
        value: freqMap[word],
      })) || undefined
    );
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

  //https://polar-earth-89978.herokuapp.com/
  useEffect(() => {
    try {
      Axios.get("http://localhost:3001/api/lyrics", {
        method: "GET",
        params: {
          search: encodeURIComponent(lyricsUrl),
        },
      }).then((response: string) => {
        var reslyrics = response.data.split("\n").filter((x) => x.length);
        setSongLyricsArray(reslyrics);
        // setWordCloudArray(reslyrics); // If needed
        setLyricsLoaded(true);
      });
    } catch (err) {
      console.log(err);
    }
  }, [lyricsUrl]);

  return (
    <div className="song-data-main">
      <Box id="header-box">
        <Image id="song-image" fit="cover" src={albumCover} />
        <h1 id="song-title">{title}</h1>
      </Box>
      <Button
        id="return-button"
        primary
        label="Return to Search"
        onClick={() => {
          navigate("/");
          window.location.reload();
        }}
      />
      {lyricsLoaded ? (
        songLyricsArray.map((verse) => {
          return (
            <p id="song-lyrics" key={Math.random().toString(16).slice(2)}>
              {verse}
            </p>
          );
        })
      ) : (
        <div>
          <ScaleLoader color={secondaryTheme} />
          <span>
            Fetching Lyrics & Data... This could take a couple minutes...
          </span>
        </div>
      )}
      {lyricsLoaded && (
        <div id="stats-checkbox">
          <CheckBox
            checked={cloudChecked}
            label="Display Additional Info"
            onClick={(event) => setCloudChecked(event.target.checked)}
            color={"green"}
            toggle={true}
          />
        </div>
      )}
      {cloudChecked ? (
        <div className="song-stats-component">
          <div className="wordcloud">
            <Wordcloud
              words={words}
              width={700}
              height={700}
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
            <div>
              <label>
                Spiral type &nbsp;
                <select
                  onChange={(e) => setSpiralType(e.target.value as SpiralType)}
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
          {/* 
            Data Table for Word FREQ *******************
            */}
          <DataTable
            className="song-data-table"
            columns={[
              {
                property: "word",
                header: "Word",
                primary: true,
              },
              {
                property: "frequency",
                header: "Frequency",
                render: (datum) => (
                  <Box pad={{ vertical: "xsmall" }}>
                    <Meter
                      values={[{ value: datum.frequency }]}
                      thickness="small"
                      size="small"
                    />
                  </Box>
                ),
              },
            ]}
            data={
              [
                {
                  word: mostUsed[0].word.toLowerCase(),
                  frequency: mostUsed[0].frequency * 10,
                },
                {
                  word: mostUsed[1].word.toLowerCase(),
                  frequency: mostUsed[1].frequency * 10,
                },
                {
                  word: mostUsed[2].word.toLowerCase(),
                  frequency: mostUsed[2].frequency * 10,
                },
                {
                  word: mostUsed[3].word.toLowerCase(),
                  frequency: mostUsed[3].frequency * 10,
                },
              ] || "NaN"
            }
          />
          {/*
           * Other Data Table
           */}
          <Box className="song-facts-table">
            <NameValueList layout="grid">
              <NameValuePair id="song-facts-pair">
                <h2>Additional Info</h2>
                <p>
                  This song was released in {releaseDate.year}. That was{" "}
                  {date.getFullYear() - releaseDate.year} years ago from today.
                </p>
                <p>We counted a total of {wordCount} words in this song.</p>
                <p>This song recorded {pageViews} page views on genius.com.</p>
                {isHot ? (
                  <p>This song is currently trending.</p>
                ) : (
                  <p>This song is not not currently trending.</p>
                )}
              </NameValuePair>
            </NameValueList>
          </Box>
        </div>
      ) : (
        <p />
      )}
    </div>
  );
}
