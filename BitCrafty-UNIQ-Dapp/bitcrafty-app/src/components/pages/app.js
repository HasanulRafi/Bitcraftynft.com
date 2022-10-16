import '../style/app.css';
import Navbar from './navbar'
import React from 'react'
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import ViewAllListedHandicrafts from "./view-all-listed-handicrafts";
import PostHandicraftForSale from "./post-handicraft-for-sale";
import ViewAllOwnedHandicrafts from "./view-all-owned-handicraft";
import ViewUserListedHandicrafts from "./view-user-listed-handicraft";
import ResellHandicraft from "./resell-Handicraft";
import FetchRewards from "./fetch-rewards";

function app() {
  return (
    <>
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/" element={<ViewAllListedHandicrafts/>} />
                <Route path="/post-handicraft-for-sale" element={<PostHandicraftForSale/>} />
                <Route path="/view-all-owned-handicraft" element={<ViewAllOwnedHandicrafts/>} />
                <Route path="/view-user-listed-handicraft" element={<ViewUserListedHandicrafts/>} />
                <Route path="/resell-nft" element={<ResellHandicraft/>} />
                <Route path="/fetch-rewards" element={<FetchRewards/>} />
            </Routes>
        </Router>
    </>
  );
}

export default app;
