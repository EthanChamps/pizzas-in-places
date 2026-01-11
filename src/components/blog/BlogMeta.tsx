interface BlogMetaProps {
  date: string;
  readingTime: number;
  tags?: string[];
}

export default function BlogMeta({ date, readingTime, tags }: BlogMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-sm text-neutral-500">
      <p>
        {new Date(date).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
      <span aria-hidden="true">•</span>
      <p>{readingTime} min read</p>
      {tags && tags.length > 0 && (
        <>
          <span aria-hidden="true">•</span>
          <div className="flex gap-2">
            {tags.map(tag => (
              <span key={tag} className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded text-xs uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
