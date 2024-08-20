'use client';

import useAuthStore from '@/zustand/authStore';
import favicon from '../../../../../../public/vercel.svg';
import { CommunityComments } from '@/types/type';
// import ReactQuill from 'react-quill';
import { FormEvent, useState } from 'react';
// import { comment } from 'postcss';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import MDEditor, { commands } from '@uiw/react-md-editor';
import '../../../../../css/commentMdStyle.css';
import Image from 'next/image';

export default function CommuComment() {
  const [value, setValue] = useState<string | undefined>('');
  const { isLogin, userId } = useAuthStore();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const handleCheckLogin = () => {
    if (!isLogin) {
      alert('로그인 후 이용해주세요.');
      const presentPage = window.location.href;
      const pagePathname = new URL(presentPage).pathname;
      Cookies.set('returnPage', pagePathname);
      router.push('/login');
    }
  };

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const form = e.target as HTMLFormElement;
  //   const formData = new FormData(form);
  //   const commentData: string = formData.get('comment') as string;

  //   const response = await fetch('/api/communityComments', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ id, commentData, userId })
  //   }).then((res) => res.json());
  // };

  const handleSubmit = async () => {
    const commentData = value?.trim();

    if (!commentData) {
      alert('댓글을 입력해주세요.');
      return;
    }

    const response = await fetch('/api/communityComments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, commentData, userId })
    }).then((res) => res.json());
  };

  const getComments = async (): Promise<CommunityComments[]> => {
    const response = await fetch('/api/communityComments');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CommunityComments[] = await response.json();

    const filteredData = data.filter((comment) => comment.community_post_id === id);
    console.log(filteredData);
    return filteredData;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['comment', id],
    queryFn: getComments,
    enabled: !!id
  });

  // data의 총 개수를 계산
  const commentCount = data ? data.length : 0;

  return (
    <div className="flex flex-col">
      <div className="flex gap-[8px]">
        <Image src="/comment.svg" alt="댓글" width={24} height={24} />
        <p className="text-[16px] text-gray-400 font-bold">{commentCount}</p>
      </div>
      <div className="flex gap-[32px] mt-[32px]">
        <div data-color-mode="light" className="w-[995px] rounded-[8px]">
          <MDEditor
            onClick={handleCheckLogin}
            height={100}
            value={value}
            onChange={setValue}
            textareaProps={{ placeholder: '도움이 되는 댓글을 등록하세요!' }}
            commands={[]}
          />
        </div>
        <>
          {/* <ReactQuill value={value} onChange={(e) => setValue(e.target.value)} />
          <input type="hidden" name="editorContent" value={value} />
          <button type="submit">Submit</button> */}
        </>
        <button
          onClick={async () => {
            handleCheckLogin();
            await handleSubmit();
          }}
          className="w-[173px] h-[101px] rounded-lg bg-primary-500 text-white font-bold text-base flex items-center justify-center hover:bg-primary-700 hover:cursor-pointer"
        >
          <span className="hidden sm:block">댓글 등록</span>
          <span className="block sm:hidden">등록</span>
        </button>
        {/* 댓글 등록 부분 색이 회색인데 이게 맞는건지? 버튼 컬러는 보통 다른 걸로 알고 있어서... */}
      </div>
    </div>
  );
}
