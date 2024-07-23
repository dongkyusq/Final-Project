'use client';

import { useState } from 'react';
import BookMark from './BookMark';
import AccountList from './AccountList';
import MyCommentList from './MyCommentList';
import MyPostList from './MyPostList';
import Portfolio from './Portfolio';
import EditProfile from './EditProfile';

export default function AllMypage() {
  const liStyle = 'text-gray-700  cursor-pointer';
  const activeStyle = 'text-gray-700 cursor-pointer font-bold';

  const [activeComponent, setActiveComponent] = useState('BookMark');

  const [showModal, setShowModal] = useState(false);
  const clickModal = () => setShowModal(!showModal);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'BookMark':
        return <BookMark />;
      case 'AccountList':
        return <AccountList />;
      case 'MyCommentList':
        return <MyCommentList />;
      case 'MyPostList':
        return <MyPostList />;
      case 'Portfolio':
        return <Portfolio />;
    }
  };

  return (
    <div className="flex flex-col max-w-[80%] m-auto bg-white">
      <div className="flex flex-1">
        <aside className="w-64  p-4">
          <div className="flex flex-col items-center mb-6   p-4 rounded">
            <div className="w-[180px] h-[180px] bg-black rounded-full mb-4"></div>
            <div className="text-black font-bold mb-4">닉네임</div>

            <button className="mb-2 px-4  w-[244px] h-[36px] text-white rounded-[30px]  bg-black " onClick={clickModal}>
              프로필 수정하기 ✏️
            </button>
            {showModal && <EditProfile clickModal={clickModal} />}

            <button className="mb-2 px-4  w-[244px] h-[36px] text-white rounded-[30px]  bg-black">전문가로 전환</button>
          </div>
          <ul className="space-y-4 mt-[64px]">
            <li className="text-[20px] font-bold">나의 활동</li>

            <li
              className={activeComponent === 'BookMark' ? activeStyle : liStyle}
              onClick={() => setActiveComponent('BookMark')}
            >
              찜한 목록
            </li>
            <li
              className={activeComponent === 'MyPostList' ? activeStyle : liStyle}
              onClick={() => setActiveComponent('MyPostList')}
            >
              내가 쓴 글
            </li>
            <li
              className={activeComponent === 'MyCommentList' ? activeStyle : liStyle}
              onClick={() => setActiveComponent('MyCommentList')}
            >
              내가 쓴 댓글
            </li>
            <li
              className={activeComponent === 'AccountList' ? activeStyle : liStyle}
              onClick={() => setActiveComponent('AccountList')}
            >
              거래내역
            </li>
            <li
              className={activeComponent === 'Portfolio' ? activeStyle : liStyle}
              onClick={() => setActiveComponent('Portfolio')}
            >
              포트폴리오 수정
            </li>
          </ul>
        </aside>
        <main className="flex-1 p-8">
          <h1 className="flex  text-2xl font-bold mt-[40px] w-full  ">{renderComponent()}</h1>
        </main>
      </div>
    </div>
  );
}
