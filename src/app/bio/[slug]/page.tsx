import { getBioPost } from '@/app/actions/bio';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function BioPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBioPost(slug);

  if (!post) {
    return (
      <main className="min-h-screen p-10 text-center">
        <h1 className="text-2xl font-bold">Protocol not found.</h1>
        <Link href="/bio" className="text-primary mt-4 inline-block">Return to Database</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[url('/bg-grid.svg')] p-6 pb-20">
      <article className="max-w-3xl mx-auto">
        <Link href="/bio" className="text-gray-500 hover:text-white flex items-center gap-2 mb-8 text-sm w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Database
        </Link>
        
        <header className="mb-10 border-b border-white/10 pb-10">
          <span className="text-xs font-bold text-green-400 uppercase tracking-widest mb-2 block">{post.category}</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">{post.title}</h1>
          <div className="text-sm text-gray-500">
            Updated: {new Date(post.updatedAt).toLocaleDateString()}
          </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-gray-100 prose-a:text-green-400 prose-strong:text-white">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
