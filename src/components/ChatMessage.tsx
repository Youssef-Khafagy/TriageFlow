import { Activity } from 'lucide-react';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}

export default function ChatMessage({ role, content, isTyping }: MessageProps) {
  const isUser = role === 'user';

  if (isTyping) {
    return (
      <div className="flex justify-start animate-fade-up">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--color-primary-light)' }}>
            <Activity size={14} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="rounded-2xl rounded-tl-md px-4 py-3 border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--text-muted)', animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--text-muted)', animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--text-muted)', animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-up`}>
      {!isUser && (
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--color-primary-light)' }}>
            <Activity size={14} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="max-w-[80%] rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-relaxed border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
            {content}
          </div>
        </div>
      )}
      {isUser && (
        <div className="max-w-[80%] rounded-2xl rounded-tr-md px-4 py-3 text-sm leading-relaxed text-white shadow-md" style={{ background: 'var(--color-primary)' }}>
          {content}
        </div>
      )}
    </div>
  );
}