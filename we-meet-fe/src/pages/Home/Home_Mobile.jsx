import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home_Mobile = () => {
  return (
    <>
      <div>모바일 홈페이지</div>
      <Link to="/create">
        <button>미팅 생성하기</button>
      </Link>
    </>
  );
};

export default Home_Mobile;
