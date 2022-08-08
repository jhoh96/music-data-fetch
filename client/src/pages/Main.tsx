import React, { useState, useEffect } from "react";
import Axios from "axios";
import {
  Button,
  TextInput,
  Avatar,
  Spinner,
  Tag,
  Layer,
} from "grommet";
import "./pageStyle.css";
import { motion } from "framer-motion";
import SongPage from "./SongPage.tsx";

var searchResults: any = [];

// Framer Motion
const FadeRightWhenVisible = ({ children }: { children: any }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      variants={{
        visible: { x: 0 },
        hidden: { x: 300 },
      }}
      whileHover={{ scale: 1.1 }}
    >
      {children}
    </motion.div>
  );
};

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
    // sets searchResults to empty array initially
    searchResults = [];
    setLoad(false);
    Axios.get("http://localhost:3001/api/search/"+inputSearch, {
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
  ) => {
    setSongID(id);
    const passData = {
      title: title,
      artist: artist,
      id: id,
      albumCover: albumCover,
      lyricsUrl: lyricsUrl,
      releaseDate: releaseDate,
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
      };
      searchResults.push(val);
    }
    setLoad(true);
  }, [data]);

  return (
    <div className="main-page">
      <TextInput
        id="text-input"
        placeholder="Search song or artist"
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <Button primary label="Search!" onClick={handleSearchClick} />
      {isLoaded ? (
        <div>
          {searchResults.map((item?: any) => (
            <FadeRightWhenVisible key={item.id}>
              <Avatar id="album-covers" src={item.albumCover} />
              <Tag
                {...tagProps}
                key={item.id}
                name={item.artist}
                value={item.title}
                size="small"
                onClick={() =>
                  handleTagClick(
                    item.title,
                    item.artist,
                    item.id,
                    item.albumCover,
                    item.lyricsUrl,
                    item.releaseDate
                  )
                }
              />
            </FadeRightWhenVisible>
          ))}
        </div>
      ) : (
        <div id="result-spinner">
          <Spinner />
        </div>
      )}
      {tagClicked && (
        <Layer
          dark={false}
          opacity={'true'}
          color="neutral-1"
          onEsc={() => setTagClicked(false)}
          onClickOutside={() => setTagClicked(false)}
        >
          <SongPage params={currentData} />
        </Layer>
      )}
    </div>
  );
}
