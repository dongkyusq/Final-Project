import { CommunityComments } from '@/types/type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function MyCommentList() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const getComments = async () => {
    const response = await fetch('/api/commentsRead');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CommunityComments[] = await response.json();
    return data.filter((post) => post.user_id === id);
  };

  const { data } = useQuery<CommunityComments[]>({
    queryKey: ['post', id],
    queryFn: getComments,
    enabled: !!id
  });

  const deleteComment = async (id: string) => {
    const response = await fetch('/api/commentsRead', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  const { mutate: deleteMutation } = useMutation<CommunityComments, Error, string>({
    mutationFn: (id) => deleteComment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['post', id] })
  });

  const handleDelete = (id: string) => {
    const confirmed = confirm('정말로 삭제하시겠습니까?');
    if (confirmed) {
      try {
        deleteMutation(id);
      } catch (error) {
        console.error('삭제에 실패했습니다.', error);
      }
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full bg-white border border-gray-300 rounded-md p-6 text-center h-96">
        <Image src="/cryingLogo.svg" alt="cryingLogo" width={30} height={30} className="w-24 h-24 mx-auto mb-4" />
        <div className="text-lg font-semibold mb-2">아직 남긴 댓글이 없어요</div>
        <div className="text-sm text-gray-600 mb-4">다른 사람의 글을 읽어보고 답변을 남겨보세요 </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-10">
        <h2 className="text-2xl font-bold">내가 쓴 댓글</h2>
      </div>
      <div className="space-y-4">
        {data.map((post) => (
          <div
            key={post.id}
            className="bg-white p-4 border border-gray-400 rounded-2xl flex justify-between items-center"
          >
            <div>
              <p
                className="text-[16px] ml-8 mb-4 mt-3 mr-5"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {post.contents}
              </p>
              <p className="ml-8 mb-3">
                <span className="text-gray-500 text-[14px] mr-10">{post.created_at.slice(0, 10)}</span>
              </p>
            </div>
            <button
              onClick={() => handleDelete(post.id)}
              className="mt-4 p-2 w-20 text-base border border-primary-500 text-primary-500 hover:bg-primary-50 rounded"
            >
              댓글 삭제
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
