import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Button, TextInput, Tag, Layer, Keyboard, Footer } from "grommet";
import "./pageStyle.css";
import { motion } from "framer-motion";
import SongPage from "./SongPage.tsx";
import ScaleLoader from "react-spinners/ScaleLoader";

const searchResults: any = [];
const mainTheme = "#7D4CDB";
const secondaryTheme = "#6FFFB0";

export default function Main() {
  const [isLoaded, setLoad] = useState<boolean>(true);
  const [tagClicked, setTagClicked] = useState<boolean>(false);
  const [inputSearch, setInputSearch] = useState<any>("");
  const [data, setData] = useState<any>([]);
  const [songID, setSongID] = useState();
  const [currentData, setCurrentData] = useState();

  const setSearchInput = (e: String) => {
    setInputSearch(e);
  };

  // API GET Request upon button click
  const handleSearchClick = () => {
    if (inputSearch.match(/^ *$/) !== null) {
      alert("Please enter a song or artist");
      return;
    }
    if (!inputSearch.match(/^[\s\w\d\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]*$/)) {
      alert("Apologies! This app supports English only :(");
      return;
    }
    // sets searchResults to empty array initially
    searchResults.length = 0;
    setLoad(false);
    Axios.get("http://localhost:3001/api/search/" + inputSearch, {
      method: "GET",
      params: {
        search: JSON.stringify(inputSearch),
      },
    })
      .then((response: any) => {
        setData(response.data.response.hits);
      })
      .catch((error) => {
        alert("Please try again later.");
        setLoad(true);
      });
  };

  //   on results <Tag> click -> sets songID for secondary search (lyrics)
  const handleTagClick = (
    title: typeof data,
    artist: typeof data,
    id: typeof data,
    albumCover: typeof data,
    lyricsUrl: typeof data,
    releaseDate: typeof data,
    isHot: typeof data,
    pageViews: typeof data,
    releaseDateComp: typeof data,
    artistID: typeof data,
  ) => {
    setSongID(id);
    const passData = {
      title: title,
      artist: artist,
      id: id,
      albumCover: albumCover,
      lyricsUrl: lyricsUrl,
      releaseDate: releaseDate,
      isHot: isHot,
      pageViews: pageViews,
      releaseDateComp: releaseDateComp,
      artistID: artistID
    };
    setCurrentData(passData);
    setTagClicked(true);
  };

  // props for rendered <Tag>
  const tagProps = {
    id: "result-tags",
  };

  // Executes upon [data] state change, adds to searchResults[]
  useEffect(() => {
    for (const item of Object.entries(data)) {
      let res: any = item[1];
      const val = {
        type: res.type,
        artist: res.result.artist_names,
        title: res.result.title,
        id: res.result.id,
        albumCover: res.result.header_image_url,
        lyricsUrl: res.result.url,
        releaseDate: res.result.release_date_for_display,
        isHot: res.result.stats.hot,
        pageViews: res.result.stats.pageviews,
        releaseDateComp: res.result.release_date_components,
        artistID: res.result.primary_artist.id
      };
      searchResults.push(val);
    }
    setLoad(true);
  }, [data]);

  return (
    <div className="main-page">
      <Keyboard onEnter={handleSearchClick}>
        <div>
          <TextInput
            id="text-input"
            placeholder="Search song or artist"
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button
            id="search-button"
            primary
            label="Search!"
            onClick={handleSearchClick}
          />
        </div>
      </Keyboard>
      {isLoaded ? (
        <div className="results-component">
          {searchResults.map((item?: any) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            >
              {/* <Avatar id="album-covers" src={item.albumCover} /> */}
              <Tag
                {...tagProps}
                key={item.id}
                value={item.title}
                name={item.artist}
                size="small"
                onClick={() =>
                  handleTagClick(
                    item.title,
                    item.artist,
                    item.id,
                    item.albumCover,
                    item.lyricsUrl,
                    item.releaseDate,
                    item.isHot,
                    item.pageViews,
                    item.releaseDateComp,
                    item.artistID
                  )
                }
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div id="result-spinner">
          <ScaleLoader color={secondaryTheme} />
        </div>
      )}
      {tagClicked && (
        <Layer
          dark={false}
          opacity={"true"}
          color="neutral-1"
          onEsc={() => setTagClicked(false)}
          onClickOutside={() => setTagClicked(false)}
        >
          <SongPage params={currentData} />
        </Layer>
      )}
      {/* <Footer>
        <Text>Background Image by : Mohammad Metri</Text>
      </Footer> */}
    </div>
  );
}
