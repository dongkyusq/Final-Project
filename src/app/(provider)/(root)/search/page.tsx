'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useSearchPosts from '@/hooks/useSearchPosts';
import Image from 'next/image';
import Link from 'next/link';
import { CodeCategories } from '@/components/dumy';

const TABS = ['전체', 'Q&A', '인사이트', '전문가 의뢰'];
const ITEMS_PER_PAGE = 10; // 페이지당 항목 수

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const { results, filteredResults, setFilteredResults, counts, userMap } = useSearchPosts(query);
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

  const handleFilter = (category: string) => {
    setSelectedTab(category);
    setCurrentPage(1); // 필터 변경 시 페이지를 처음으로 리셋
    if (category === '전체') {
      setFilteredResults(results);
    } else if (category === '전문가 의뢰') {
      setFilteredResults(results.filter((item) => item.category === 'Request'));
    } else if (category === 'Q&A') {
      setFilteredResults(results.filter((item) => item.category === 'Community' && (item as any).post_category === 'QnA'));
    } else if (category === '인사이트') {
      setFilteredResults(results.filter((item) => item.category === 'Community' && (item as any).post_category === 'Insight'));
    }
  };

  const highlightIfMatch = (text: string, highlight: string) => {
    if (!text.toLowerCase().includes(highlight.toLowerCase())) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const getCategoryImage = (category: string) => {
    const categoryData = CodeCategories.find((cat) => cat.name === category);
    return categoryData ? categoryData.image : ':/defaultProfileimg.svg';
  };

  const getDetailPageLink = (category: string, postCategory: string, id: string) => {
    if (category === 'Request') {
      return `/pro/proDetail/${id}`;
    } else if (category === 'Community' && postCategory === 'QnA') {
      return `/qna/${id}`;
    } else if (category === 'Community' && postCategory === 'Insight') {
      return `/insight/${id}`;
    }
    return '#';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const isMobile = () => {
    return typeof window !== 'undefined' && window.innerWidth < 900;
  };

  // 페이지별로 필터링된 결과 가져오기
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 페이지네이션 버튼 생성
  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() =>{ setCurrentPage(i); scrollToTop()}}
        className={`px-4 py-2 rounded-xl ${currentPage === i ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-md mb-4 text-primary-500 mb-8 flex">
        {query}
        <p className="text-grey-300 ml-1">{`의 검색 결과`}</p>
      </h1>
      <div className="flex space-x-4 mb-12 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleFilter(tab)}
            className={`whitespace-nowrap px-4 py-2 ${
              selectedTab === tab ? 'border-b-2 border-primary-500 text-primary-500' : 'text-black'
            }`}
          >
            {tab}{' '}
            {tab === '전체'
              ? counts.total
              : tab === 'Q&A'
              ? counts.qna
              : tab === '인사이트'
              ? counts.insight
              : counts.request}
          </button>
        ))}
      </div>
      {filteredResults.length === 0 ? (
        <div className="w-auto h-screen flex ">
          <h1>검색결과가 없습니다.</h1>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8">
            {paginatedResults.map((result) => (
              <Link key={result.id} href={getDetailPageLink(result.category, (result as any).post_category, result.id)}>
                <div className="flex px-8 py-4 bg-white rounded-xl border border-grey-100 cursor-pointer">
                  {result.post_img && result.post_img.length > 0 && (
                    <div className="flex-shrink-0 hidden md:block md:w-44 md:h-44 mr-4 my-auto">
                      <Image
                        src={result.post_img[0]}
                        alt={result.title}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex flex-col flex-grow">
                    <div className="flex space-x-2 mb-1">
                      {result.lang_category && result.lang_category.slice(0, isMobile() ? 1 : result.lang_category.length).map((lang, id) => (
                        <div key={id} className="flex mb-1">
                          <Image src={getCategoryImage(lang)} alt={lang} width={24} height={24} className="rounded" />
                          <div>
                            <span
                              className={`rounded px-2 py-1 text-sm ${
                                lang.toLowerCase().includes(query.toLowerCase())
                                  ? 'text-primary-400'
                                  : 'bg-white text-grey-500'
                              }`}
                            >
                              {lang}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <h2 className="text-lg font-medium mb-2">{highlightIfMatch(result.title, query)}</h2>
                    <p className="text-md text-grey-500 mb-2">{highlightIfMatch(truncateText(result.content, isMobile() ? 25 : 180), query)}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400">{userMap[result.user_id] || "알수없음"}</p>
                    </div>
                    <div className="flex mt-4">
                      <div className="flex items-center">
                        <span className="ml-1 text-gray-500">댓글수</span>
                      </div>
                      <div className="flex items-center">
                        <span className="ml-1 text-gray-500">좋아요</span>
                      </div>
                      <p className="text-sm text-gray-400 ml-auto">{new Date(result.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex mt-8 gap-2">
            {paginationButtons}
          </div>
        </>
      )}
    </div>
  );
}

export default function Search() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
